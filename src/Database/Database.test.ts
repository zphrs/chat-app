import { describe } from "mocha"
import { expect } from "chai"
import Database from "./Database"

describe("Database", () => {
  const db = new Database("test")
  db.addChild(new Database("test1", db))
  db.addChild(new Database("test2", db))
  db.data = {
    test: "test",
  }
  console.log(db.data)
})
