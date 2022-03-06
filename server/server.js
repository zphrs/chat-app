import express from "express"
import WebSocket, { WebSocketServer } from "ws"
const app = express()
const wsServer = new WebSocketServer({ noServer: true })
const wsUserServer = new WebSocketServer({ noServer: true })
const port = 5500
const whitelist = ["http://localhost:3000", "http://localhost:5500"]

import ChatDatabase from "../dist/ChatDatabase/ChatDatabase.js"

import { v4 } from "uuid"

const db = new ChatDatabase.default()

app.use(express.json())

app.use((req, res, next) => {
  const origin = req.headers.origin
  if (whitelist.indexOf(origin) > -1) {
    res.setHeader("Access-Control-Allow-Origin", origin)
  }
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  )
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type,X-Auth-Token,Authorization"
  )
  res.setHeader("Access-Control-Allow-Credentials", true)
  next()
})

app.post("/make-user", (req, res) => {
  try {
    const user = db.addUser(
      req.body.id ? req.body.id : v4(),
      v4(),
      req.body.name
    )
    res.send(JSON.stringify(user.data))
  } catch (e) {
    res.status(500).send(e.message)
  }
})

app.get("/get-user/:id", (req, res, next) => {
  try {
    const user = db.getUser(req.params.id)
    console.log(user.data)
    res.send({
      id: user.data.id,
      name: user.data.name,
    })
  } catch (e) {
    res.status(500).send(e.message)
  }
})

const verifySecret = (id, secret) => {
  const user = db.getUser(id)
  return user.data.secretId === secret
}

const verify = (req, res, next) => {
  const authHeader = req.headers.authorization
  if (!authHeader) {
    res.status(401).send("No authorization header")
    return
  }
  const [id, secret] = authHeader.split(" ")[1].split(":")
  res.locals.user = db.getUser(id)
  if (res.locals.user.data.secretId !== secret) {
    res.status(401).send("Invalid secret")
    return
  }
  next()
}

app.get("/me", verify, (req, res) => {
  const user = res.locals.user
  const out = {
    id: user.data.id,
    name: user.data.name,
    chatIds: user.data.chatIds,
    messageIds: user.data.messageIds,
  }
  res.send(user.data)
})

app.get("/get-chat/:chatId", verify, (req, res) => {
  try {
    const user = res.locals.user
    const chat = db.getChat(req.params.chatId)
    if (!chat.data.users.includes(user.data.id)) {
      res.status(401).send("You are not a member of this chat")
    }
    chat.addView(res.locals.user)
    user.addViewedChat(chat)
    res.send(chat.data)
  } catch (e) {
    res.status(500).send(e.message)
  }
})

app.post("/get-chat/:chatId/post-message", verify, (req, res) => {
  try {
    const user = res.locals.user
    const chat = db.getChat(req.params.chatId)
    console.log("adding message to chat " + req.params.chatId)
    if (chat.data.users.indexOf(user.data.id) === -1) {
      res.status(401).send("You are not allowed to post messages to this chat")
      return
    }
    chat.addMessage(user, req.body.message)
    res.send(chat.data)
  } catch (e) {
    console.log(e)
    res.status(500).send(e.message)
  }
})

app.get("/get-messages/:chatId/:offset/:limit", verify, (req, res) => {
  try {
    const chat = db.getChat(req.params.chatId)
    const messages = chat.getMessages(req.params.limit, req.params.offset)
    const out = messages.map(message => {
      return {
        id: message.data.id,
        from: message.data.senderId,
        message: message.data.content,
        timestamp: message.data.timestamp,
      }
    })
    const user = res.locals.user
    chat.addView(user)
    user.addViewedChat(chat)
    res.send(out)
  } catch (e) {
    res.status(500).send(e.message)
  }
})

app.get("/get-top-messages/:chatId/:offset/:limit", verify, (req, res) => {
  try {
    const chat = db.getChat(req.params.chatId)
    const messages = chat.getTopMessages(req.params.limit, req.params.offset)
    const out = messages.map(message => {
      return {
        id: message.data.id,
        from: message.data.senderId,
        message: message.data.content,
        timestamp: message.data.timestamp,
      }
    })
    const user = res.locals.user
    chat.addView(user)
    user.addViewedChat(chat)
    res.send(out)
  } catch (e) {
    res.status(500).send(e.message)
  }
})

app.get("/get-chat/:chatId/length", verify, (req, res) => {
  try {
    const length = db.getChat(req.params.chatId).data.messageIds.length
    res.send(
      JSON.stringify({
        length,
      })
    )
  } catch (e) {
    res.status(500).send(e.message)
  }
})

app.post("/delete-account", verify, (req, res) => {
  try {
    const user = res.locals.user
    db.deleteUser(user.id)
    res.send(JSON.stringify({ success: true }))
  } catch (e) {
    console.log(e)
    res.status(500).send(e.message)
  }
})

app.get("/get-json/:uid", verify, (req, res) => {
  const uid = req.params.uid
  const user = db.getUser(uid)
  const messages = user.data.messages
  const out = {
    userId: uid,
    name: user.data.name,
    messages: {},
  }
  const chatIds = user.data.chatIds
  for (const chatId of chatIds) {
    const messageIds = messages[chatId]
    const chat = db.getChat(chatId)
    const chatMessages = {
      id: chatId,
      messages: [],
    }
    for (const messageId of messageIds) {
      const message = chat.getMessage(messageId)
      chatMessages.messages.push({
        id: message.data.id,
        timestamp: message.data.timestamp,
        content: message.data.content,
      })
    }
    out.messages[chatId] = chatMessages.messages
  }
  res.send(JSON.stringify(out))
})

