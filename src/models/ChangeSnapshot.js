export const StampTarget = {
    speaker: 1,
    subtitle: 2,
};
export const StampOperation = {
    add: 1,
    patch: 2,
    remove: 3,
};

export class ChangeSnapshot {
    constructor(obj) {
        this.undo = obj.target;
        this.operation = obj.operation;
        this.payload = obj.payload;
    }
}
