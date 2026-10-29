import type { drawing_command, point } from "../t1/document.ts";
import { create_sticker, create_stroke } from "../t1/renderer.ts";

export interface brush_tool {
  kind: "brush";
  id: string;
  label: string;
  color: string;
  width: number;
}

export interface sticker_tool {
  kind: "sticker";
  id: string;
  label: string;
  text: string;
  size: number;
  color: string;
}

export type tool_definition = brush_tool | sticker_tool;

export const preset_tools: tool_definition[] = [
  { kind: "brush", id: "thin", label: "Thin", color: "black", width: 2 },
  { kind: "brush", id: "thick", label: "Thick", color: "black", width: 8 },
  {
    kind: "sticker",
    id: "star",
    label: "Star",
    text: "⭐",
    size: 40,
    color: "black",
  },
  {
    kind: "sticker",
    id: "heart",
    label: "Heart",
    text: "❤️",
    size: 40,
    color: "black",
  },
  {
    kind: "sticker",
    id: "smile",
    label: "Smile",
    text: "😀",
    size: 40,
    color: "black",
  },
];

// This holds the tools and the current selection
export class tool_collection {
  private tools: tool_definition[] = [];
  private selected_id = "";

  constructor(initial: tool_definition[] = preset_tools) {
    this.tools = [...initial];
    this.selected_id = initial[0].id;
  }

  list(): tool_definition[] {
    return [...this.tools];
  }

  get_selected(): tool_definition {
    return this.tools.find((t) => t.id === this.selected_id)!;
  }

  select(id: string): void {
    if (this.tools.some((t) => t.id === id)) {
      this.selected_id = id;
    }
  }

  add(tool: tool_definition): void {
    this.tools.push(tool);
  }
}

let custom_count = 0;

export function create_sticker_tool(
  raw_text: string | null,
  raw_label: string | null,
): sticker_tool | null {
  const text = raw_text?.trim() ?? "";
  const label = raw_label?.trim() ?? "";

  if (text === "" || label === "") return null;
  custom_count++;

  return {
    kind: "sticker",
    id: `custom-${custom_count}`,
    label,
    text: Array.from(text).slice(0, 8).join(""),
    size: 40,
    color: "black",
  };
}

// Shared placement: turns ANY tool into a command at a point
// Values are copied in, so later tool changes never affect placed objects
export function create_command(
  tool: tool_definition,
  location: point,
): drawing_command {
  if (tool.kind === "brush") {
    return create_stroke([{ ...location }], tool.color, tool.width);
  }

  return create_sticker(
    { ...location },
    tool.text,
    tool.size,
    tool.color,
  );
}
