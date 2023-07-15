import { settings } from '../settings';

export class TimeMachine {
  constructor() {
    console.log('creating time machine');
    this.history = [];
    this.future = [];
  }

  push(action, undoAction) {
    if (action.fromHistory) return;
    this.history.push({
      undo: undoAction,
      redo: action,
    });
    // Limit history size
    while (this.history.length > settings.historyLimit) {
      this.history.shift();
    }
    // console.log('history size:', this.history);
    // Reset previous future
    if (this.future.length) {
      this.future = [];
    }
  }

  getLast() {
    return this.history.length ? this.history[this.history.length - 1] : null;
  }

  undo() {
    const last = this.history.pop();
    if (!last) return null;
    this.future.push(last);
    last.undo.fromHistory = true;
    return last.undo;
  }

  redo() {
    const last = this.future.pop();
    if (!last) return last;
    this.history.push(last);
    last.redo.fromHistory = true;
    return last.redo;
  }
}


const timeMachine = new TimeMachine();
export default timeMachine;
