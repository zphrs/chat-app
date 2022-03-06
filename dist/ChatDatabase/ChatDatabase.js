"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Database_1 = require("../Database");
const Chat_1 = __importDefault(require("./Chat"));
const Sender_1 = __importDefault(require("./Sender"));
class ChatDatabase extends Database_1.Database {
    constructor(rootPath = "./.data") {
        super("chatDB", undefined, rootPath);
        this._userDB = new Database_1.Database("users", this, rootPath);
        this._chatDB = new Database_1.Database("chats", this, rootPath);
        this.addChild(this._userDB);
        this.addChild(this._chatDB);
        if (this._userDB.data.ids === undefined) {
            this._userDB.data = {
                ids: [],
            };
        }
        if (this._chatDB.data.ids === undefined) {
            this._chatDB.data = {
                ids: [],
            };
        }
    }
    addUser(id, secretId, name) {
        const newUser = new Sender_1.default(id, secretId, name, this._userDB);
        if (!this._userDB.data.ids.includes(id)) {
            this._userDB.data = Object.assign(Object.assign({}, this._userDB.data), { ids: [...this._userDB.data.ids, id] });
        }
        else {
            throw new Error(`User ${id} already exists`);
        }
        this._userDB.addChild(newUser);
        return newUser;
    }
    deleteChat(id) {
        const chat = this.getChat(id);
        for (const userId of chat.data.users) {
            const user = this.getUser(userId);
            user.removeChat(chat);
        }
        for (const userId of chat.data.viewedBy) {
            try {
                const user = this.getUser(userId);
                console.log(user.data);
                user.removeView(chat);
            }
            catch (e) {
                console.log("viewer account already deleted");
            }
        }
        chat.delete();
        this._chatDB.removeChild(chat);
        this._chatDB.data = Object.assign(Object.assign({}, this._chatDB.data), { ids: this._chatDB.data.ids.filter((chatId) => chatId !== id) });
    }
    deleteUser(id) {
        const user = this.getUser(id);
        // remove user from chats
        for (const chatId of user.data.chatIds) {
            const chat = this.getChat(chatId);
            if (chat) {
                chat.removeUser(user);
                if (chat.data.users.length === 0) {
                    this.deleteChat(chatId);
                }
            }
        }
        for (const chatId of user.data.viewedChats) {
            const chat = this.getChat(chatId);
            if (chat) {
                chat.removeView(user);
            }
        }
        this._userDB.data = Object.assign(Object.assign({}, this._userDB.data), { ids: this._userDB.data.ids.filter((userId) => userId !== id) });
        user.delete();
    }
    getUser(id) {
        if (!this._userDB.data.ids.includes(id)) {
            throw new Error(`User ${id} does not exist`);
        }
        if (this._userDB.contains(id)) {
            return this._userDB.getChild(id);
        }
        const user = new Sender_1.default(id, "", "", this._userDB);
        this._userDB.addChild(user);
        return user;
    }
    getUserIds() {
        return this._userDB.data.ids;
    }
    getChatIds() {
        return this._chatDB.data.ids;
    }
    createChat(id, creator, userIds) {
        if (userIds === undefined) {
            userIds = [];
        }
        if (!userIds.includes(creator)) {
            userIds.push(creator);
        }
        if (!this._chatDB.data.ids.includes(id)) {
            this._chatDB.data = Object.assign(Object.assign({}, this._chatDB.data), { ids: [...this._chatDB.data.ids, id] });
        }
        else {
            throw new Error(`Chat ${id} already exists`);
        }
        const senders = userIds.map(id => this.getUser(id));
        const chat = new Chat_1.default(id, creator, senders, this._chatDB);
        for (let i = 0; i < senders.length; i++) {
            if (!senders[i].addChat) {
                throw new Error(`User ${userIds[i]} does not exist`);
            }
            senders[i].addChat(chat);
        }
        this._chatDB.addChild(chat);
        return chat;
    }
    getChat(id) {
        // check if chat exists
        if (!this._chatDB.data.ids.includes(id)) {
            throw new Error(`Chat ${id} does not exist`);
        }
        // check if chat is in memory
        if (this.contains(id)) {
            return this.getChild(id);
        }
        // if not, create it
        const chat = new Chat_1.default(id, "", [], this._chatDB);
        this.addChild(chat);
        return chat;
    }
}
exports.default = ChatDatabase;
