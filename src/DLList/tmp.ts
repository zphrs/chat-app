import Equals from './Equals'
import Item from './Item'
import DLList from './DLList'
import Comparable from './Comparable'

export default class SortableDLList<T extends Comparable<T>> extends DLList<T> {
  constructor() {
    super()
  }

  add(value: T): void {
    if (this.size === 0) {
      this.add(value)
      return
    }
    let current = this.getItem(0)
    let index = 0
    while (current.value.compareTo(value) < 0) {
      if (current.next === null) {
        break
      }
      current = current.next
      index++
    }
    this.insert(index, value)
  }

  static sort<Type extends Comparable<Type>>(
    input: DLList<Type>
  ): SortableDLList<Type> {
    const out = new SortableDLList<Type>()
    for (const item of input) {
      out.add(item)
    }
    return out
  }
}
