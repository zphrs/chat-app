import { describe } from 'mocha'
import { expect } from 'chai'
import { DLList, Comparable, SortableDLList } from '.'

class NumberEquals extends Number implements Comparable<Number> {
  constructor(value: number) {
    super(value)
  }
  compareTo(value: Number): number {
    return this.valueOf() - value.valueOf()
  }
  equals(value: any): boolean {
    return this.valueOf() === value.valueOf()
  }
}

describe('DLList', () => {
  const list: DLList<NumberEquals> = new DLList<NumberEquals>()
  it('should be empty', () => {
    expect(list.size).to.equal(0)
  })
  it('should add an item', () => {
    list.add(new NumberEquals(1))
    expect(list.toString()).to.equal('1')
  })
  it('should add an item at the end', () => {
    list.add(new NumberEquals(2))
    expect(list.toString()).to.equal('1, 2')
  })
  it('should add an item at the beginning', () => {
    list.insert(0, new NumberEquals(0))
    expect(list.toString()).to.equal('0, 1, 2')
  })
  it('should add an item at the middle', () => {
    list.insert(1, new NumberEquals(3))
    expect(list.toString()).to.equal('0, 3, 1, 2')
  })
  it('should add an item at the end', () => {
    list.insert(4, new NumberEquals(4))
    expect(list.toString()).to.equal('0, 3, 1, 2, 4')
  })
  it('should remove the 1 from the list', () => {
    list.removeValue(new NumberEquals(1))
    expect(list.toString()).to.equal('0, 3, 2, 4')
  })
})

describe('SortableDLList', () => {
  const list: SortableDLList<NumberEquals> = new SortableDLList<NumberEquals>()
  it('should be empty', () => {
    expect(list.size).to.equal(0)
  })
  it('should add an item', () => {
    list.add(new NumberEquals(1))
    expect(list.toString()).to.equal('1')
  })
  it('should add an item at the end', () => {
    list.add(new NumberEquals(2))
    expect(list.toString()).to.equal('1, 2')
  })
  it('should add an item at the beginning', () => {
    list.add(new NumberEquals(0))
    expect(list.toString()).to.equal('0, 1, 2')
  })
  it('should add an item at the middle', () => {
    list.add(new NumberEquals(1.5))
    expect(list.toString()).to.equal('0, 1, 1.5, 2')
  })
  it('should add an item at the end', () => {
    list.add(new NumberEquals(4))
    expect(list.toString()).to.equal('0, 1, 1.5, 2, 4')
  })
  it('should remove the 1 from the list', () => {
    list.removeValue(new NumberEquals(1))
    expect(list.toString()).to.equal('0, 1.5, 2, 4')
  })
})
describe('DLList to SortableDLList', () => {
  const list = new DLList<NumberEquals>()
  list.add(new NumberEquals(1))
  list.add(new NumberEquals(2))
  list.add(new NumberEquals(0))
  list.add(new NumberEquals(1.5))
  list.add(new NumberEquals(4))
  const sorted = SortableDLList.sort(list)
  it('should be the same length', () => {
    expect(sorted.size).to.equal(5)
  })
  it('should be sorted', () => {
    expect(sorted.toString()).to.equal('0, 1, 1.5, 2, 4')
  })
})
