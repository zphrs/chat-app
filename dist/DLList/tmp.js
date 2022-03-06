"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const DLList_1 = __importDefault(require("./DLList"));
class SortableDLList extends DLList_1.default {
    constructor() {
        super();
    }
    add(value) {
        if (this.size === 0) {
            this.add(value);
            return;
        }
        let current = this.getItem(0);
        let index = 0;
        while (current.value.compareTo(value) < 0) {
            if (current.next === null) {
                break;
            }
            current = current.next;
            index++;
        }
        this.insert(index, value);
    }
    static sort(input) {
        const out = new SortableDLList();
        for (const item of input) {
            out.add(item);
        }
        return out;
    }
}
exports.default = SortableDLList;
