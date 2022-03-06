import Equals from './Equals'

export default interface Comparable<T> extends Equals {
  compareTo(value: T): number
}
