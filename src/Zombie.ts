import * as PIXI from 'pixi.js'
import { type Player } from './Player'

const DEFAULT_ZOMBIE_SPEED = 5
const DEFAULT_ENEMY_RADIUS = 16

export interface ZombieParams {
  enemyRadius: number
  speed: number
}

export class Zombie {
  params: ZombieParams
  zombies: PIXI.Graphics[] = []
  canCreate: boolean = true

  constructor (public app: PIXI.Application<HTMLCanvasElement>, params: Partial<ZombieParams>) {
    const { speed, enemyRadius } = params
    this.params = {
      speed: speed ?? DEFAULT_ZOMBIE_SPEED,
      enemyRadius: enemyRadius ?? DEFAULT_ENEMY_RADIUS
    }
  }

  getRandomSpawnPoint = (): PIXI.Point => {
    const canvasWidth = this.app.screen.width
    const canvasHeight = this.app.screen.height

    const edge = Math.floor(Math.random() * 4)
    const spawnPoint = new PIXI.Point(0, 0)

    switch (edge) {
      // top
      case 0:
        spawnPoint.x = canvasWidth * Math.random()
        break
        // right
      case 1:
        spawnPoint.x = canvasWidth
        spawnPoint.y = canvasHeight * Math.random()
        break
        // left
      case 2:
        spawnPoint.y = canvasHeight * Math.random()
        break
        // bottom
      case 3:
        spawnPoint.x = canvasWidth * Math.random()
        spawnPoint.y = canvasHeight
        break
    }

    return spawnPoint
  }

  createZombie = (): void => {
    const { x, y } = this.getRandomSpawnPoint()
    const zombie = new PIXI.Graphics()
    zombie.position.set(x, y)
    zombie.beginFill('0xff0000', 1)
    zombie.drawCircle(0, 0, this.params.enemyRadius)
    zombie.endFill()
    this.app.stage.addChild(zombie)
    this.zombies.push(zombie)
  }

  checkCollision = (first: PIXI.Graphics | PIXI.Sprite, second: PIXI.Sprite | PIXI.Graphics): boolean => {
    return (
      first.x < second.x + second.width &&
        first.x + first.width > second.x &&
        first.y < second.y + second.height &&
        first.y + first.height > second.y
    )
  }

  handleZombieActivity = (player: Player) => (): void => {
    this.zombies.forEach(zombie => {
      const angle = Math.atan2(player.position.y - zombie.position.y, player.position.x - zombie.position.x)

      // Calculate the movement vector
      let dx = Math.cos(angle)
      let dy = Math.sin(angle)

      this.zombies.forEach(otherZombie => {
        if (otherZombie !== zombie) {
          if (this.checkCollision(zombie, otherZombie)) {
            const avoidAngle = Math.atan2(zombie.position.y - otherZombie.position.y, zombie.position.x - otherZombie.position.x)
            dx += Math.cos(avoidAngle)
            dy += Math.sin(avoidAngle)
          }
        }
      })

      // Normalize the movement vector
      const length = Math.sqrt(dx * dx + dy * dy)
      if (length !== 0) {
        dx /= length
        dy /= length
      }

      if (!this.checkCollision(zombie, player.player)) {
        // this.zombies = this.zombies.filter(z => z !== zombie)
        // zombie.destroy()
        // Move the zombie towards the player
        zombie.position.x += dx * 5
        zombie.position.y += dy * 5
      }
    })
    if (!this.canCreate && this.zombies.length === 100) {
      return
    }

    this.createZombie()
    this.canCreate = false
    setTimeout(() => {
      this.canCreate = true
    }, 3000)
  }
}
