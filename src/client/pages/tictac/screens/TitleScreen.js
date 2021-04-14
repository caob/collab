import * as PIXI from 'pixi.js'

import Application from '../Application'
import GameScreen from './GameScreen'

export default class TitleScreen extends PIXI.Container {

  constructor () {
    super()

    this.title = new PIXI.Sprite.fromImage("/src/client/images/logo.png")
    this.title.pivot.x = this.title.width / 2
    // this.title.pivot.x = (Application.WIDTH / 2) - (this.title.width / 2)

    this.addChild(this.title)

    this.instructionText = new PIXI.Text("Tocar para comenzar", {
      font: "62px JennaSue",
      fill: '#fff',
      // fill: 0xfff,
      textAlign: 'center'
    })
    this.instructionText.pivot.x = this.instructionText.width / 2
    this.instructionText.pivot.y = this.instructionText.height / 2
    this.addChild(this.instructionText)

    this.logo = new PIXI.Sprite.fromImage('/src/client/images/intuit-logo-blanco.png')
    this.logo.pivot.x = this.logo.width / 2
    // this.logo.pivot.x = (Application.WIDTH / 2) - (this.logo.width / 2)
    this.addChild(this.logo)

    this.interactive = true
    this.once('click', this.startGame.bind(this))
    this.once('touchstart', this.startGame.bind(this))

    this.on('dispose', this.onDispose.bind(this))
  }

  transitionIn () {
    tweener.add(this.title).from({y: this.title.y - 10, alpha: 0}, 300, Tweener.ease.quadOut)
    tweener.add(this.logo).from({ y: this.logo.y + 10, alpha: 0 }, 300, Tweener.ease.quadOut)
    return tweener.add(this.instructionText).from({ alpha: 0 }, 300, Tweener.ease.quadOut)
  }

  transitionOut () {
    tweener.remove(this.title)
    tweener.remove(this.logo)
    tweener.remove(this.instructionText)

    tweener.add(this.title).to({y: this.title.y - 10, alpha: 0}, 300, Tweener.ease.quintOut)
    tweener.add(this.logo).to({ y: this.logo.y + 10, alpha: 0 }, 300, Tweener.ease.quintOut)
    return tweener.add(this.instructionText).to({ alpha: 0 }, 300, Tweener.ease.quintOut)
  }

  startGame () {
    this.emit('goto', GameScreen)
  }

  onResize () {
    this.title.x = (Application.WIDTH / 2) - (this.title.width / 2)
    this.title.y = Application.MARGIN
    // this.title.y = Application.HEIGHT - this.title.height - this.logo.height - Application.MARGIN

    this.instructionText.x = Application.WIDTH / 2
    this.instructionText.y = Application.HEIGHT / 2 - this.instructionText.height / 3.8

    this.logo.x = (Application.WIDTH / 2) - (this.logo.width / 2)
    this.logo.y = Application.HEIGHT - this.logo.height - Application.MARGIN
  }

  onDispose () {
    window.removeEventListener('resize', this.onResizeCallback)
  }

}




