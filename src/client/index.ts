import "./css/index.css";
import "./thirdparty/jscolor";
import { showHome, hideHome } from "./pages/home";
import { showDrawing, hideDrawing } from "./pages/drawing";
import { hidePizarra, showPizarra } from "./pages/pizarra";

const salas = ['dv_sala1', 'dv_sala2', 'dv_sala3', 'dv_sala4','dm_sala1', 'dm_sala2', 'dm_sala3', 'dm_sala4'];
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

  } else if (salas.indexOf(hash) !== -1) {
    showPizarra(hash);
    hideHome();
    hideDrawing();

  } else {
    showDrawing(hash);
    hideHome();
  }
});

showHome(owner);