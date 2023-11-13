import * as PIXI from 'pixi.js'
import { type Player } from './Player'

export interface BulletParams {
  bulletSpeed: number
  bulletRadius: number
}

const DEFAULT_BULLET_SPEED = 25
const DEFAULT_BULLET_RADIUS = 8

export class Bullet {
  app: PIXI.Application<HTMLCanvasElement>
  player: Player
  params: Required<BulletParams>
  bullet: PIXI.Graphics
  velocity: PIXI.Point

  constructor (app: PIXI.Application<HTMLCanvasElement>, player: Player, params: Partial<BulletParams>) {
    this.app = app
    this.player = player
    this.params = { bulletSpeed: params.bulletSpeed ?? DEFAULT_BULLET_SPEED, bulletRadius: params.bulletRadius ?? DEFAULT_BULLET_RADIUS }

    const cursorPosition = this.app.renderer.events.pointer.global
    const angle = Math.atan2(cursorPosition.y - this.player.position.y, cursorPosition.x - this.player.position.x) + Math.PI / 2
    this.velocity = new PIXI.Point(Math.cos(angle), Math.sin(angle))

    this.bullet = this.createBullet()
    this.app.stage.addChild(this.bullet)
  }

  createBullet = (): PIXI.Graphics => {
    const bullet = new PIXI.Graphics()
    bullet.position.set(this.player.position.x, this.player.position.y)
    bullet.beginFill('0x0000ff', 1)
    bullet.drawCircle(0, 0, this.params.bulletRadius)
    bullet.endFill()

    return bullet
  }

  update = (): void => {
    this.bullet.position.x += this.velocity.x * this.params.bulletSpeed
    this.bullet.position.y += this.velocity.y * this.params.bulletSpeed
  }
}
