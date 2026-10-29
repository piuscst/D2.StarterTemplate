import { add_command } from "./document.ts";
import type { drawing_command, drawing_document, point } from "./document.ts";
import { render_document, render_sticker, render_stroke } from "./renderer.ts";
import { create_command } from "../t2/tools.ts";
import type { tool_definition } from "../t2/tools.ts";

export interface drawing_options {
  get_tool: () => tool_definition;
  on_stroke_complete?: (command: drawing_command) => void;
}

export function setup_drawing(
  canvas: HTMLCanvasElement,
  document: drawing_document,
  options: drawing_options,
): () => void {
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Could not get canvas context");
  }

  let currentStroke: drawing_command | null = null;
  let activePointerId: number | null = null;

  // Prevents touchscreen gestures when drawing
  canvas.style.touchAction = "none";

  // Converts the pointer position to canvas coordinates
  function get_point(event: PointerEvent): point {
    const rect = canvas.getBoundingClientRect();

    return {
      x: (event.clientX - rect.left) *
        (canvas.width / rect.width),
      y: (event.clientY - rect.top) *
        (canvas.height / rect.height),
    };
  }

  // Redraw the saved commands and the unfinished stroke
  function redraw(): void {
    if (!ctx) return;

    render_document(ctx, document);

    if (currentStroke !== null) {
      if (currentStroke.type === "stroke") {
        render_stroke(ctx, currentStroke);
      } else {
        render_sticker(ctx, currentStroke);
      }
    }
  }

  // Add a point if its different from the previous point
  function add_point(point: point): void {
    if (currentStroke === null) return;

    if (currentStroke.type === "sticker") {
      currentStroke.location = point;
      return;
    }

    const lastPoint = currentStroke.points[currentStroke.points.length - 1];

    // push point to array
    if (!lastPoint || lastPoint.x !== point.x || lastPoint.y !== point.y) {
      currentStroke.points.push(point);
    }
  }

  // Function that starts the drawing
  function pointer_down(event: PointerEvent): void {
    if (activePointerId !== null) return;

    // Accepts the main pointer or left mouse button
    if (!event.isPrimary) return;
    if (event.pointerType === "mouse" && event.button !== 0) {
      return;
    }

    activePointerId = event.pointerId;
    currentStroke = create_command(options.get_tool(), get_point(event));

    canvas.setPointerCapture(event.pointerId);
    redraw();
  }

  // Continue drawing while dragging
  function pointer_move(event: PointerEvent): void {
    if (activePointerId !== event.pointerId) return;
    if (currentStroke === null) return;

    add_point(get_point(event));
    redraw();
  }

  // Finish and save the stroke
  function pointer_up(event: PointerEvent): void {
    if (activePointerId !== event.pointerId) return;
    if (currentStroke === null) return;

    add_point(get_point(event));

    const completedStroke = currentStroke;

    currentStroke = null;
    activePointerId = null;

    if (canvas.hasPointerCapture(event.pointerId)) {
      canvas.releasePointerCapture(event.pointerId);
    }

    // Teammate 3 can handle history through this callback
    if (options.on_stroke_complete) {
      options.on_stroke_complete(completedStroke);
    } else {
      add_command(document, completedStroke);
    }

    redraw();
  }

  // Function that throws away any unfinihsed/unused work
  function pointer_cancel(event: PointerEvent): void {
    if (activePointerId !== event.pointerId) return;

    currentStroke = null;
    activePointerId = null;

    if (canvas.hasPointerCapture(event.pointerId)) {
      canvas.releasePointerCapture(event.pointerId);
    }

    redraw();
  }

  // Handle unexpected loss of pointer capture
  function lost_pointer_capture(event: PointerEvent): void {
    if (activePointerId !== event.pointerId) return;

    currentStroke = null;
    activePointerId = null;
    redraw();
  }

  // Register pointer events
  canvas.addEventListener("pointerdown", pointer_down);
  canvas.addEventListener("pointermove", pointer_move);
  canvas.addEventListener("pointerup", pointer_up);
  canvas.addEventListener("pointercancel", pointer_cancel);
  canvas.addEventListener(
    "lostpointercapture",
    lost_pointer_capture,
  );

  // Initially render the document
  redraw();

  // Return a function to remove event listeners
  return () => {
    canvas.removeEventListener("pointerdown", pointer_down);
    canvas.removeEventListener("pointermove", pointer_move);
    canvas.removeEventListener("pointerup", pointer_up);
    canvas.removeEventListener("pointercancel", pointer_cancel);
    canvas.removeEventListener(
      "lostpointercapture",
      lost_pointer_capture,
    );
  };
}
