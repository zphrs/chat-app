import { Equals } from '../DLList'

export default interface Hashable<K> extends Equals {
  hashCode(): number
}
