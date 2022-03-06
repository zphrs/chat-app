"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mocha_1 = require("mocha");
const chai_1 = require("chai");
const ChatDatabase_1 = __importDefault(require("./ChatDatabase"));
const fs_1 = __importDefault(require("fs"));
fs_1.default.rmSync("./src/ChatDatabase/test/.data", { recursive: true, force: true });
(0, mocha_1.describe)("Create chats and users", () => {
    const db = new ChatDatabase_1.default("./src/ChatDatabase/test/.data");
    db.addUser("user1", "secret", "user1");
    db.addUser("user2", "secret", "user2");
    db.addUser("user3", "secret", "user3");
    const chat = db.createChat("chat", "user1", ["user1", "user2"]);
    db.createChat("chat2", "user1", ["user1", "user3"]);
    it("should create chat and chat2", () => {
        (0, chai_1.expect)(db.getChatIds()).to.deep.equal(["chat", "chat2"]);
    });
    it("should create user1, user2, user3", () => {
        (0, chai_1.expect)(db.getUserIds()).to.deep.equal(["user1", "user2", "user3"]);
    });
});
(0, mocha_1.describe)("Add messages", () => {
    const db = new ChatDatabase_1.default("./src/ChatDatabase/test/.data");
    const chat = db.getChat("chat");
    console.log(db.getUser("user1"));
    chat.addMessage(db.getUser("user1"), "Hello");
    chat.addMessage(db.getUser("user2"), "Hello");
    it("should add messages from user1 and user2", () => {
        (0, chai_1.expect)(chat.getMessages().map(msg => {
            return {
                sender: msg.data.senderId,
                text: msg.data.content,
            };
        })).to.deep.equal([
            {
                sender: "user1",
                text: "Hello",
            },
            {
                sender: "user2",
                text: "Hello",
            },
        ]);
    });
    it("should throw an error for the third message", () => {
        try {
            chat.addMessage(db.getUser("user3"), "Hello");
        }
        catch (e) {
            (0, chai_1.expect)(e.message);
        }
    });
    it("should get the first message only", () => {
        (0, chai_1.expect)(chat.getMessages(1).map(msg => {
            return { sender: msg.data.senderId, text: msg.data.content };
        })).to.deep.equal([
            {
                sender: "user1",
                text: "Hello",
            },
        ]);
    });
    it("should get the second message only", () => {
        (0, chai_1.expect)(chat.getMessages(1, 1).map(msg => {
            return { sender: msg.data.senderId, text: msg.data.content };
        })).to.deep.equal([
            {
                sender: "user2",
                text: "Hello",
            },
        ]);
    });
});
