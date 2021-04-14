import * as PIXI from 'pixi.js'

import Application from '../Application'
import GameScreen from './GameScreen'

import LocalStorage from '../core/LocalStorage'

export default class EndGameScreen extends PIXI.Container {

  constructor (options = {}) {
    super()

    let titleText = "Empate!"
      , incrementAttribute = null

    if (options.draw) {
      titleText = "Empate"
      incrementAttribute = 'draw'

    } else if (options.won) {
      titleText = "Ganaste!"
      incrementAttribute = 'win'

    } else {
      titleText = "Perdiste"
      incrementAttribute = 'loss'
    }

    // increment statistics
    LocalStorage.set( incrementAttribute, LocalStorage.get(incrementAttribute)+1 )

    this.title = new PIXI.Text(titleText, {
      font: "132px JennaSue",
      fill: '#fff',
      // fill: 0xfff,
      textAlign: 'center'
    })
    this.title.pivot.x = this.title.width / 2
    this.addChild(this.title)

    this.instructionText = new PIXI.Text("tocar para jugar de nuevo", {
      font: "52px JennaSue",
      fill: '#fff',
      // fill: 0xfff,
      textAlign: 'center'
    })
    this.instructionText.pivot.x = this.instructionText.width / 2
    this.instructionText.pivot.y = this.instructionText.height / 2
    this.addChild(this.instructionText)

    let statuses = `😃 ${ LocalStorage.get('win') } | 😐 ${ LocalStorage.get('draw') } | 😩 ${ LocalStorage.get('loss') } `
    this.statusesText = new PIXI.Text(statuses, {
      font: "52px JennaSue",
      fill: '#fff',
      // fill: 0xfff,
      textAlign: 'center'
    })
    this.statusesText.pivot.x = this.statusesText.width / 2
    this.statusesText.pivot.y = this.statusesText.height / 2
    this.addChild(this.statusesText)

    this.logo = new PIXI.Sprite.fromImage('/src/client/images/intuit-logo-blanco.png')
    this.logo.pivot.x = this.logo.width / 2
    this.addChild(this.logo)

    this.interactive = true
    this.once('click', this.startGame.bind(this))
    this.once('touchstart', this.startGame.bind(this))

    this.on('dispose', this.onDispose.bind(this))
  }

  transitionIn () {
    tweener.add(this.title).from({y: this.title.y - 10, alpha: 0}, 300, Tweener.ease.quintOut)
    tweener.add(this.logo).from({ y: this.logo.y + 10, alpha: 0 }, 300, Tweener.ease.quintOut)
    tweener.add(this.statusesText).from({ alpha: 0 }, 300, Tweener.ease.quintOut)
    return tweener.add(this.instructionText).from({ alpha: 0 }, 300, Tweener.ease.quintOut)
  }

  transitionOut () {
    tweener.remove(this.title)
    tweener.remove(this.logo)
    tweener.remove(this.statusesText)
    tweener.remove(this.instructionText)

    tweener.add(this.title).to({y: this.title.y - 10, alpha: 0}, 300, Tweener.ease.quintOut)
    tweener.add(this.logo).to({ y: this.logo.y + 10, alpha: 0 }, 300, Tweener.ease.quintOut)
    tweener.add(this.statusesText).to({ alpha: 0 }, 300, Tweener.ease.quintOut)
    return tweener.add(this.instructionText).to({ alpha: 0 }, 300, Tweener.ease.quintOut)
  }

  startGame () {
    this.emit('goto', GameScreen)
  }

  onResize () {
    this.MARGIN = (Application.WIDTH / 100) * 8 // 5%

    this.title.x = Application.WIDTH / 2;
    this.title.y = this.MARGIN

    this.instructionText.x = Application.WIDTH / 2
    this.instructionText.y = Application.HEIGHT / 2 - this.instructionText.height / 3.8

    this.statusesText.x = Application.WIDTH / 2
    this.statusesText.y = this.instructionText.y + this.instructionText.height + 10

    this.logo.x = Application.WIDTH / 2
    this.logo.y = Application.HEIGHT - this.logo.height - this.MARGIN
  }

  onDispose () {
  }

}
