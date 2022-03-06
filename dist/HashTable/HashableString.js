"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const hashCode_1 = __importDefault(require("./hashCode"));
class HashableString {
    constructor(string) {
        this.string = string;
    }
    hashCode() {
        return (0, hashCode_1.default)(this.string);
    }
    equals(value) {
        return value == this.string;
    }
    toString() {
        return this.string;
    }
}
exports.default = HashableString;
