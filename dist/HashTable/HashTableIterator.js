'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
class HashTableIterator {
  constructor(_table) {
    this._table = _table
    this._keys = _table.getKeys().clone()
  }
  next() {
    if (this._keys.size === 0) {
      return {
        done: true,
        value: null,
      }
    }
    const value = this._table.getAll(this._keys.get(0))
    this._keys.remove(0)
    return {
      done: false,
      value,
    }
  }
}
exports.default = HashTableIterator
