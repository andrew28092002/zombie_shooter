import { type Application } from 'pixi.js'
import * as PIXI from 'pixi.js'
import { Player } from './Player'
import { Zombie } from './Zombie'

export class Game {
  app: Application<HTMLCanvasElement>
  view: HTMLCanvasElement
  player: Player
  zombies: Zombie
  keys: Record<string, boolean> = {}

  constructor () {
    this.app = new PIXI.Application<HTMLCanvasElement>({
      background: '#375b63',
      resizeTo: window,
      width: window.innerWidth,
      height: window.innerHeight
    })
    this.view = this.app.view
    this.player = new Player(this.app, this.keys)
    this.zombies = new Zombie(this.app, {})
    this.app.stage.eventMode = 'dynamic'

    window.addEventListener('keydown', this.handleKeyDown)
    window.addEventListener('keyup', this.handleKeyUp)

    this.setup()
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
    this.app.ticker.add(this.player.handlePlayerActivity)
    this.app.ticker.add(this.zombies.handleZombieActivity(this.player))
  }
}
