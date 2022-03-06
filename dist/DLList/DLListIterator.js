"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class DLListIterator {
    constructor(list) {
        this._current = list.getItem(0);
        this._last = list.getItem(list.size);
    }
    next() {
        if (this._current.next === null) {
            return {
                done: true,
                value: null,
            };
        }
        const value = this._current.value;
        this._current = this._current.next;
        if (value === null) {
            return {
                done: true,
                value: null,
            };
        }
        return {
            done: false,
            value,
        };
    }
}
exports.default = DLListIterator;
