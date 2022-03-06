"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class KeyValue {
    constructor(key, value) {
        this.key = key;
        this._value = value;
    }
    equals(other) {
        return other.key.equals(this.key);
    }
    compareTo(other) {
        return this.value.compareTo(other.value);
    }
    get value() {
        if (this._value === null) {
            throw new Error('Value is null');
        }
        return this._value;
    }
    toString() {
        return `${this.key} : ${this.value}`;
    }
}
exports.default = KeyValue;
