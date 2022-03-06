import { describe } from "mocha"
import { expect } from "chai"
import ChatDatabase from "./ChatDatabase"
import fs from "fs"
import Message from "./Message"
import Sender from "./Sender"
import { Database } from "../Database"

fs.rmSync("./src/ChatDatabase/test/.data", { recursive: true, force: true })

describe("Create chats and users", () => {
  const db = new ChatDatabase("./src/ChatDatabase/test/.data")
  db.addUser("user1", "secret", "user1")
  db.addUser("user2", "secret", "user2")
  db.addUser("user3", "secret", "user3")
  const chat = db.createChat("chat", "user1", ["user1", "user2"])
  db.createChat("chat2", "user1", ["user1", "user3"])
  it("should create chat and chat2", () => {
    expect(db.getChatIds()).to.deep.equal(["chat", "chat2"])
  })
  it("should create user1, user2, user3", () => {
    expect(db.getUserIds()).to.deep.equal(["user1", "user2", "user3"])
  })
})

describe("Add messages", () => {
  const db = new ChatDatabase("./src/ChatDatabase/test/.data")
  const chat = db.getChat("chat")
  console.log(db.getUser("user1"))
  chat.addMessage(db.getUser("user1"), "Hello")
  chat.addMessage(db.getUser("user2"), "Hello")
  it("should add messages from user1 and user2", () => {
    expect(
      chat.getMessages().map(msg => {
        return {
          sender: msg.data.senderId,
          text: msg.data.content,
        }
      })
    ).to.deep.equal([
      {
        sender: "user1",
        text: "Hello",
      },
      {
        sender: "user2",
        text: "Hello",
      },
    ])
  })
  it("should throw an error for the third message", () => {
    try {
      chat.addMessage(db.getUser("user3"), "Hello")
    } catch (e: any) {
      expect(e.message)
    }
  })
  it("should get the first message only", () => {
    expect(
      chat.getMessages(1).map(msg => {
        return { sender: msg.data.senderId, text: msg.data.content }
      })
    ).to.deep.equal([
      {
        sender: "user1",
        text: "Hello",
      },
    ])
  })
  it("should get the second message only", () => {
    expect(
      chat.getMessages(1, 1).map(msg => {
        return { sender: msg.data.senderId, text: msg.data.content }
      })
    ).to.deep.equal([
      {
        sender: "user2",
        text: "Hello",
      },
    ])
  })
})
