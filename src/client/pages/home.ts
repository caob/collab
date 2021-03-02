import { get } from "httpie";

const home = document.getElementById('home');

Array.from(home.querySelectorAll('ul li a')).forEach((joinSessionLink) => {
  joinSessionLink.addEventListener("click", async (e) => {
    e.preventDefault();
    const owner = window.location.search.substr(3) ? window.location.search.substr(3) : 'dm';
    const target = e.target as HTMLElement;
    if (target.dataset.room) {
      location.hash = `${owner}_${target.dataset.room}`;
    }
  });
});

export async function showHome(owner) {
  owner = owner ? `/o/${owner}` : '/o/dm'
  home.classList.remove('hidden');
  const previousSessionsEl = home.querySelector('.previous-sessions');
  previousSessionsEl.innerHTML = "";

  const drawings = (await get(`/drawings${owner}`)).data;
  drawings.forEach(drawing => {
    const drawingEl = document.createElement('li');
    const drawingAnchorEl = document.createElement('a');
    const when = new Date(drawing.createdAt).toLocaleString();
    drawingAnchorEl.href = `#${drawing._id}`;
    drawingAnchorEl.innerText = `Sala ${drawing.mode.substr(7)} (${when})`;

    drawingEl.appendChild(drawingAnchorEl);
    previousSessionsEl.appendChild(drawingEl);

  });
  //console.log(drawings);
}

export function hideHome() {
  home.classList.add('hidden');
}