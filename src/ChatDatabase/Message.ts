import { Database } from "../Database"
import Sender from "./Sender"
import Chat from "./Chat"
import { Equals } from "../DLList"

export default class Message extends Database implements Equals {
  constructor(
    id: string,
    _database: Database,
    sender?: Sender,
    chat?: Chat,
    content?: string,
    timestamp?: number
  ) {
    super(id, _database)
    if (this.data.id === undefined) {
      this.data = {
        id,
        senderId: sender?.data.id ?? "",
        chatId: chat?.data.id ?? "",
        content,
        timestamp,
      }
    }
  }
  equals(value: any): boolean {
    return this.data.id === value.data.id
  }
}
