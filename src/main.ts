import { create_document } from "./t1/document.ts";
import { setup_drawing } from "./t1/drawing.ts";

const app = document.querySelector<HTMLElement>("#app")!;

app.innerHTML = "";

const heading = document.createElement("h1");
heading.textContent = "D2 Drawing Application";

const canvas = document.createElement("canvas");

canvas.width = 900;
canvas.height = 550;

canvas.style.width = "100%";
canvas.style.maxWidth = "900px";
canvas.style.height = "auto";
canvas.style.border = "2px solid black";
canvas.style.backgroundColor = "white";

app.append(heading, canvas);

const drawingDocument = create_document();

setup_drawing(canvas, drawingDocument);
