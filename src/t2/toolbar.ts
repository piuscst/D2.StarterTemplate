import type { tool_collection } from "./tools.ts";

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
  }

  render();
}
