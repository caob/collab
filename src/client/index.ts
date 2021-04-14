import "./css/index.css";
import "./thirdparty/jscolor";
import { showHome, hideHome } from "./pages/home";
import { showDrawing, hideDrawing } from "./pages/drawing";
import { hidePizarra, showPizarra } from "./pages/pizarra";
import { hideTictac, showTictac } from "./pages/tictac";

const salas = ['dv_sala1', 'dv_sala2', 'dv_sala3', 'dv_sala4','dm_sala1', 'dm_sala2', 'dm_sala3', 'dm_sala4', 'dv_tictactoe', 'dm_tictactoe'];
const owner = window.location.search.substr(3);
//search: "?o=dv"

/**
 * Navigation
 */
window.addEventListener("hashchange", (e) => {
  const hash = window.location.hash.substr(1);
  
  if (!hash) {
    showHome(owner);
    hidePizarra();
    hideDrawing();
    hideTictac();

  } else if (hash.indexOf('tictac') !== -1) {
    showTictac();
    hideHome();
    hideDrawing();
    hidePizarra();

  } else if (salas.indexOf(hash) !== -1) {
    showPizarra(hash);
    hideHome();
    hideDrawing();
    hideTictac();

  } else {
    showDrawing(hash);
    hideHome();
  }
});

showHome(owner);