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
  cooldown: number = 0

  constructor (app: PIXI.Application<HTMLCanvasElement>, player: Player, params: Partial<ShootingParams>) {
    this.app = app
    this.player = player
    this.params = { maxBullets: params.maxBullets ?? DEFAULT_MAX_BULLETS, bulletsTimeout: params.bulletsTimeout ?? DEFAULT_BULLETS_TIMEOUT }
  }

  fire = (): void => {
    if (this.bullets.length < this.params.maxBullets) {
      const bullet = new Bullet(this.app, this.player, {})
      this.bullets.push(bullet)
    }
  }

  // eslint-disable-next-line
  set shoot (shooting: boolean) {
    if (shooting && this.cooldown <= 0) {
      this.fire()
      this.cooldown = this.params.bulletsTimeout
    }
  }

  update = (): void => {
    if (this.cooldown > 0) {
      this.cooldown -= this.app.ticker.elapsedMS
    }
    this.bullets.forEach(b => { b.update() })
  }
}
