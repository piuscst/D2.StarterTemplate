import type { tool_collection } from "./tools.ts";
import { create_sticker_tool } from "./tools.ts";

export function setup_toolbar(
  container: HTMLElement,
  tools: tool_collection,
): void {
  function render(): void {
    container.replaceChildren();

    const selected = tools.get_selected();

    for (const tool of tools.list()) {
      const button = document.createElement("button");

      button.type = "button";
      button.className = "tool-button";
      button.textContent = tool.kind === "sticker"
        ? `${tool.text} ${tool.label}`
        : tool.label;
      button.setAttribute("aria-pressed", String(tool.id === selected.id));
      button.addEventListener("click", () => {
        console.log("clicked", tool.id);
        tools.select(tool.id);
        console.log("selected:", tools.get_selected().id);
        render();
      });

      container.append(button);
    }

    const create = document.createElement("button");

    create.type = "button";
    create.className = "tool-button tool-create";
    create.textContent = " + New Sticker";
    create.addEventListener("click", () => {
      const text = globalThis.prompt("Emoji or short text:");
      const label = text === null ? null : globalThis.prompt("Tool name:");
      const tool = create_sticker_tool(text, label);

      // Cancel or empty: nothing is added, nothing changes
      if (tool === null) return;

      tools.add(tool);
      tools.select(tool.id);
      render();
    });

    container.append(create);
  }

  render();
}
