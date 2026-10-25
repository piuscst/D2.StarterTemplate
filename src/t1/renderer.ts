import {
  drawing_document,
  stroke_command,
  sticker_command,
} from "./document.ts";

export function render_stroke(ctx: CanvasRenderingContext2D, stroke: stroke_command): void {
  if (stroke.points.length === 0) {
    return;
  }

  ctx.save();

  ctx.strokeStyle = stroke.color;
  ctx.fillStyle = stroke.color;
  ctx.lineWidth = stroke.width;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  // handle a single point/dot
  if (stroke.points.length === 1) {
    const point = stroke.points[0];

    ctx.beginPath();

    ctx.arc(point.x, point.y, stroke.width / 2, 0, Math.PI * 2,);

    ctx.fill();
    
    ctx.fill();

    ctx.restore();

    return;
  }

  // draw a path though all points
  ctx.beginPath();

  ctx.moveTo(stroke.points[0].x, stroke.points[0].y,);

  // loop through all points within stroke
  for (let i = 1; i < stroke.points.length; i++) {
    ctx.lineTo(stroke.points[i].x, stroke.points[i].y);
  }
  
  ctx.stroke();
  ctx.restore();
}

// function that draws a sticker
export function render_sticker( ctx: CanvasRenderingContext2D, sticker: sticker_command,): void {
  ctx.save();

  ctx.fillStyle = sticker.color;
  ctx.font = `${sticker.size}px sans-serif`;
  ctx.textBaseline = "top";

  ctx.fillText( sticker.text, sticker.location.x, sticker.location.y,);

  ctx.restore();
}

export function render_document(ctx: CanvasRenderingContext2D, document: drawing_document): void {
  // clears out the old drawing
  ctx.save();

  ctx.setTransform(1, 0, 0, 1, 0, 0);

  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height,);
  ctx.restore();

  // loop though all stored commands in order and render them
  for (const command of document.commands) {
    if (command.type === "stroke") {
      render_stroke(ctx, command);
    } else if (command.type === "sticker") {
      render_sticker(ctx, command);
    }
  }
}
