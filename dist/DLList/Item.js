"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Item {
    constructor(value) {
        this._value = value;
        this._prev = null;
        this._next = null;
    }
    get value() {
        return this._value;
    }
    set value(value) {
        this._value = value;
    }
    get prev() {
        return this._prev;
    }
    set prev(prev) {
        this._prev = prev;
    }
    set next(next) {
        this._next = next;
    }
    get next() {
        return this._next;
    }
    equals(value) {
        return this._value === value.value;
    }
}
exports.default = Item;
