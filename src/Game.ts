import { type Application } from 'pixi.js'
import * as PIXI from 'pixi.js'
import { Player } from './Player'

export class Game {
  app: Application<HTMLCanvasElement>
  view: HTMLCanvasElement
  person!: PIXI.Sprite
  keys: Record<string, boolean> = {}

  constructor () {
    this.app = new PIXI.Application<HTMLCanvasElement>({
      background: '#375b63',
      resizeTo: window,
      width: window.innerWidth,
      height: window.innerHeight
    })
    this.view = this.app.view
    this.app.stage.eventMode = 'dynamic'
    this.setup()

    window.addEventListener('keydown', this.handleKeyDown)
    window.addEventListener('keyup', this.handleKeyUp)
  }

  handleKeyDown = (event: KeyboardEvent): void => {
    this.keys[event.code] = true
  }

  handleKeyUp = (event: KeyboardEvent): void => {
    if (this.keys[event.code]) {
      // eslint-disable-next-line
      delete this.keys[event.code]
    }
  }

  setup = (): void => {
    this.setupPlayer()
  }

  setupPlayer = (): void => {
    const player = new Player(this.app, this.keys)
  }
}
