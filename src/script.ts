const canvas = document.querySelector<HTMLDivElement>(".canvas")!;
const penColorInput = document.querySelector<HTMLInputElement>("#pen-color")!;
const canvasColorInput = document.querySelector<HTMLInputElement>("#canvas-color")!;
const randomColorBtn = document.querySelector<HTMLButtonElement>(".controls__btn--random-color")!;
const eraserBtn = document.querySelector<HTMLButtonElement>(".controls__btn--eraser")!;

type Mode = "pen-color" | "random-color" | "eraser";

const state = {
  mode: "pen-color" as Mode,
  penColor: penColorInput.value,
  canvasColor: canvasColorInput.value,
  gridSize: 16,
  painted: null as HTMLDivElement | null
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

function setMode(mode: Mode) {
  state.mode = state.mode === mode ? "pen-color" : mode;

  randomColorBtn.classList.toggle("controls__btn--selected", state.mode === "random-color");
  eraserBtn.classList.toggle("controls__btn--selected", state.mode === "eraser");
}

function updatePenColor() {
  state.penColor = penColorInput.value;
}

function updateCanvasColor() {
  state.canvasColor = canvasColorInput.value;
  canvas.style.backgroundColor = state.canvasColor;
}

function paint(e: PointerEvent) {
  if (e.buttons !== 1) return;

  const cell = document.elementFromPoint(e.clientX, e.clientY);

  if (!(cell instanceof HTMLDivElement)) return;
  if (!cell.matches(".canvas__cell")) return;
  if (cell === state.painted) return;

  state.painted = cell;

  switch (state.mode) {
    case "pen-color":
      cell.style.backgroundColor = state.penColor;
      break;
    case "random-color":
      cell.style.backgroundColor = getRandomColor();
      break;
    case "eraser":
      cell.style.removeProperty("background-color");
  }
}

function getRandomColor(): string {
  const randomNumber = Math.floor(Math.random() * 0xffffff);
  const hexCode = `#${randomNumber.toString(16).padStart(6, "0")}`;

  return hexCode;
}

function setupEvents() {
  canvas.addEventListener("pointerdown", paint);
  canvas.addEventListener("pointermove", paint);
  canvas.addEventListener("pointerup", () => state.painted = null);
  canvas.addEventListener("pointerleave", () => state.painted = null);

  penColorInput.addEventListener("input", updatePenColor);
  canvasColorInput.addEventListener("input", updateCanvasColor);

  randomColorBtn.addEventListener("click", () => setMode("random-color"));
  eraserBtn.addEventListener("click", () => setMode("eraser"));
}

function init() {
  createGrid(state.gridSize);
  setupEvents();
}

init();
