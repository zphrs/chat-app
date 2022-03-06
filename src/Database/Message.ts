import { Comparable } from '../DLList'

export default class Message implements Comparable<Message> {
  private readonly _sender: string
  private readonly _chatId: string
  private readonly _timestamp: number
  private readonly _content: string
  constructor(
    sender: string,
    chatId: string,
    timestamp: number,
    content: string
  ) {
    this._sender = sender
    this._chatId = chatId
    this._timestamp = timestamp
    this._content = content
  }
  compareTo(value: Message): number {
    return this._timestamp - value._timestamp
  }
  equals(value: any): boolean {
    return (
      this._sender === value._sender &&
      this._chatId === value._chatId &&
      this._timestamp === value._timestamp
    )
  }
  toString(): string {
    return `${Message.escape(this._sender)}:${Message.escape(this._chatId)}:${
      this._timestamp
    }:${Message.escape(this._content)}`
  }

  get id() {
    return `${this._sender}${this._chatId}${this._timestamp}`
  }

  static fromString(value: string): Message {
    const [sender, chatId, timestamp, content] = Message.unescape(value)
    return new Message(sender, chatId, parseInt(timestamp), content)
  }

  static escape(value: string): string {
    let out = ''
    for (let i = 0; i < value.length; i++) {
      const c = value.charAt(i)
      if (c === ':' || c === '\\') {
        out += '\\'
      }
      out += c
    }
    return out
  }

  static unescape(value: string): string[] {
    let out = []
    let current = ''
    let escaped = false
    for (let i = 0; i < value.length; i++) {
      const c = value.charAt(i)
      if (c === '\\' && !escaped) {
        escaped = true
      } else {
        if (escaped) {
          current += c
          escaped = false
        } else {
          if (current.length > 0) {
            out.push(current)
            current = ''
          }
          out.push(c)
        }
      }
    }
    if (current.length > 0) {
      out.push(current)
    }
    return out
  }
}
