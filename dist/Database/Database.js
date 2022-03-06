"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const HashTable_1 = require("../HashTable");
const fs_1 = __importDefault(require("fs"));
class DatabaseNode {
    constructor(dbName, parent = undefined, dataPath = "./.data", dontWrite = false) {
        this.dbName = dbName;
        this.parent = parent;
        this.dataPath = dataPath;
        this._children = new HashTable_1.HashTable(100);
        this._data = {
            sortValue: undefined,
        };
        this._listeners = [];
        if (dontWrite) {
            return;
        }
        // create folder and file with fs
        const path = this.path;
        console.log(path);
        if (!fs_1.default.existsSync(dataPath)) {
            fs_1.default.mkdirSync(dataPath, { recursive: true });
        }
        if (!fs_1.default.existsSync(path)) {
            fs_1.default.mkdirSync(path);
        }
        if (!fs_1.default.existsSync(path + "/data.json")) {
            fs_1.default.writeFileSync(path + "/data.json", JSON.stringify(this._data));
        }
        else {
            console.log(`${path}/data.json already exists`);
            const fileContents = fs_1.default.readFileSync(path + "/data.json", "utf8");
            this._data = JSON.parse(fileContents);
        }
    }
    get sortValue() {
        if (this._data.sortValue === undefined) {
            return 0;
        }
        return this._data.sortValue;
    }
    compareTo(value) {
        return this.sortValue - value.sortValue;
    }
    equals(value) {
        return this.dbName === value.name;
    }
    addChild(child) {
        if (this._children.contains(new HashTable_1.HashableString(child.dbName))) {
            throw new Error(`Child ${child.dbName} already exists`);
        }
        this._children.put(new HashTable_1.HashableString(child.dbName), child);
    }
    removeChild(child) {
        console.log(child.data.id);
        try {
            this._children.remove(new HashTable_1.HashableString(child.data.id));
        }
        catch (e) {
            console.log(e);
            console.log("child already removed");
        }
    }
    getChild(name) {
        if (!this._children.contains(new HashTable_1.HashableString(name))) {
            this.addChild(new DatabaseNode(name, this));
        }
        return this._children.get(new HashTable_1.HashableString(name));
    }
    getKeys() {
        return this._children.getKeys();
    }
    get path() {
        if (this.parent) {
            return this.parent.path + "/" + this.dbName;
        }
        return this.dataPath + "/" + this.dbName;
    }
    get data() {
        return this._data;
    }
    delete() {
        fs_1.default.rmSync(this.path, { recursive: true, force: true });
        for (const childKey of this._children.getKeys()) {
            const child = this.getChild(childKey.toString());
            this.removeChild(child);
            child.delete();
        }
        if (this.parent) {
            this.parent.removeChild(this);
        }
    }
    set data(value) {
        const deepCopy = JSON.parse(JSON.stringify(value));
        function deepFreeze(obj, path) {
            for (const pathObj of path) {
                if (pathObj === obj) {
                    return;
                }
            }
            const properties = Object.getOwnPropertyNames(obj);
            for (const prop of properties) {
                const propValue = obj[prop];
                if (propValue && typeof propValue === "object") {
                    deepFreeze(propValue, [...path, obj]);
                }
            }
            Object.freeze(obj);
        }
        deepFreeze(deepCopy, []);
        this._data = deepCopy;
        this.save(this.path, true);
        for (const listener of this._listeners) {
            console.log("listener");
            listener(this._data);
        }
    }
    save(path, shallow = false) {
        fs_1.default.writeFileSync(path + "/data.json", JSON.stringify(this._data));
        if (shallow) {
            return;
        }
        for (const child of this._children.getKeys()) {
            this.getChild(child.toString()).save(path + `/${this.dbName}`);
        }
    }
    onDataChange(funct) {
        console.log("listener added");
        this._listeners.push(funct);
        return () => {
            this._listeners = this._listeners.filter(f => f !== funct);
        };
    }
    contains(value) {
        return this._children.contains(new HashTable_1.HashableString(value));
    }
}
exports.default = DatabaseNode;
