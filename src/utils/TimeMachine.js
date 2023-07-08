export class TimeMachine {
  constructor() {
    window.appHostory = [];
    window.appFuture = [];
  }

  pushAddOperation(state, action, undoAction) {
    if (window.appHostory.length > 0 && action.type.startsWith('PATCH_')) {
      const patch = action.payload.patch;
      const last = window.appHostory[window.appHostory.length - 1];
    }
    window.appHostory.push({
      undo: undoAction,
      redo: action,
    });
  }

  getUndo() {

  }

  getRedo() {

  }
}

export default new TimeMachine();
