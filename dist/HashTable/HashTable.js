"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const DLList_1 = require("../DLList");
const KeyValue_1 = __importDefault(require("./KeyValue"));
class HashTable {
    constructor(size = 10) {
        this._buckets = [];
        this._size = 0;
        this._keys = new DLList_1.DLList();
        for (let i = 0; i < size; i++) {
            this._buckets.push(new DLList_1.SortableDLList());
        }
    }
    get size() {
        return this._size;
    }
    put(key, value) {
        let bucketIndex = key.hashCode() % this._buckets.length;
        let bucket = this._buckets[bucketIndex];
        const keyValue = new KeyValue_1.default(key, value);
        bucket.add(keyValue);
        if (!this._keys.contains(key)) {
            this._keys.add(key);
        }
    }
    get(key) {
        let bucketIndex = key.hashCode() % this._buckets.length;
        let bucket = this._buckets[bucketIndex];
        const keyValue = new KeyValue_1.default(key, null);
        return bucket.get(keyValue).value;
    }
    getAll(key) {
        let bucketIndex = key.hashCode() % this._buckets.length;
        let bucket = this._buckets[bucketIndex];
        const keyValue = new KeyValue_1.default(key, null);
        const values = new DLList_1.SortableDLList();
        for (const value of bucket.getAll(keyValue)) {
            values.add(value.value);
        }
        return values;
    }
    getKeys() {
        return this._keys.clone();
    }
    toString() {
        let out = "";
        for (const key of this._keys) {
            out += `${key.toString()}: ${this.getAll(key).toString()}\n`;
        }
        return out;
    }
    contains(key) {
        let bucketIndex = key.hashCode() % this._buckets.length;
        let bucket = this._buckets[bucketIndex];
        const keyValue = new KeyValue_1.default(key, null);
        return bucket.contains(keyValue);
    }
    remove(key) {
        let bucketIndex = key.hashCode() % this._buckets.length;
        let bucket = this._buckets[bucketIndex];
        const keyValue = new KeyValue_1.default(key, null);
        bucket.removeValue(keyValue);
        this._keys.removeValue(key);
    }
}
exports.default = HashTable;
