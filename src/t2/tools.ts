import type { drawing_command, point } from "../t1/document.ts";

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
}

// Shared placement: turns ANY tool into a command at a point.
// Values are copied in, so later tool changes never affect placed objects.
export function create_command(
  tool: tool_definition,
  location: point,
): drawing_command {
  if (tool.kind === "brush") {
    return {
      type: "stroke",
      points: [{ ...location }],
      color: tool.color,
      width: tool.width,
    };
  }

  return {
    type: "sticker",
    location: { ...location },
    text: tool.text,
    size: tool.size,
    color: tool.color,
  };
}
