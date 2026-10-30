export class HistoryManager<T> {
  private states: T[][] = [[]];
  private cursor = 0;

  constructor(initialCommands: T[] = []) {
    this.states = [[...initialCommands]];
  }

  // Get all currently visible drawing commands
  getCommands(): T[] {
    return [...this.states[this.cursor]];
  }

  // Add a completed drawing command
  commit(command: T): void {
    const current = this.getCommands();

    // Discard the redo branch
    this.states = this.states.slice(0, this.cursor + 1);

    this.states.push([...current, command]);
    this.cursor++;
  }

  // Replace the document as one undoable action
  replace(commands: T[]): void {
    this.states = this.states.slice(0, this.cursor + 1);
    this.states.push([...commands]);
    this.cursor++;
  }

  // Undo the most recent action
  undo(): void {
    if (this.canUndo()) {
      this.cursor--;
    }
  }

  // Redo the next undone action
  redo(): void {
    if (this.canRedo()) {
      this.cursor++;
    }
  }

  // Clear the drawing as one undoable action
  clear(): void {
    if (this.getCommands().length > 0) {
      this.replace([]);
    }
  }

  canUndo(): boolean {
    return this.cursor > 0;
  }

  canRedo(): boolean {
    return this.cursor < this.states.length - 1;
  }
}
