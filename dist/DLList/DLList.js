"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const DLListIterator_1 = __importDefault(require("./DLListIterator"));
const Item_1 = __importDefault(require("./Item"));
class DLList {
    constructor() {
        this._head = new Item_1.default(null);
        this._tail = new Item_1.default(null);
        this._head.next = this._tail;
        this._tail.prev = this._head;
        this._size = 0;
    }
    [Symbol.iterator]() {
        return new DLListIterator_1.default(this);
    }
    get size() {
        return this._size;
    }
    add(value) {
        const item = new Item_1.default(value);
        const before = this._tail.prev;
        if (before === null) {
            throw new Error('Head is unexpectedly missing');
        }
        item.prev = before;
        item.next = this._tail;
        before.next = item;
        this._tail.prev = item;
        this._size++;
    }
    getItem(index) {
        if (index < 0 || index > this._size) {
            throw new Error('Index out of bounds');
        }
        if (index < this._size / 2) {
            let current = this._head;
            for (let i = -1; i < index; i++) {
                if (current.next === null) {
                    throw new Error('Index out of bounds');
                }
                current = current.next;
            }
            return current;
        }
        let current = this._tail;
        for (let i = this._size; i > index; i--) {
            if (current.prev === null) {
                throw new Error('Index out of bounds');
            }
            current = current.prev;
        }
        return current;
    }
    get(index) {
        switch (typeof index) {
            case 'number':
                return this.getItem(index).value;
            case 'object':
                let current = this._head.next;
                if (current === null) {
                    throw new Error('Item not in list');
                }
                for (let i = 0; i < this._size; i++) {
                    if (current === null || current.value === null) {
                        throw new Error('Unexpected missing value at index ' + i);
                    }
                    if (current.value.equals(index)) {
                        return current.value;
                    }
                    current = current.next;
                }
                throw new Error('Item not in list');
            default:
                throw new Error('Invalid type');
        }
    }
    getAll(value) {
        const result = new DLList();
        for (const item of this) {
            if (item.equals(value)) {
                result.add(item);
            }
        }
        return result;
    }
    indexOf(value, offset = 0) {
        let current = this._head.next;
        if (current === null) {
            return -1;
        }
        for (let i = offset; i < this._size; i++) {
            if (current === null || current.value === null) {
                return -1;
            }
            if (current.value.equals(value)) {
                return i;
            }
            current = current.next;
        }
        return -1;
    }
    remove(index) {
        const removing = this.getItem(index);
        const before = removing.prev;
        const after = removing.next;
        if (before === null) {
            throw new Error('Head is unexpectedly missing');
        }
        if (after === null) {
            throw new Error('Tail is unexpectedly missing');
        }
        before.next = after;
        after.prev = before;
        this._size--;
    }
    removeValue(value) {
        const index = this.indexOf(value);
        if (index === -1) {
            throw new Error('Value not found');
        }
        this.remove(index);
    }
    removeAll(value) {
        let currentIndex = this.indexOf(value);
        while (currentIndex !== -1) {
            this.remove(currentIndex);
            currentIndex = this.indexOf(value, currentIndex);
        }
    }
    insert(index, value) {
        const item = new Item_1.default(value);
        const after = this.getItem(index);
        const before = after.prev;
        if (before === null) {
            throw new Error('Head is unexpectedly missing');
        }
        if (after === null) {
            throw new Error('Tail is unexpectedly missing');
        }
        item.prev = before;
        item.next = after;
        before.next = item;
        after.prev = item;
        this._size++;
    }
    toString() {
        let result = '';
        let current = this._head.next;
        if (current === null) {
            return result;
        }
        for (let i = 0; i < this._size; i++) {
            result += current.value.toString() + ', ';
            if (current.next === null) {
                throw new Error('Unexpected missing next at index ' + i);
            }
            current = current.next;
        }
        return result.substring(0, result.length - 2);
    }
    clone() {
        const result = new DLList();
        for (const item of this) {
            result.add(item);
        }
        return result;
    }
    contains(value) {
        return this.indexOf(value) !== -1;
    }
    clear() {
        this._head.next = this._tail;
        this._tail.prev = this._head;
        this._size = 0;
    }
}
exports.default = DLList;
