import * as PIXI from 'pixi.js'
import Application from './tictac/Application';
import TitleScreen from './tictac/screens/TitleScreen'
// import { get } from "httpie";
// import { State } from "../../server/rooms/State";
// import brushFunctions from "../brushes";
// import { clearCanvas } from "./pizarra";

const tictacEl = document.querySelector('#tictac');

export async function showTictac() {
  tictacEl.classList.remove('hidden');
  let loader = new PIXI.loaders.Loader();
  loader.add('logo', '../images/logo.png')
  loader.add('background', '../images/background.jpg')
  loader.add('colyseus', '../images/intuit-logo-blanco.png')

  loader.add('clock-icon', '../images/clock-icon.png')
  loader.add('board', '../images/board.png')

  loader.on('complete', () => {
    const loading = document.querySelector('.loading');
    //document.body.removeChild(loading);
    document.getElementById('tictac').removeChild(loading);

    const app = new Application()
    app.gotoScene (TitleScreen)
    app.update()
  })

  loader.load();
}

export function hideTictac() {
  tictacEl.classList.add('hidden');
}

