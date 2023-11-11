import { type Application } from 'pixi.js'
import * as PIXI from 'pixi.js'

export class Player {
  player: PIXI.Sprite
  speed: number

  constructor (public app: Application<HTMLCanvasElement>, public keys: Record<string, boolean>, speed: number = 5) {
    this.player = this.initPlayer()
    this.speed = speed

    app.stage.addChild(this.player)
    app.ticker.add(this.handlePlayerActivity)
  }

  initPlayer = (): PIXI.Sprite => {
    const person = new PIXI.Sprite(PIXI.Texture.WHITE)
    person.position.set(this.app.screen.width / 2, this.app.screen.height / 2)
    person.anchor.set(0.5)
    person.width = person.height = 32

    return person
  }

  handlePlayerActivity = (): void => {
    const cursorPosition = this.app.renderer.events.pointer.global

    const angle = Math.atan2(cursorPosition.y - this.player.position.y, cursorPosition.x - this.player.position.x) + Math.PI / 2

    this.player.rotation = angle

    if (this.keys.KeyA && this.player.x - this.speed > 0) {
      this.player.x -= this.speed
    }

    if (this.keys.KeyD && this.player.x + this.speed < this.app.screen.width) {
      this.player.x += this.speed
    }

    if (this.keys.KeyW && this.player.y - this.speed > 0) {
      this.player.y -= this.speed
    }

    if (this.keys.KeyS && this.player.y + this.speed < this.app.screen.height) {
      this.player.y += this.speed
    }
  }
}