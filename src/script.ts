const canvas = document.querySelector<HTMLDivElement>(".canvas")!;

const state = {
  gridSize: 16,
};

function createGrid(size: number) {
  canvas.replaceChildren();

  canvas.style.gridTemplateColumns = `repeat(${size}, 1fr)`;

  for (let i = 0; i < size * size; i++) {
    const cell = document.createElement("div");
    cell.className = "canvas__cell";

    canvas.appendChild(cell);
  }
}

function init() {
  createGrid(state.gridSize);
}

init();
