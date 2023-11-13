import { type Application } from 'pixi.js'
import * as PIXI from 'pixi.js'
import { Shooting } from './Shooting'

export class Player {
  player: PIXI.Sprite
  shooting: Shooting
  speed: number
  leftMouseButtonDown = false

  get position (): PIXI.ObservablePoint<any> {
    return this.player.position
  }

  constructor (public app: Application<HTMLCanvasElement>, public keys: Record<string, boolean>, speed: number = 5) {
    this.player = this.initPlayer()
    this.speed = speed
    this.shooting = new Shooting(this.app, this, {})

    app.stage.addChild(this.player)

    window.addEventListener('mousedown', this.handleMouseDown)
    window.addEventListener('mouseup', this.handleMouseUp)
  }

  handleMouseDown = (event: MouseEvent): void => {
    if (event.button === 0) {
      this.leftMouseButtonDown = true
    }
  }

  handleMouseUp = (event: MouseEvent): void => {
    if (event.button === 0) {
      this.leftMouseButtonDown = false
    }
  }

  initPlayer = (): PIXI.Sprite => {
    const person = new PIXI.Sprite(PIXI.Texture.WHITE)
    person.position.set(this.app.screen.width / 2, this.app.screen.height / 2)
    person.anchor.set(0.5)
    person.width = person.height = 32

    return person
  }

  update = (): void => {
    const mouse = this.app.renderer.events.pointer
    const cursorPosition = mouse.global

    if (this.leftMouseButtonDown) {
      this.shooting.fire()
    }
    this.shooting.update()

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
