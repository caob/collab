import "./css/index.css";
import "./thirdparty/jscolor";
import { showHome, hideHome } from "./pages/home";
import { showDrawing, hideDrawing } from "./pages/drawing";
import { hidePizarra, showPizarra } from "./pages/pizarra";

const salas = ['sala1', 'sala2', 'sala3', 'sala4', 'sala5'];
// const salas = ['sala', '5minutes', '1hour', '1day', '1week'];

/**
 * Navigation
 */
window.addEventListener("hashchange", (e) => {
  const hash = window.location.hash.substr(1);
  if (hash.length === 0) {
    showHome();
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

showHome();