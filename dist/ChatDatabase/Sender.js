"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Database_1 = require("../Database");
class Sender extends Database_1.Database {
    constructor(id, secretId, name, _database) {
        super(id, _database);
        if (this.data.id === undefined) {
            this.data = {
                id,
                name,
                secretId,
                chatIds: [],
                viewedChats: [],
                chatInvites: [],
                messages: {},
            };
        }
    }
    get name() {
        return this.data.name;
    }
    get id() {
        return this.data.id;
    }
    set id(value) {
        throw new Error("Cannot set id on a Sender; instead you need to delete this node and create a new one with the same data but with a different id");
    }
    set name(value) {
        this.data = Object.assign(Object.assign({}, this.data), { name: value });
    }
    equals(value) {
        return this.data.id === value.data.id;
    }
    getChats() {
        return this.data.chatIds;
    }
    addChat(chat) {
        if (this.data.chatIds.includes(chat.data.id)) {
            return;
        }
        this.data = Object.assign(Object.assign({}, this.data), { chatIds: [...this.data.chatIds, chat.data.id] });
        this.removeInvite(chat);
    }
    addInvite(chat) {
        if (this.data.chatInvites.includes(chat.data.id)) {
            return;
        }
        this.data = Object.assign(Object.assign({}, this.data), { chatInvites: [...this.data.chatInvites, chat.data.id] });
    }
    removeInvite(chat) {
        this.data = Object.assign(Object.assign({}, this.data), { chatInvites: this.data.chatInvites.filter((id) => id !== chat.data.id) });
    }
    addViewedChat(chat) {
        if (this.data.viewedChats.includes(chat.data.id)) {
            return;
        }
        this.data = Object.assign(Object.assign({}, this.data), { viewedChats: [...this.data.viewedChats, chat.data.id] });
    }
    removeChat(chat) {
        const index = this.data.chatIds.indexOf(chat.data.id);
        if (index === -1) {
            throw new Error(`Chat ${chat.data.id} is not in ${this.dbName}'s chats`);
        }
        this.data = Object.assign(Object.assign({}, this.data), { chatIds: [...this.data.chatIds.splice(index, 1)], chatInvites: [
                ...this.data.chatInvites.filter((id) => id !== chat.data.id),
            ] });
    }
    removeView(chat) {
        const index = this.data.viewedChats.indexOf(chat.data.id);
        if (index === -1) {
            throw new Error(`Chat ${chat.data.id} is not in ${this.dbName}'s viewed chats`);
        }
        this.data = Object.assign(Object.assign({}, this.data), { viewedChats: this.data.viewedChats
                .slice(0, index)
                .concat(this.data.viewedChats.slice(index + 1)) });
    }
    changeName(name) {
        this.data.name = name;
    }
    addToMessageIds(message) {
        var _a;
        this.data = Object.assign(Object.assign({}, this.data), { messages: Object.assign(Object.assign({}, this.data.messages), { [message.data.chatId]: [
                    ...((_a = this.data.messages[message.data.chatId]) !== null && _a !== void 0 ? _a : []),
                    message.data.id,
                ] }) });
    }
}
exports.default = Sender;
