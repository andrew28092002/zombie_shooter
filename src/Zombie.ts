import * as PIXI from 'pixi.js'
import { type Player } from './Player'

const DEFAULT_ZOMBIE_SPEED = 20
const DEFAULT_ENEMY_RADIUS = 16

export interface ZombieParams {
  enemyRadius: number
  speed: number
}

export class Zombie {
  params: ZombieParams
  player: Player
  element: PIXI.Graphics
  canCreate: boolean = true

  constructor (public app: PIXI.Application<HTMLCanvasElement>, player: Player, params: Partial<ZombieParams>) {
    const { speed, enemyRadius } = params
    this.params = {
      speed: speed ?? DEFAULT_ZOMBIE_SPEED,
      enemyRadius: enemyRadius ?? DEFAULT_ENEMY_RADIUS
    }
    this.player = player
    this.element = this.createZombie()
    this.app.stage.addChild(this.element)
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

  createZombie = (): PIXI.Graphics => {
    const { x, y } = this.getRandomSpawnPoint()
    const zombie = new PIXI.Graphics()
    zombie.position.set(x, y)
    zombie.beginFill('0xff0000', 1)
    zombie.drawCircle(0, 0, this.params.enemyRadius)
    zombie.endFill()

    return zombie
  }

  checkCollision = (first: PIXI.Graphics | PIXI.Sprite, second: PIXI.Sprite | PIXI.Graphics): boolean => {
    return (
      first.x < second.x + second.width &&
        first.x + first.width > second.x &&
        first.y < second.y + second.height &&
        first.y + first.height > second.y
    )
  }

  destroy = (): void => {
    this.element.destroy()
  }

  update = (player: Player, zombies: Zombie[]): void => {
    const zombie = this.element

    const angle = Math.atan2(player.position.y - zombie.position.y, player.position.x - zombie.position.x)

    // Calculate the movement vector
    let dx = Math.cos(angle)
    let dy = Math.sin(angle)

    zombies.forEach(otherZombie => {
      if (otherZombie.element !== zombie) {
        if (this.checkCollision(zombie, otherZombie.element)) {
          const avoidAngle = Math.atan2(zombie.position.y - otherZombie.element.position.y, zombie.position.x - otherZombie.element.position.x)
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
      zombie.position.x += dx * 5
      zombie.position.y += dy * 5
    }

    // Killing zombies
    const bullets = player.shooting.bullets

    bullets.forEach(bullet => {
      const b = bullet.bullet
      for (let indx = zombies.length - 1; indx >= 0; indx--) {
        const z = zombies[indx]
        const dx = z.element.position.x - b.position.x
        const dy = z.element.position.y - b.position.y
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance <= bullet.params.bulletRadius + this.params.enemyRadius) {
          zombies.splice(indx, 1)
          z.destroy() // Destroy the specific zombie
        }
      }
    })
  }
}
