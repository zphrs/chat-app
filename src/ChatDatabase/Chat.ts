import { Database } from "../Database"
import { DLList, Equals } from "../DLList"
import Message from "./Message"
import Sender from "./Sender"

export default class Chat extends Database implements Equals {
  constructor(
    id: string,
    owner: string,
    users: Sender[],
    private _database: Database,
    forFinding = false
  ) {
    super(id, _database, undefined, forFinding)
    if (forFinding) {
      this.data = {
        id,
      }
      return
    }
    if (this.data.id === undefined) {
      this.data = {
        id,
        messageIds: [] as string[],
        owner,
        users: users.map(user => user.id),
        viewedBy: users.map(user => user.id),
      }
    }
  }
  equals(value: any): boolean {
    return this.data.id === value.data.id
  }
  addUser(user: Sender) {
    if (this.data.users.includes(user.id)) {
      return
    }
    this.data = {
      ...this.data,
      users: [...this.data.users, user.id],
    }
  }
  removeUser(user: Sender) {
    this.data = {
      ...this.data,
      users: this.data.users.filter(
        (userId: string) => userId !== user.data.id
      ),
    }
    // get all messages from this user on this chat and set their senderId to null
    const messages = user.data.messages[this.data.id]
    if (messages) {
      messages.forEach((messageId: string) => {
        const message = this.getChild(messageId)
        message.data = {
          ...message.data,
          senderId: null,
        }
      })
    }
  }

  getUserIds(): string[] {
    return this.data.users
  }
  addMessage(from: Sender, content: string) {
    if (!this.data.users.includes(from.data.id)) {
      throw new Error(
        `User ${from.data.id} is not in this chat's users list. Cannot add message. Add user first.`
      )
    }
    const message = new Message(
      this.data.messageIds.length,
      this,
      from,
      this,
      content,
      Date.now()
    )
    from.addToMessageIds(message)

    this.addChild(message)

    this.data = {
      ...this.data,
      messageIds: [...this.data.messageIds, message.data.id],
    }
  }
  getMessages(limit = 50, offset = 0): Array<Message> {
    const messageIds = this.data.messageIds.slice(offset, offset + limit)
    return messageIds.map((id: string) => this.getChild(id))
  }
  getTopMessages(limit = 50, offset = 0): Array<Message> {
    console.log(this.data.messageIds.length)
    console.log(offset)
    const start = this.data.messageIds.length - offset - limit
    const end = this.data.messageIds.length - offset
    if (start < 0) {
      return this.data.messageIds
        .slice(0, end)
        .map((id: string) => this.getChild(id))
    }
    const messageIds = this.data.messageIds.slice(start, end)
    return messageIds.map((id: string) => this.getChild(id))
  }
  getMessage(id: string): Message {
    return this.getChild(id)
  }
  addView(user: Sender) {
    if (this.data.viewedBy.includes(user.data.id)) {
      return
    }
    this.data = {
      ...this.data,
      viewedBy: [...this.data.viewedBy, user.id],
    }
  }

  removeView(user: Sender) {
    this.data = {
      ...this.data,
      viewedBy: this.data.viewedBy.filter(
        (userId: string) => userId !== user.data.id
      ),
    }
  }
}
