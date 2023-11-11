import * as PIXI from 'pixi.js'

const app = new PIXI.Application<HTMLCanvasElement>({
  background: '#375b63',
  resizeTo: window
})

document.body.appendChild(app.view)
