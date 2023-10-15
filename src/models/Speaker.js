export class Speaker {
    constructor(obj) {
        this.id = obj.id;
        this.displayName = obj.displayName;
        this.color = obj.color;
        this.preset = obj.preset;
        this.wordsPerMinute = obj.wordsPerMinute;
        this.subs = obj.subs || [];
        this.volume = obj.volume || 1;
        this.solo = obj.solo;
        this.mute = obj.mute;
    }

    clone() {
        return { ...this };
    }
}
