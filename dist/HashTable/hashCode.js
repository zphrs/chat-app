"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function hashCode(string) {
    let hash = 0;
    for (let i = 0; i < string.length; i++) {
        let character = string.charCodeAt(i);
        hash = (hash << 5) - hash + character;
        hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash);
}
exports.default = hashCode;
