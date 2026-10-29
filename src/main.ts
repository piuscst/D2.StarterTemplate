import { create_document } from "./t1/document.ts";
import { setup_drawing } from "./t1/drawing.ts";
import { render_document } from "./t1/renderer.ts";
import { HistoryManager } from "./t3/history.ts";
import type { drawing_command } from "./t1/document.ts";
import { exportPng } from "./t3/export.ts";

const app = document.querySelector<HTMLElement>("#app")!;

app.innerHTML = "";

const heading = document.createElement("h1");
heading.textContent = "D2 Drawing Application";

const canvas = document.createElement("canvas");

canvas.width = 900;
canvas.height = 550;

const ctx = canvas.getContext("2d");
if (!ctx) {
  throw new Error("Could not create Canvas 2D context.");
}

const drawingDocument = create_document();

const history = new HistoryManager<drawing_command>();

canvas.style.width = "100%";
canvas.style.maxWidth = "900px";
canvas.style.height = "auto";
canvas.style.border = "2px solid black";
canvas.style.backgroundColor = "white";

app.append(heading, canvas);

const undoButton = document.createElement("button");
undoButton.textContent = "Undo";

const redoButton = document.createElement("button");
redoButton.textContent = "Redo";

const clearButton = document.createElement("button");
clearButton.textContent = "Clear";

const exportButton = document.createElement("button");
exportButton.textContent = "Export PNG";

app.append(undoButton, redoButton, clearButton, exportButton);

function refresh() {
  drawingDocument.commands = history.getCommands();
  render_document(ctx!, drawingDocument);
  undoButton.disabled = !history.canUndo();
  redoButton.disabled = !history.canRedo();
  clearButton.disabled = drawingDocument.commands.length === 0;
  exportButton.disabled = drawingDocument.commands.length === 0;
}

function renderer(
  ctx: CanvasRenderingContext2D,
  commands: readonly drawing_command[],
) {
  render_document(ctx, { commands: [...commands] });
}

undoButton.addEventListener("click", () => {
  history.undo();
  refresh();
});

redoButton.addEventListener("click", () => {
  history.redo();
  refresh();
});

clearButton.addEventListener("click", () => {
  history.clear();
  refresh();
});

exportButton.addEventListener("click", () => {
  const drawing = {
    width: canvas.width,
    height: canvas.height,
    commands: history.getCommands(),
  };

  exportPng(drawing, renderer, 2).catch((error) => {
    console.error("Export failed:", error);
  });
});

setup_drawing(canvas, drawingDocument, {
  on_stroke_complete: (stroke) => {
    history.commit(stroke);
    refresh();
  },
});

refresh();
