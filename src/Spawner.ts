import type * as PIXI from 'pixi.js'
import { type Player } from './Player'
import { Zombie } from './Zombie'

export interface SpawnerParams {
  maxCount?: number
  maxSpawns?: number
  spawnInterval?: number
}

const DEFAULT_MAX_COUNT = 1000
const DEFAULT_MAX_SPAWNS = 1000
const DEFAULT_INTERVAL = 1000

export class Spawner {
  app: PIXI.Application<HTMLCanvasElement>
  player: Player
  params: Required<SpawnerParams>
  zombies: Zombie[] = []
  spawnsCount: number = 0

  constructor (app: PIXI.Application<HTMLCanvasElement>, player: Player, params: SpawnerParams) {
    this.params = { ...params, maxCount: params.maxCount ?? DEFAULT_MAX_COUNT, spawnInterval: params.spawnInterval ?? DEFAULT_INTERVAL, maxSpawns: params.maxSpawns ?? DEFAULT_MAX_SPAWNS }
    this.app = app
    this.player = player
    setInterval(() => { this.spawn() }, this.params.spawnInterval)
  }

  get zombiesGraphic (): PIXI.Graphics[] {
    return this.zombies.map(z => z.zombie)
  }

  spawn = (): void => {
    if (this.spawnsCount < this.params.maxSpawns) {
      this.spawnsCount += 1
      const zombieInstance = new Zombie(this.app, this.player, {})
      this.zombies.push(zombieInstance)
    }
  }

  update = (player: Player): void => {
    this.zombies.forEach(z => { z.update(player, this.zombiesGraphic) })
  }
}
