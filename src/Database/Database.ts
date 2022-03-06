import { HashTable, HashableString } from "../HashTable"
import { Comparable, DLList, SortableDLList } from "../DLList"
import fs from "fs"
import { resolve } from "path"
import { Message } from "../ChatDatabase"

export default class DatabaseNode implements Comparable<DatabaseNode> {
  private _children = new HashTable<HashableString, DatabaseNode>(100)

  private _data = {
    sortValue: undefined,
  } as any

  private _listeners = [] as Array<Function>

  constructor(
    public dbName: string,
    private parent: DatabaseNode | undefined = undefined,
    private readonly dataPath: string = "./.data",
    dontWrite: boolean = false
  ) {
    if (dontWrite) {
      return
    }
    // create folder and file with fs
    const path = this.path
    console.log(path)
    if (!fs.existsSync(dataPath)) {
      fs.mkdirSync(dataPath, { recursive: true })
    }
    if (!fs.existsSync(path)) {
      fs.mkdirSync(path)
    }
    if (!fs.existsSync(path + "/data.json")) {
      fs.writeFileSync(path + "/data.json", JSON.stringify(this._data))
    } else {
      console.log(`${path}/data.json already exists`)
      const fileContents = fs.readFileSync(path + "/data.json", "utf8")
      this._data = JSON.parse(fileContents)
    }
  }

  get sortValue(): number {
    if (this._data.sortValue === undefined) {
      return 0
    }
    return this._data.sortValue
  }

  compareTo(value: DatabaseNode): number {
    return this.sortValue - value.sortValue
  }

  equals(value: any): boolean {
    return this.dbName === value.name
  }

  addChild(child: DatabaseNode) {
    if (this._children.contains(new HashableString(child.dbName))) {
      throw new Error(`Child ${child.dbName} already exists`)
    }
    this._children.put(new HashableString(child.dbName), child)
  }

  removeChild(child: DatabaseNode) {
    console.log(child.data.id)
    try {
      this._children.remove(new HashableString(child.data.id))
    } catch (e) {
      console.log(e)
      console.log("child already removed")
    }
  }

  getChild(name: string): DatabaseNode {
    if (!this._children.contains(new HashableString(name))) {
      this.addChild(new DatabaseNode(name, this))
    }
    return this._children.get(new HashableString(name))
  }

  getKeys(): DLList<HashableString> {
    return this._children.getKeys()
  }

  get path(): string {
    if (this.parent) {
      return this.parent.path + "/" + this.dbName
    }
    return this.dataPath + "/" + this.dbName
  }

  get data() {
    return this._data
  }

  delete() {
    fs.rmSync(this.path, { recursive: true, force: true })
    for (const childKey of this._children.getKeys()) {
      const child = this.getChild(childKey.toString())
      this.removeChild(child)
      child.delete()
    }
    if (this.parent) {
      this.parent.removeChild(this)
    }
  }

  set data(value) {
    const deepCopy = JSON.parse(JSON.stringify(value))
    function deepFreeze(obj: any, path: Array<Object>) {
      for (const pathObj of path) {
        if (pathObj === obj) {
          return
        }
      }
      const properties = Object.getOwnPropertyNames(obj)
      for (const prop of properties) {
        const propValue = obj[prop]
        if (propValue && typeof propValue === "object") {
          deepFreeze(propValue, [...path, obj])
        }
      }
      Object.freeze(obj)
    }
    deepFreeze(deepCopy, [])
    this._data = deepCopy
    this.save(this.path, true)
    for (const listener of this._listeners) {
      console.log("listener")
      listener(this._data)
    }
  }

  save(path: string, shallow: boolean = false) {
    fs.writeFileSync(path + "/data.json", JSON.stringify(this._data))
    if (shallow) {
      return
    }
    for (const child of this._children.getKeys()) {
      this.getChild(child.toString()).save(path + `/${this.dbName}`)
    }
  }

  onDataChange(funct: Function) {
    console.log("listener added")
    this._listeners.push(funct)
    return () => {
      this._listeners = this._listeners.filter(f => f !== funct)
    }
  }

  contains(value: string): boolean {
    return this._children.contains(new HashableString(value))
  }
}
