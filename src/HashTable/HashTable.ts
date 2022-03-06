import { DLList, Comparable, Equals, SortableDLList } from "../DLList"
import Hashable from "./Hashable"
import KeyValue from "./KeyValue"

export default class HashTable<K extends Hashable<K>, V extends Comparable<V>> {
  private _keys: DLList<K>
  private _buckets: SortableDLList<KeyValue<K, V>>[]
  private _size: number
  constructor(size: number = 10) {
    this._buckets = []
    this._size = 0
    this._keys = new DLList<K>()
    for (let i = 0; i < size; i++) {
      this._buckets.push(new SortableDLList<KeyValue<K, V>>())
    }
  }

  get size(): number {
    return this._size
  }

  put(key: K, value: V) {
    let bucketIndex = key.hashCode() % this._buckets.length
    let bucket = this._buckets[bucketIndex]
    const keyValue = new KeyValue(key, value)
    bucket.add(keyValue)
    if (!this._keys.contains(key)) {
      this._keys.add(key)
    }
  }

  get(key: K): V {
    let bucketIndex = key.hashCode() % this._buckets.length
    let bucket = this._buckets[bucketIndex]
    const keyValue = new KeyValue(key, null)
    return bucket.get(keyValue).value
  }

  getAll(key: K): SortableDLList<V> {
    let bucketIndex = key.hashCode() % this._buckets.length
    let bucket = this._buckets[bucketIndex]
    const keyValue = new KeyValue(key, null)
    const values = new SortableDLList<V>()
    for (const value of bucket.getAll(keyValue)) {
      values.add(value.value)
    }
    return values
  }

  getKeys(): DLList<K> {
    return this._keys.clone()
  }

  toString(): string {
    let out = ""
    for (const key of this._keys) {
      out += `${key.toString()}: ${this.getAll(key).toString()}\n`
    }
    return out
  }

  contains(key: K): boolean {
    let bucketIndex = key.hashCode() % this._buckets.length
    let bucket = this._buckets[bucketIndex]
    const keyValue = new KeyValue(key, null)
    return bucket.contains(keyValue)
  }

  remove(key: K) {
    let bucketIndex = key.hashCode() % this._buckets.length
    let bucket = this._buckets[bucketIndex]
    const keyValue = new KeyValue(key, null)
    bucket.removeValue(keyValue)
    this._keys.removeValue(key)
  }
}
