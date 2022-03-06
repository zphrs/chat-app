export default class Item<T> {
  private _value: any
  private _prev: Item<T> | null
  private _next: Item<T> | null
  constructor(value: any) {
    this._value = value
    this._prev = null
    this._next = null
  }

  get value(): any {
    return this._value
  }

  set value(value: any) {
    this._value = value
  }

  get prev(): Item<T> | null {
    return this._prev
  }

  set prev(prev: Item<T> | null) {
    this._prev = prev
  }

  set next(next: Item<T> | null) {
    this._next = next
  }

  get next(): Item<T> | null {
    return this._next
  }

  equals(value: Item<T>): boolean {
    return this._value === value.value
  }
}
