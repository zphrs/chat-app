'use strict'
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value)
          })
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value))
        } catch (e) {
          reject(e)
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value))
        } catch (e) {
          reject(e)
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected)
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next())
    })
  }
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod }
  }
Object.defineProperty(exports, '__esModule', { value: true })
/**
 * This is the main server script that provides the API endpoints
 *
 * Uses sqlite.js to connect to db
 */
const path_1 = __importDefault(require('path'))
const whitelist = [
  'http://localhost:3000',
  'http://localhost:3001',
  'mvhsrrw-submissions.web.app',
]
const fastify_1 = require('fastify')
const fastify_static_1 = __importDefault(require('fastify-static'))
const fastify = (0, fastify_1.fastify)({
  // Set this to true for detailed logging:
  logger: false,
})
fastify.register(fastify_static_1.default, {
  root: path_1.default.join(__dirname, 'public'),
})
fastify.register(require('fastify-websocket'))
const db = require('./initSqliteDB.js')
const Delta = require('quill-delta')
const rooms = {}
const dbTimeout = {}
fastify.get('/ws', { websocket: true }, (conn, req) => {
  // console.log(req.headers['x-forwarded-for'].split(",") || req.socket.remoteAddress)
  // console.log("HERE")
  const docId = req.query ? req.query.docId : null
  const username = req.query ? req.query.username : null
  let room = rooms[docId]
  console.log(room)
  if (!room) {
    console.log('init contents: ' + db.getDoc(docId).content)
    room = rooms[docId] = {
      docId: docId,
      users: [],
      masterDoc: new Delta(JSON.parse(db.getDoc(docId).content)),
      dbTimeout: null,
      batchedChanges: null,
    }
  }
  room.users.push({ conn, req })
  conn.socket.on('close', () => {
    room.users = room.users.filter((user) => user.conn !== conn)
    console.log('closing')
    saveChanges()
    if (room.users.length === 0) {
      delete rooms[docId]
    }
  })
  function saveChanges() {
    console.log('saveChanges')
    if (room.batchedChanges == null) {
      console.log('changes already saved')
      return
    }
    const newContents = room.masterDoc.compose(room.batchedChanges)
    db.setDoc(docId, JSON.stringify(newContents))
    room.batchedChanges = null
    room.masterDoc = new Delta(JSON.parse(JSON.stringify(newContents)))
    room.dbTimeout = null
    // broadcast to all users
    room.users.forEach((user) => {
      user.conn.socket.send(
        JSON.stringify({
          type: 'setContents',
          delta: room.masterDoc,
        })
      )
    })
  }
  conn.socket.on('message', (msg) =>
    __awaiter(void 0, void 0, void 0, function* () {
      if (!docId) {
        conn.socket.send('No docId provided')
        conn.socket.close()
        return
      }
      if (!username) {
        conn.socket.send('No username provided')
        conn.socket.close()
        return
      }
      msg = JSON.parse(msg.toString())
      switch (msg.type) {
        case 'getcontents':
          saveChanges()
          console.log('getcontents')
          if (room.masterDoc == undefined) {
            conn.socket.send('invlaid docId')
            conn.socket.close()
            break
          }
          if (room.masterDoc == null) {
            conn.socket.send('invlaid docId')
          }
          conn.socket.send(
            JSON.stringify({
              type: 'setcontents',
              content: JSON.stringify(room.masterDoc),
              author: 'ROOT',
            })
          )
          break
        case 'updatecontents':
          const delta = new Delta(JSON.parse(msg.delta))
          db.updateDoc(docId, msg.delta, username)
          if (room.batchedChanges)
            room.batchedChanges = room.batchedChanges.compose(delta)
          else room.batchedChanges = delta
          console.log(room.batchedChanges)
          if (room.dbTimeout) {
            clearTimeout(room.dbTimeout)
          }
          room.dbTimeout = setTimeout(() => {
            console.log('db stuff')
            saveChanges()
          }, 1000)
          for (let i = 0; i < room.users.length; i++) {
            if (room.users[i].conn == conn) continue
            room.users[i].conn.socket.send(
              JSON.stringify({
                type: 'updatecontents',
                delta: msg.delta,
                author: username,
              })
            )
          }
          break
        default:
          conn.socket.send('invalid message type')
          conn.socket.close()
          break
      }
    })
  )
})
fastify.post('/createDoc', (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const startingContent = req.body ? req.body.content : null
    const username = req.body ? req.body.username : null
    if (!startingContent) {
      res.send('No content provided')
      return
    }
    const docId = db.createDoc(startingContent)
    console.log('Created doc', docId)
    res.send(docId)
  })
)
// Run the server and report out to the logs
fastify.listen(process.env.PORT, function (err, address) {
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }
  console.log(`Your app is listening on http://localhost:3000`)
  fastify.log.info(`server listening on ${address}`)
})
