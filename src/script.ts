const canvas = document.querySelector<HTMLDivElement>(".canvas")!;
const penColorInput = document.querySelector<HTMLInputElement>("#pen-color")!;
const canvasColorInput = document.querySelector<HTMLInputElement>("#canvas-color")!;

const state = {
  penColor: penColorInput.value,
  canvasColor: canvasColorInput.value,
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

function updatePenColor() {
  state.penColor = penColorInput.value;
}

function updateCanvasColor() {
  state.canvasColor = canvasColorInput.value;
  canvas.style.backgroundColor = state.canvasColor;
}

function setupEvents() {
  penColorInput.addEventListener("input", updatePenColor);
  canvasColorInput.addEventListener("input", updateCanvasColor);
}

function init() {
  createGrid(state.gridSize);
  setupEvents();
}

init();
