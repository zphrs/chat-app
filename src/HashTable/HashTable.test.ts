import { describe } from 'mocha'
import { expect } from 'chai'
import { Comparable } from '../DLList'
import { Hashable, HashTable, HashableString, hashCode } from '.'

class NumberHashable extends Number implements Comparable<Number> {
  constructor(value: number) {
    super(value)
  }
  hashCode(): number {
    return this.valueOf()
  }
  compareTo(value: Number): number {
    return this.valueOf() - value.valueOf()
  }
  equals(value: any): boolean {
    return this.valueOf() === value.valueOf()
  }
}

class KeyValue<K, V> implements Hashable<KeyValue<K, V>> {
  key: K
  value: V
  constructor(key: K, value: V) {
    this.key = key
    this.value = value
  }
  hashCode(): number {
    return hashCode(JSON.stringify(this.key) + JSON.stringify(this.value))
  }
  compareTo(value: KeyValue<K, V>): number {
    return 0
  }
  equals(value: any): boolean {
    return value.key === this.key
  }
  toString(): string {
    return `${this.key} : ${this.value}`
  }
}

describe('HashTable', () => {
  const table = new HashTable<HashableString, NumberHashable>()

  it('should be able to add items', () => {
    table.put(new HashableString('a'), new NumberHashable(1))
    table.put(new HashableString('b'), new NumberHashable(2))
    table.put(new HashableString('c'), new NumberHashable(3))
    table.put(new HashableString('c'), new NumberHashable(4))
    console.log(table.toString())
  })
})
