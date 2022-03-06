import DLListIterator from './DLListIterator'
import Equals from './Equals'
import Item from './Item'
export default class DLList<T extends Equals> implements Iterable<T> {
  private _head: Item<T>
  private _tail: Item<T>
  private _size: number
  constructor() {
    this._head = new Item(null)
    this._tail = new Item(null)
    this._head.next = this._tail
    this._tail.prev = this._head
    this._size = 0
  }
  [Symbol.iterator](): Iterator<T> {
    return new DLListIterator(this)
  }

  get size(): number {
    return this._size
  }

  add(value: T): void {
    const item = new Item(value)
    const before = this._tail.prev
    if (before === null) {
      throw new Error('Head is unexpectedly missing')
    }
    item.prev = before
    item.next = this._tail
    before.next = item
    this._tail.prev = item
    this._size++
  }

  getItem(index: number): Item<T> {
    if (index < 0 || index > this._size) {
      throw new Error('Index out of bounds')
    }
    if (index < this._size / 2) {
      let current = this._head
      for (let i = -1; i < index; i++) {
        if (current.next === null) {
          throw new Error('Index out of bounds')
        }
        current = current.next
      }
      return current
    }
    let current = this._tail
    for (let i = this._size; i > index; i--) {
      if (current.prev === null) {
        throw new Error('Index out of bounds')
      }
      current = current.prev
    }
    return current
  }

  get(index: number | Equals): T {
    switch (typeof index) {
      case 'number':
        return this.getItem(index).value
      case 'object':
        let current = this._head.next
        if (current === null) {
          throw new Error('Item not in list')
        }
        for (let i = 0; i < this._size; i++) {
          if (current === null || current.value === null) {
            throw new Error('Unexpected missing value at index ' + i)
          }
          if (current.value.equals(index)) {
            return current.value
          }
          current = current.next
        }
        throw new Error('Item not in list')
      default:
        throw new Error('Invalid type')
    }
  }

  getAll(value: Equals): DLList<T> {
    const result = new DLList<T>()
    for (const item of this) {
      if (item.equals(value)) {
        result.add(item)
      }
    }
    return result
  }

  indexOf(value: Equals, offset: number = 0): number {
    let current = this._head.next
    if (current === null) {
      return -1
    }
    for (let i = offset; i < this._size; i++) {
      if (current === null || current.value === null) {
        return -1
      }
      if (current.value.equals(value)) {
        return i
      }
      current = current.next
    }
    return -1
  }

  remove(index: number): void {
    const removing = this.getItem(index)
    const before = removing.prev
    const after = removing.next
    if (before === null) {
      throw new Error('Head is unexpectedly missing')
    }
    if (after === null) {
      throw new Error('Tail is unexpectedly missing')
    }
    before.next = after
    after.prev = before
    this._size--
  }

  removeValue(value: Equals): void {
    const index = this.indexOf(value)
    if (index === -1) {
      throw new Error('Value not found')
    }
    this.remove(index)
  }

  removeAll(value: Equals): void {
    let currentIndex = this.indexOf(value)
    while (currentIndex !== -1) {
      this.remove(currentIndex)
      currentIndex = this.indexOf(value, currentIndex)
    }
  }

  insert(index: number, value: T): void {
    const item = new Item(value)
    const after = this.getItem(index)
    const before = after.prev
    if (before === null) {
      throw new Error('Head is unexpectedly missing')
    }
    if (after === null) {
      throw new Error('Tail is unexpectedly missing')
    }
    item.prev = before
    item.next = after
    before.next = item
    after.prev = item
    this._size++
  }

  toString(): string {
    let result = ''
    let current = this._head.next
    if (current === null) {
      return result
    }
    for (let i = 0; i < this._size; i++) {
      result += current.value.toString() + ', '
      if (current.next === null) {
        throw new Error('Unexpected missing next at index ' + i)
      }
      current = current.next
    }
    return result.substring(0, result.length - 2)
  }

  clone(): DLList<T> {
    const result = new DLList<T>()
    for (const item of this) {
      result.add(item)
    }
    return result
  }

  contains(value: Equals): boolean {
    return this.indexOf(value) !== -1
  }

  clear() {
    this._head.next = this._tail
    this._tail.prev = this._head
    this._size = 0
  }
}
