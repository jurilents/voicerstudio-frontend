const metaKey = '^';
const shiftKey = '!';
const altKey = '*';

export class HotkeyController {
    constructor() {
        this.keyDownHandlers = {};
        this.keyUpHandlers = {};
    }

    add(key, options, handler) {
        if (!options) options = {};
        if (key.length === 1) key = 'KEY' + key;
        key = this.#buildKey(key, options);

        if (options.on === 'keyup') this.keyUpHandlers[key] = handler;
        else this.keyDownHandlers[key] = handler;
    }

    findHandler(key, event) {
        key = this.#buildKey(key, {
            meta: event.ctrlKey || event.metaKey,
            shift: event.shiftKey,
            alt: event.altKey,
        });
        console.log(`${event.type}\t${key}`);
        return event.type === 'keyup' ? this.keyUpHandlers[key] : this.keyDownHandlers[key];
    }

    #buildKey(key, options) {
        key = key.toUpperCase();
        if (!options) return key;
        if (options.meta) key = metaKey + key;
        if (options.shift) key = shiftKey + key;
        if (options.alt) key = altKey + key;
        return key;
    }
}

export default new HotkeyController();
