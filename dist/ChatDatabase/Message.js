"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Database_1 = require("../Database");
class Message extends Database_1.Database {
    constructor(id, _database, sender, chat, content, timestamp) {
        var _a, _b;
        super(id, _database);
        if (this.data.id === undefined) {
            this.data = {
                id,
                senderId: (_a = sender === null || sender === void 0 ? void 0 : sender.data.id) !== null && _a !== void 0 ? _a : "",
                chatId: (_b = chat === null || chat === void 0 ? void 0 : chat.data.id) !== null && _b !== void 0 ? _b : "",
                content,
                timestamp,
            };
        }
    }
    equals(value) {
        return this.data.id === value.data.id;
    }
}
exports.default = Message;
