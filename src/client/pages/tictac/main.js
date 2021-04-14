import * as PIXI from 'pixi.js'
import Application from './Application';
import TitleScreen from './screens/TitleScreen'

var loader = new PIXI.loaders.Loader();
// loader.add('logo', 'images/logo.png')
// loader.add('background', 'images/background.jpg')
// loader.add('logo2', 'images/intuit-logo-blanco.png')

// loader.add('clock-icon', 'images/clock-icon.png')
// loader.add('board', 'images/board.png')

loader.on('complete', () => {
  var loading = document.querySelector('.loading');
  //document.body.removeChild(loading);
  document.getElementById('tictac').removeChild(loading);

  var app = new Application()
  app.gotoScene (TitleScreen)
  app.update()
})

loader.load();
