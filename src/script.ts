const canvas = document.querySelector<HTMLCanvasElement>(".canvas")!;
const ctx = canvas.getContext("2d")!;

const canvasColorInput = document.querySelector<HTMLInputElement>(".controls__input--canvas-color")!;
const paintColorInput = document.querySelector<HTMLInputElement>(".controls__input--paint-color")!;
const gridSizeLabel = document.querySelector<HTMLLabelElement>(".controls__label--grid-size")!;
const gridSizeInput = document.querySelector<HTMLInputElement>(".controls__input--grid-size")!;
const customColorBtn = document.querySelector<HTMLButtonElement>(".controls__btn--custom-color")!;
const randomColorBtn = document.querySelector<HTMLButtonElement>(".controls__btn--random-color")!;
const eraserBtn = document.querySelector<HTMLButtonElement>(".controls__btn--eraser")!;

const gridSizes = [8, 16, 32, 48, 64] as const;

type PaintMode = "custom-color" | "random-color" | "eraser";

const state = {
  canvasSize: 576,
  canvasColor: canvasColorInput.value,
  gridSize: 16,
  gridlinesColor: "#aaa",
  paintMode: "custom-color" as PaintMode,
  paintColor: paintColorInput.value,
  paintedCells: new Map<number, string>(),
  lastPaintedCellIndex: null as number | null
};

function renderCanvas() {
  const cellSize = state.canvasSize / state.gridSize;

  ctx.fillStyle = state.canvasColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (const [cellIndex, color] of state.paintedCells) {
    const col = cellIndex % state.gridSize;
    const row = Math.floor(cellIndex / state.gridSize);

    ctx.fillStyle = color;
    ctx.fillRect(col * cellSize, row * cellSize, cellSize, cellSize);
  }

  ctx.beginPath();

  for (let i = 0; i <= state.gridSize; i++) {
    const pos = i * cellSize;

    ctx.moveTo(pos, 0);
    ctx.lineTo(pos, canvas.height);

    ctx.moveTo(0, pos);
    ctx.lineTo(canvas.width, pos);
  }

  ctx.strokeStyle = state.gridlinesColor;
  ctx.stroke();
}

function handleCanvasPointer(e: PointerEvent) {
  if (e.buttons !== 1) return;

  const rect = canvas.getBoundingClientRect();
  const scale = canvas.width / rect.width;

  const x = (e.clientX - rect.left) * scale;
  const y = (e.clientY - rect.top) * scale;

  const cellSize = canvas.width / state.gridSize;
  const col = Math.floor(x / cellSize);
  const row = Math.floor(y / cellSize);
  if (col < 0 || col >= state.gridSize || row < 0 || row >= state.gridSize) return;

  const cellIndex = row * state.gridSize + col;
  if (cellIndex === state.lastPaintedCellIndex) return;

  state.lastPaintedCellIndex = cellIndex;

  switch (state.paintMode) {
    case "custom-color":
      state.paintedCells.set(cellIndex, state.paintColor);
      break;
    case "random-color":
      state.paintedCells.set(cellIndex, getRandomColor());
      break;
    case "eraser":
      state.paintedCells.delete(cellIndex);
  }

  renderCanvas();
}

function setCanvasColor() {
  state.canvasColor = canvasColorInput.value;

  renderCanvas();
}

function setPaintMode(mode: PaintMode) {
  state.paintMode = mode;

  customColorBtn.classList.toggle("controls__btn--selected", state.paintMode === "custom-color");
  randomColorBtn.classList.toggle("controls__btn--selected", state.paintMode === "random-color");
  eraserBtn.classList.toggle("controls__btn--selected", state.paintMode === "eraser");
}

function setPaintColor() {
  state.paintColor = paintColorInput.value;
}

function updateGridSize(e: Event) {
  const index = gridSizeInput.valueAsNumber;
  const gridSize = gridSizes[index];

  gridSizeLabel.textContent = `Grid Size: ${gridSize} x ${gridSize}`;

  if (e.type === "change") {
    state.gridSize = gridSize;
    renderCanvas();
  }
}

function getRandomColor() {
  const randomNumber = Math.floor(Math.random() * 0x1000000);

  return `#${randomNumber.toString(16).padStart(6, "0")}`;
}

function resetPaintTracking() {
  state.lastPaintedCellIndex = null;
}

function setupEvents() {
  canvas.addEventListener("pointerdown", handleCanvasPointer);
  canvas.addEventListener("pointermove", handleCanvasPointer);
  canvas.addEventListener("pointerup", resetPaintTracking);
  canvas.addEventListener("pointerleave", resetPaintTracking);

  canvasColorInput.addEventListener("input", setCanvasColor);
  paintColorInput.addEventListener("input", setPaintColor);
  gridSizeInput.addEventListener("input", updateGridSize);
  gridSizeInput.addEventListener("change", updateGridSize);

  customColorBtn.addEventListener("click", () => setPaintMode("custom-color"));
  randomColorBtn.addEventListener("click", () => setPaintMode("random-color"));
  eraserBtn.addEventListener("click", () => setPaintMode("eraser"));
}

function init() {
  renderCanvas();
  setupEvents();
}

init();
