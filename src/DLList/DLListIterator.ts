import DLList from './DLList'
import Equals from './Equals'
import Item from './Item'
export default class DLListIterator<T extends Equals> implements Iterator<any> {
  private _current: Item<T>
  private _last: Item<T>
  constructor(list: DLList<any>) {
    this._current = list.getItem(0)
    this._last = list.getItem(list.size)
  }
  next(): IteratorResult<T> {
    if (this._current.next === null) {
      return {
        done: true,
        value: null,
      }
    }
    const value = this._current.value
    this._current = this._current.next
    if (value === null) {
      return {
        done: true,
        value: null,
      }
    }
    return {
      done: false,
      value,
    }
  }
}
