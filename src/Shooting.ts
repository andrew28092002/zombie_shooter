import type * as PIXI from 'pixi.js'
import { type Player } from './Player'
import { Bullet } from './Bullet'

export interface ShootingParams {
  maxBullets: number
  bulletsTimeout: number
}

const DEFAULT_MAX_BULLETS = 100
const DEFAULT_BULLETS_TIMEOUT = 100

export class Shooting {
  app: PIXI.Application<HTMLCanvasElement>
  player: Player
  params: Required<ShootingParams>
  bullets: Bullet[] = []
  fireTimeout?: NodeJS.Timeout
  canFire = true

  constructor (app: PIXI.Application<HTMLCanvasElement>, player: Player, params: Partial<ShootingParams>) {
    this.app = app
    this.player = player
    this.params = { maxBullets: params.maxBullets ?? DEFAULT_MAX_BULLETS, bulletsTimeout: params.bulletsTimeout ?? DEFAULT_BULLETS_TIMEOUT }
  }

  fire = (): void => {
    if (this.canFire) {
      if (this.bullets.length < this.params.maxBullets) {
        const bullet = new Bullet(this.app, this.player, {})
        this.bullets.push(bullet)
        this.canFire = false

        this.fireTimeout = setTimeout(() => { this.canFire = true }, this.params.bulletsTimeout)
      }
    }
  }

  bulletWentOfScreen = (bullet: Bullet): boolean => {
    const bulletPosition = bullet.bullet.position

    return (
      bulletPosition.x <= 0 ||
      bulletPosition.y <= 0 ||
      bulletPosition.y >= this.app.view.height ||
      bulletPosition.x >= this.app.view.width
    )
  }

  update = (): void => {
    this.bullets.forEach(b => {
      b.update()
      if (this.bulletWentOfScreen(b)) {
        this.bullets = this.bullets.filter(f => f !== b)
        b.destroy()
      }
    })
  }
}
