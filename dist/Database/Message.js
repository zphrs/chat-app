"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Message {
    constructor(sender, chatId, timestamp, content) {
        this._sender = sender;
        this._chatId = chatId;
        this._timestamp = timestamp;
        this._content = content;
    }
    compareTo(value) {
        return this._timestamp - value._timestamp;
    }
    equals(value) {
        return (this._sender === value._sender &&
            this._chatId === value._chatId &&
            this._timestamp === value._timestamp);
    }
    toString() {
        return `${Message.escape(this._sender)}:${Message.escape(this._chatId)}:${this._timestamp}:${Message.escape(this._content)}`;
    }
    get id() {
        return `${this._sender}${this._chatId}${this._timestamp}`;
    }
    static fromString(value) {
        const [sender, chatId, timestamp, content] = Message.unescape(value);
        return new Message(sender, chatId, parseInt(timestamp), content);
    }
    static escape(value) {
        let out = '';
        for (let i = 0; i < value.length; i++) {
            const c = value.charAt(i);
            if (c === ':' || c === '\\') {
                out += '\\';
            }
            out += c;
        }
        return out;
    }
    static unescape(value) {
        let out = [];
        let current = '';
        let escaped = false;
        for (let i = 0; i < value.length; i++) {
            const c = value.charAt(i);
            if (c === '\\' && !escaped) {
                escaped = true;
            }
            else {
                if (escaped) {
                    current += c;
                    escaped = false;
                }
                else {
                    if (current.length > 0) {
                        out.push(current);
                        current = '';
                    }
                    out.push(c);
                }
            }
        }
        if (current.length > 0) {
            out.push(current);
        }
        return out;
    }
}
exports.default = Message;
