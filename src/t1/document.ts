// interface for point only x/y coords
export interface point {
  x: number,
  y: number,
}

// interface for Stroke command
// array of of points, color, and width of stroke
export interface stroke_command {
  type: "stroke",
  points: point[],
  color: string,
  width: number,
}

// interface for Sticker
export interface sticker_command {
  type: "sticker",
  location: point,
  text: string,
  size: number,
  color: string,
}

// return drawing command of either Stroke or a sticker command
export type drawing_command = stroke_command | sticker_command;

// interface of drawing command array
export interface drawing_document {
  commands: drawing_command[];
}

// function that returns commands for drawing document 
export function create_document(): drawing_document {
  return {
    commands: [],
  }
}

// function that adds a completed drawing command to document
export function add_command(document: drawing_document, command: drawing_command): void {
  document.commands.push(command);
}

// function that clears out stored commands
export function clear_document(document: drawing_document): void {
  document.commands = [];
}
