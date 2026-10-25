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

