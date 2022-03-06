import Hashable from './Hashable'

import hashCode from './hashCode'

export default class HashableString implements Hashable<string> {
  private readonly string: string

  constructor(string: string) {
    this.string = string
  }

  hashCode(): number {
    return hashCode(this.string)
  }

  equals(value: string): boolean {
    return value == this.string
  }

  toString(): string {
    return this.string
  }
}
