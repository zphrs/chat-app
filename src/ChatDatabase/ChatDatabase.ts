import { Database } from "../Database"
import { SortableDLList } from "../DLList"
import Chat from "./Chat"
import Message from "./Message"
import Sender from "./Sender"

export default class ChatDatabase extends Database {
  private _userDB: Database
  private _chatDB: Database
  constructor(rootPath = "./.data") {
    super("chatDB", undefined, rootPath)
    this._userDB = new Database("users", this, rootPath)
    this._chatDB = new Database("chats", this, rootPath)
    this.addChild(this._userDB)
    this.addChild(this._chatDB)
    if (this._userDB.data.ids === undefined) {
      this._userDB.data = {
        ids: [],
      }
    }
    if (this._chatDB.data.ids === undefined) {
      this._chatDB.data = {
        ids: [],
      }
    }
  }
  addUser(id: string, secretId: string, name: string) {
    const newUser = new Sender(id, secretId, name, this._userDB)
    if (!this._userDB.data.ids.includes(id)) {
      this._userDB.data = {
        ...this._userDB.data,
        ids: [...this._userDB.data.ids, id],
      }
    } else {
      throw new Error(`User ${id} already exists`)
    }
    this._userDB.addChild(newUser)
    return newUser
  }

  deleteChat(id: string) {
    const chat = this.getChat(id)
    for (const userId of chat.data.users) {
      const user = this.getUser(userId)
      user.removeChat(chat)
    }
    for (const userId of chat.data.viewedBy) {
      try {
        const user = this.getUser(userId)
        console.log(user.data)
        user.removeView(chat)
      } catch (e) {
        console.log("viewer account already deleted")
      }
    }
    chat.delete()
    this._chatDB.removeChild(chat)
    this._chatDB.data = {
      ...this._chatDB.data,
      ids: this._chatDB.data.ids.filter((chatId: string) => chatId !== id),
    }
  }

  deleteUser(id: string) {
    const user = this.getUser(id)
    // remove user from chats
    for (const chatId of user.data.chatIds) {
      const chat = this.getChat(chatId)
      if (chat) {
        chat.removeUser(user)
        if (chat.data.users.length === 0) {
          this.deleteChat(chatId)
        }
      }
    }
    for (const chatId of user.data.viewedChats) {
      const chat = this.getChat(chatId)
      if (chat) {
        chat.removeView(user)
      }
    }
    this._userDB.data = {
      ...this._userDB.data,
      ids: this._userDB.data.ids.filter((userId: string) => userId !== id),
    }
    user.delete()
  }
  getUser(id: string): Sender {
    if (!this._userDB.data.ids.includes(id)) {
      throw new Error(`User ${id} does not exist`)
    }
    if (this._userDB.contains(id)) {
      return this._userDB.getChild(id) as Sender
    }
    const user = new Sender(id, "", "", this._userDB)
    this._userDB.addChild(user)
    return user
  }
  getUserIds() {
    return this._userDB.data.ids
  }
  getChatIds() {
    return this._chatDB.data.ids
  }
  createChat(id: string, creator: string, userIds?: Array<string>) {
    if (userIds === undefined) {
      userIds = []
    }
    if (!userIds.includes(creator)) {
      userIds.push(creator)
    }
    if (!this._chatDB.data.ids.includes(id)) {
      this._chatDB.data = {
        ...this._chatDB.data,
        ids: [...this._chatDB.data.ids, id],
      }
    } else {
      throw new Error(`Chat ${id} already exists`)
    }
    const senders = userIds.map(id => this.getUser(id))
    const chat = new Chat(id, creator, senders, this._chatDB)
    for (let i = 0; i < senders.length; i++) {
      if (!senders[i].addChat) {
        throw new Error(`User ${userIds[i]} does not exist`)
      }
      senders[i].addChat(chat)
    }
    this._chatDB.addChild(chat)
    return chat
  }
  getChat(id: string): Chat {
    // check if chat exists
    if (!this._chatDB.data.ids.includes(id)) {
      throw new Error(`Chat ${id} does not exist`)
    }
    // check if chat is in memory
    if (this.contains(id)) {
      return this.getChild(id) as Chat
    }
    // if not, create it
    const chat = new Chat(id, "", [], this._chatDB)
    this.addChild(chat)
    return chat
  }
}
