"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mocha_1 = require("mocha");
const Database_1 = __importDefault(require("./Database"));
(0, mocha_1.describe)("Database", () => {
    const db = new Database_1.default("test");
    db.addChild(new Database_1.default("test1", db));
    db.addChild(new Database_1.default("test2", db));
    db.data = {
        test: "test",
    };
    console.log(db.data);
});
