export interface DrawingDocument<T> {
  width: number;
  height: number;
  commands: readonly T[];
}

export type DrawingRenderer<T> = (
  ctx: CanvasRenderingContext2D,
  commands: readonly T[],
) => void;

export async function exportPng<T>(
  drawing: DrawingDocument<T>,
  render: DrawingRenderer<T>,
  scale = 2,
): Promise<void> {
  if (!Number.isFinite(scale) || scale < 2) {
    throw new Error("Export scale must be at least 2.");
  }

  const canvas = document.createElement("canvas");

  canvas.width = Math.round(drawing.width * scale);
  canvas.height = Math.round(drawing.height * scale);

  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Could not create Canvas 2D context.");
  }

  // Convert original drawing coordinates to export resolution.
  ctx.scale(
    canvas.width / drawing.width,
    canvas.height / drawing.height,
  );

  // Replay retained commands into a separate context.
  render(ctx, drawing.commands);

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((result) => {
      if (result) {
        resolve(result);
      } else {
        reject(new Error("PNG conversion failed."));
      }
    }, "image/png");
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = "drawing.png";

  document.body.appendChild(link);

  try {
    link.click();
  } finally {
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
}
