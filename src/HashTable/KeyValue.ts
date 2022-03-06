import Hashable from './Hashable'
import { Comparable } from '../DLList'

export default class KeyValue<K extends Hashable<K>, V extends Comparable<V>>
  implements Comparable<KeyValue<K, V>>
{
  key: K
  private _value: V | null
  constructor(key: K, value: V | null) {
    this.key = key
    this._value = value
  }
  equals(other: KeyValue<K, V>): boolean {
    return other.key.equals(this.key)
  }
  compareTo(other: KeyValue<K, V>): number {
    return this.value.compareTo(other.value)
  }

  get value(): V {
    if (this._value === null) {
      throw new Error('Value is null')
    }
    return this._value
  }
  toString(): string {
    return `${this.key} : ${this.value}`
  }
}
