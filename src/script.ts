function $<T extends HTMLElement>(selector: string, constructor: new () => T): T {
  const element = document.querySelector(selector);

  if (element === null) {
    throw new Error(`Element "${selector}" was not found`);
  }

  if (!(element instanceof constructor)) {
    throw new TypeError(`Element "${selector}" is not an instance of ${constructor.name}`);
  }

  return element;
}

function getCanvasContext(canvas: HTMLCanvasElement): CanvasRenderingContext2D {
  const context = canvas.getContext("2d");

  if (context === null) {
    throw new Error("Canvas 2D context is not available");
  }

  return context;
}

const canvas = $(".canvas", HTMLCanvasElement);
const ctx = getCanvasContext(canvas);

const canvasColorInput = $(".controls__input--canvas-color", HTMLInputElement);
const paintColorInput = $(".controls__input--paint-color", HTMLInputElement);
const gridSizeLabel = $(".controls__label--grid-size", HTMLSpanElement);
const gridSizeInput = $(".controls__input--grid-size", HTMLInputElement);
const customColorBtn = $(".controls__btn--custom-color", HTMLButtonElement);
const randomColorBtn = $(".controls__btn--random-color", HTMLButtonElement);
const eraserBtn = $(".controls__btn--eraser", HTMLButtonElement);
const saveBtn = $(".controls__btn--save", HTMLButtonElement);
const clearBtn = $(".controls__btn--clear", HTMLButtonElement);
const gridlinesBtn = $(".controls__btn--gridlines", HTMLButtonElement);

const gridSizes = [8, 16, 32, 48, 64] as const;

type PaintMode = "custom-color" | "random-color" | "eraser";

const state = {
  canvasSize: 576,
  canvasColor: canvasColorInput.value,
  gridSize: 16,
  gridlines: true,
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

  if (state.gridlines === true) {
    ctx.beginPath();

    for (let i = 0; i <= state.gridSize; i++) {
      const pos = i * cellSize;

      ctx.moveTo(pos, 0);
      ctx.lineTo(pos, canvas.height);

      ctx.moveTo(0, pos);
      ctx.lineTo(canvas.width, pos);
    }

    ctx.strokeStyle = state.gridlinesColor;
    ctx.strokeRect(0, 0, canvas.width, canvas.height);
    ctx.stroke();
  }
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
    state.paintedCells.clear();

    renderCanvas();
  }
}

function toggleGridlines() {
  state.gridlines = !state.gridlines;

  gridlinesBtn.classList.toggle("controls__btn--selected", state.gridlines === true);
  renderCanvas();
}

function saveCanvas() {
  const link = document.createElement("a");

  link.href = canvas.toDataURL("image/png");
  link.download = "pixel-art.png";
  link.click();
}

function clearCanvas() {
  state.paintedCells.clear();

  renderCanvas();
}

function getRandomColor() {
  const randomNumber = Math.floor(Math.random() * 0x1000000);
  const hexCode = `#${randomNumber.toString(16).padStart(6, "0")}`;

  return hexCode;
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
  clearBtn.addEventListener("click", clearCanvas);
  saveBtn.addEventListener("click", saveCanvas);
  gridlinesBtn.addEventListener("click", toggleGridlines);
}

function init() {
  renderCanvas();
  setupEvents();
}

init();
