import { DLList, Equals } from "../DLList"
import { Database } from "../Database"
import Chat from "./Chat"
import Message from "./Message"

export default class Sender extends Database implements Equals {
  constructor(id: string, secretId: string, name: string, _database: Database) {
    super(id, _database)
    if (this.data.id === undefined) {
      this.data = {
        id,
        name,
        secretId,
        chatIds: [] as Array<string>,
        viewedChats: [] as Array<string>,
        chatInvites: [] as Array<string>,
        messages: {} as { [chat: string]: string[] },
      }
    }
  }
  get name() {
    return this.data.name
  }
  get id() {
    return this.data.id
  }
  set id(value: string) {
    throw new Error(
      "Cannot set id on a Sender; instead you need to delete this node and create a new one with the same data but with a different id"
    )
  }
  set name(value: string) {
    this.data = {
      ...this.data,
      name: value,
    }
  }
  equals(value: any): boolean {
    return this.data.id === value.data.id
  }
  getChats() {
    return this.data.chatIds
  }
  addChat(chat: Chat) {
    if (this.data.chatIds.includes(chat.data.id)) {
      return
    }
    this.data = {
      ...this.data,
      chatIds: [...this.data.chatIds, chat.data.id],
    }
    this.removeInvite(chat)
  }
  addInvite(chat: Chat) {
    if (this.data.chatInvites.includes(chat.data.id)) {
      return
    }
    this.data = {
      ...this.data,
      chatInvites: [...this.data.chatInvites, chat.data.id],
    }
  }
  removeInvite(chat: Chat) {
    this.data = {
      ...this.data,
      chatInvites: this.data.chatInvites.filter(
        (id: string) => id !== chat.data.id
      ),
    }
  }
  addViewedChat(chat: Chat) {
    if (this.data.viewedChats.includes(chat.data.id)) {
      return
    }
    this.data = {
      ...this.data,
      viewedChats: [...this.data.viewedChats, chat.data.id],
    }
  }
  removeChat(chat: Chat) {
    const index = this.data.chatIds.indexOf(chat.data.id)
    if (index === -1) {
      throw new Error(`Chat ${chat.data.id} is not in ${this.dbName}'s chats`)
    }
    this.data = {
      ...this.data,
      chatIds: [...this.data.chatIds.splice(index, 1)],
      chatInvites: [
        ...this.data.chatInvites.filter((id: string) => id !== chat.data.id),
      ],
    }
  }
  removeView(chat: Chat) {
    const index = this.data.viewedChats.indexOf(chat.data.id)
    if (index === -1) {
      throw new Error(
        `Chat ${chat.data.id} is not in ${this.dbName}'s viewed chats`
      )
    }
    this.data = {
      ...this.data,
      viewedChats: this.data.viewedChats
        .slice(0, index)
        .concat(this.data.viewedChats.slice(index + 1)),
    }
  }
  changeName(name: string) {
    this.data.name = name
  }
  addToMessageIds(message: Message) {
    this.data = {
      ...this.data,
      messages: {
        ...this.data.messages,
        [message.data.chatId]: [
          ...(this.data.messages[message.data.chatId] ?? []),
          message.data.id,
        ],
      },
    }
  }
}
