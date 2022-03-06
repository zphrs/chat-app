"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Database_1 = require("../Database");
const Message_1 = __importDefault(require("./Message"));
class Chat extends Database_1.Database {
    constructor(id, owner, users, _database, forFinding = false) {
        super(id, _database, undefined, forFinding);
        this._database = _database;
        if (forFinding) {
            this.data = {
                id,
            };
            return;
        }
        if (this.data.id === undefined) {
            this.data = {
                id,
                messageIds: [],
                owner,
                users: users.map(user => user.id),
                viewedBy: users.map(user => user.id),
            };
        }
    }
    equals(value) {
        return this.data.id === value.data.id;
    }
    addUser(user) {
        if (this.data.users.includes(user.id)) {
            return;
        }
        this.data = Object.assign(Object.assign({}, this.data), { users: [...this.data.users, user.id] });
    }
    removeUser(user) {
        this.data = Object.assign(Object.assign({}, this.data), { users: this.data.users.filter((userId) => userId !== user.data.id) });
        // get all messages from this user on this chat and set their senderId to null
        const messages = user.data.messages[this.data.id];
        if (messages) {
            messages.forEach((messageId) => {
                const message = this.getChild(messageId);
                message.data = Object.assign(Object.assign({}, message.data), { senderId: null });
            });
        }
    }
    getUserIds() {
        return this.data.users;
    }
    addMessage(from, content) {
        if (!this.data.users.includes(from.data.id)) {
            throw new Error(`User ${from.data.id} is not in this chat's users list. Cannot add message. Add user first.`);
        }
        const message = new Message_1.default(this.data.messageIds.length, this, from, this, content, Date.now());
        from.addToMessageIds(message);
        this.addChild(message);
        this.data = Object.assign(Object.assign({}, this.data), { messageIds: [...this.data.messageIds, message.data.id] });
    }
    getMessages(limit = 50, offset = 0) {
        const messageIds = this.data.messageIds.slice(offset, offset + limit);
        return messageIds.map((id) => this.getChild(id));
    }
    getTopMessages(limit = 50, offset = 0) {
        const messageIds = this.data.messageIds.slice(this.data.messageIds.length - offset - limit < 0
            ? 0
            : this.data.messageIds.length - offset - limit, this.data.messageIds.length - offset);
        return messageIds.map((id) => this.getChild(id));
    }
    getMessage(id) {
        return this.getChild(id);
    }
    addView(user) {
        if (this.data.viewedBy.includes(user.data.id)) {
            return;
        }
        this.data = Object.assign(Object.assign({}, this.data), { viewedBy: [...this.data.viewedBy, user.id] });
    }
    removeView(user) {
        this.data = Object.assign(Object.assign({}, this.data), { viewedBy: this.data.viewedBy.filter((userId) => userId !== user.data.id) });
    }
}
exports.default = Chat;
