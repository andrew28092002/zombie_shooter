import { Game } from './Game'

const init = (): void => {
  const game = new Game()

  document.body.appendChild(game.view)
}

init()
