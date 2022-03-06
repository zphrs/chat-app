"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mocha_1 = require("mocha");
const _1 = require(".");
class NumberHashable extends Number {
    constructor(value) {
        super(value);
    }
    hashCode() {
        return this.valueOf();
    }
    compareTo(value) {
        return this.valueOf() - value.valueOf();
    }
    equals(value) {
        return this.valueOf() === value.valueOf();
    }
}
class KeyValue {
    constructor(key, value) {
        this.key = key;
        this.value = value;
    }
    hashCode() {
        return (0, _1.hashCode)(JSON.stringify(this.key) + JSON.stringify(this.value));
    }
    compareTo(value) {
        return 0;
    }
    equals(value) {
        return value.key === this.key;
    }
    toString() {
        return `${this.key} : ${this.value}`;
    }
}
(0, mocha_1.describe)('HashTable', () => {
    const table = new _1.HashTable();
    it('should be able to add items', () => {
        table.put(new _1.HashableString('a'), new NumberHashable(1));
        table.put(new _1.HashableString('b'), new NumberHashable(2));
        table.put(new _1.HashableString('c'), new NumberHashable(3));
        table.put(new _1.HashableString('c'), new NumberHashable(4));
        console.log(table.toString());
    });
});