app.post("/add-chat", verify, (req, res) => {
  try {
    const user = res.locals.user
    const chat = db.createChat(req.body.id, user.id, req.body.users)
    for (const userId of req.body.users) {
      const user = db.getUser(userId)
      user.addInvite(chat)
    }
    res.send(JSON.stringify(chat.data))
  } catch (e) {
    console.log(e)
    res.status(500).send(e.message)
  }
})

const server = app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

server.on("upgrade", (request, socket, head) => {
  console.log("upgrading connection to web socket")
  const url = new URL(request.url, "http://localhost")
  const userId = url.searchParams.get("userId")
  const secret = url.searchParams.get("secret")
  const chatId = url.searchParams.get("chatId")
  if (!userId || !secret) {
    socket.destroy()
    return
  }
  let user
  try {
    user = db.getUser(userId)
  } catch (e) {
    console.log(e)
    socket.destroy()
    return
  }
  if (!user || user.data.secretId !== secret) {
    socket.destroy()
    return
  }
  switch (url.pathname) {
    case "/ws/chat":
      console.log("upgrading to chat")
      try {
        db.getChat(chatId)
      } catch (e) {
        console.log(e)
        socket.destroy()
        return
      }

      wsServer.handleUpgrade(request, socket, head, ws => {
        wsServer.emit("connection", ws, request, user)
      })
      break
    case "/ws/user":
      console.log("upgrading to user")
      wsUserServer.handleUpgrade(request, socket, head, ws => {
        wsUserServer.emit("connection", ws, request, user)
      })
      break
    default:
      socket.destroy()
  }
})

const activeChats = {}

wsServer.on("connection", (ws, req, user) => {
  console.log("connection")
  const chatId = new URL(req.url, "http://localhost").searchParams.get("chatId")
  let chat
  try {
    chat = db.getChat(chatId)
  } catch (e) {
    ws.send(
      JSON.stringify({
        type: "error",
        message: "Chat does not exist",
      })
    )
    ws.close()
    return
  }
  if (activeChats[chatId]) {
    activeChats[chatId].push(ws)
  } else {
    activeChats[chatId] = [ws]
  }
  let lastMessageId
  if (chat.data.messageIds.length > 0) {
    lastMessageId = chat.data.messageIds[chat.data.messageIds.length - 1]
  }
  chat.onDataChange(() => {
    console.log("data change")
    const data = chat.data
    const messageIds = data.messageIds
    console.log(messageIds, lastMessageId)
    if (messageIds.length > 0) {
      const latestMsgId = messageIds[messageIds.length - 1]
      if (lastMessageId !== latestMsgId) {
        lastMessageId = latestMsgId
        const message = chat.getMessage(latestMsgId)
        ws.send(
          JSON.stringify({
            type: "message",
            message: message.data,
          })
        )
      }
    }
    if (data.users.includes(user.id)) {
      user.addChat(chat)
      ws.send(
        JSON.stringify({
          type: "metadata",
          metadata: data,
        })
      )
    }
  })
  ws.on("message", msg => {
    const data = JSON.parse(msg)
    console.log(data)
    switch (data.type) {
      case "message":
        console.log("posted message")
        const message = chat.addMessage(user, data.message)
        activeChats[chatId].forEach(ws => {
          ws.send(
            JSON.stringify({
              type: "message",
              message,
            })
          )
        })
        break
      case "view":
        chat.addView(user)
        break
      case "promote":
        console.log("promote")
        if (chat.data.users.includes(user.id)) {
          console.log("promoting " + data.userId)
          chat.addUser(db.getUser(data.userId))
        }
        break
      case "getTopMessages":
        const messages = chat.getTopMessages(data.count, data.start)
        const out = messages.map(message => {
          return message.data
        })
        ws.send(
          JSON.stringify({
            type: "topMessages",
            messages: out,
            nextStart: data.start + data.count,
          })
        )
        break
    }
  })
  ws.onclose = () => {
    console.log("closed")
    activeChats[chatId] = activeChats[chatId].filter(ws => ws !== ws)
  }
  ws.onerror = () => {
    console.log("error")
    activeChats[chatId] = activeChats[chatId].filter(ws => ws !== ws)
  }
  ws.send(
    JSON.stringify({
      type: "messages",
      messages: chat.getTopMessages(10, 0).map(message => message.data),
    })
  )
  if (chat.data.users.includes(user.id)) {
    ws.send(
      JSON.stringify({
        type: "metadata",
        metadata: chat.data,
      })
    )
    user.addChat(chat)
  }
  user.addViewedChat(chat)
  chat.addView(user)
})

wsUserServer.on("connection", (ws, req, user) => {
  console.log("connecting to user ", user.data)
  const sendUser = () => {
    ws.send(
      JSON.stringify({
        type: "update",
        user: user.data,
      })
    )
  }
  user.onDataChange(() => {
    sendUser()
  })
  sendUser()
})
