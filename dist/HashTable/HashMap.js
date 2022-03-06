'use strict'
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod }
  }
Object.defineProperty(exports, '__esModule', { value: true })
const DLList_1 = require('../DLList')
const HashTableIterator_1 = __importDefault(require('./HashTableIterator'))
class HashTable {
  constructor(size = 20) {
    this._keys = new DLList_1.DLList()
    this._buckets = []
    this._size = 0
    for (let i = 0; i < size; i++) {
      this._buckets.push(new DLList_1.SortableDLList())
    }
  }
  get size() {
    return this._size
  }
  add(value) {
    const hashCode = value.hashCode()
    const bucket = this._buckets[hashCode % this._buckets.length]
    bucket.add(value)
    if (!this._keys.contains(value)) {
      this._keys.add(value)
    }
    this._size++
  }
  get(value) {
    const hashCode = value.hashCode()
    const bucket = this._buckets[hashCode % this._buckets.length]
    return bucket.get(value)
  }
  getAll(value) {
    const hashCode = value.hashCode()
    const bucket = this._buckets[hashCode % this._buckets.length]
    return bucket.getAll(value)
  }
  /**
   *
   * @returns {SortableDLList} - not a clone, DO NOT MODIFY, only read from it
   */
  getKeys() {
    return this._keys
  }
  remove(value) {
    const hashCode = value.hashCode()
    const bucket = this._buckets[hashCode % this._buckets.length]
    bucket.removeValue(value)
    if (bucket.size === 0) {
      this._keys.removeValue(value)
    }
    this._size--
  }
  removeAll(value) {
    const hashCode = value.hashCode()
    const bucket = this._buckets[hashCode % this._buckets.length]
    bucket.removeAll(value)
    if (bucket.size === 0) {
      this._keys.removeValue(value)
    }
    this._size--
  }
  contains(value) {
    const hashCode = value.hashCode()
    const bucket = this._buckets[hashCode % this._buckets.length]
    return bucket.contains(value)
  }
  [Symbol.iterator]() {
    return new HashTableIterator_1.default(this)
  }
  toString() {
    let result = ''
    for (const key of this._keys) {
      result += `${key.toString()} - ${this.getAll(key).toString()}\n`
    }
    return result.substring(0, result.length - 1)
  }
}
exports.default = HashTable
