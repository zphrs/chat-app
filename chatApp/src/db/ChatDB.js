export default class ChatDB {
  constructor(url) {
    this.url = url
    this.chats = []
    this.userInfo = {}
    this.closeUserWS = null
    this.loginCallbacks = [
      user => {
        this.userInfo[user] = user
      },
    ]
  }

  async createUser(name, id = undefined) {
    try {
      this.user = await post(this.url + "/make-user", { id, name }, this.user)
    } catch (e) {
      return null
    }
    for (const callback of this.loginCallbacks) {
      callback(this.user)
    }
    if (this.closeUserWS === null && this.user) {
      this.closeUserWS = this.subToUserChanges()
    }
    if (this.closeUserWS !== null && !this.user) {
      this.closeUserWS()
      this.closeUserWS = null
    }
    return this.user
  }

  async setUser(user, secret) {
    this.user = await get(this.url + `/me`, {
      secretId: secret,
      id: user,
    })
    if (this.user.chatIds !== undefined) {
      for (const chat of this.user.chatIds) {
        this.chats.push({
          id: chat,
          messages: [],
          lastFetch: 0,
        })
      }
    }
    for (const callback of this.loginCallbacks) {
      callback(this.user)
    }
    if (this.closeUserWS === null && this.user) {
      this.closeUserWS = this.subToUserChanges()
    }
    if (this.closeUserWS !== null && !this.user) {
      this.closeUserWS()
      this.closeUserWS = null
    }
    return this.user
  }

  async deleteAccount() {
    console.log(this.user)
    await post(this.url + "/delete-account", {}, this.user)
    this.user = undefined
    for (const callback of this.loginCallbacks) {
      callback(this.user)
    }
  }

  onUserChange(callback) {
    this.loginCallbacks.push(callback)
    return () => {
      this.loginCallbacks = this.loginCallbacks.filter(c => c !== callback)
    }
  }

  setLastMessage(id, index) {
    this.lastIndex = index
    this.lastMessage = id
  }

  async getTopMessages(chat, count, offset = 0) {
    const topMessages = await get(
      this.url + `/get-top-messages/${chat}/${offset}/${count}`,
      this.user
    )
    for (const message of topMessages) {
      await this.addUsernameToMessage(message)
    }
    return topMessages
  }

  async addUsernameToMessage(message) {
    if (!message.senderId) {
      message.username = "[unknown]"
      return message
    }
    const user = await this.getUserInfo(message.senderId)
    message.username = user.name
    return message
  }

  async sendMessage(chat, message) {
    await post(
      this.url + `/get-chat/${chat}/post-message`,
      { chatId: chat, message },
      this.user
    )
  }

  async subToUserChanges() {
    return new Promise((resolve, reject) => {
      if (!this.user) {
        reject("Not logged in")
      }
      const ws = new WebSocket(
        (location.protocol === "https:" ? "wss://" : "ws://") +
          new URL(this.url).host +
          "/ws/user?userId=" +
          this.user.id +
          "&secret=" +
          this.user.secretId
      )
      ws.onmessage = async event => {
        const data = JSON.parse(event.data)
        if (data.type === "update") {
          resolve(ws.close)
          this.user = data.user
          for (const callback of this.loginCallbacks) {
            callback(this.user)
          }
        }
      }
      ws.onerror = reject
      ws.onclose = () => {
        window.location.reload()
      }
    })
  }

  async subToChatMessages(chatId, listener, metadataListener) {
    return new Promise((resolve, reject) => {
      console.log(new URL(this.url))
      console.log("initing ws")
      if (!this.user) {
        throw new Error("No user logged in")
      }
      const ws = new WebSocket(
        (location.protocol === "https:" ? "wss://" : "ws://") +
          new URL(this.url).host +
          "/ws/chat?userId=" +
          this.user.id +
          "&secret=" +
          this.user.secretId +
          "&chatId=" +
          chatId
      )
      ws.onmessage = async event => {
        const data = JSON.parse(event.data)
        if (data.type === "error") {
        }
        if (data.type === "message") {
          const message = await this.addUsernameToMessage(data.message)
          listener(message)
        }
        if (data.type === "messages") {
          resolve(ws)
          for (let message of data.messages) {
            message = await this.addUsernameToMessage(message)
            listener(message)
          }
        }
        if (data.type === "metadata") {
          metadataListener(data.metadata)
        }
      }
      ws.onerror = e => {
        console.log(e)
        reject(e)
      }
      ws.onclose = e => {
        if (e.code === 1006) {
          console.log("ws closed")
          listener({
            type: "error",
            message: "Connection to chat '" + chatId + "' lost",
          })
        }
      }
    })
  }

  async promote(ws, userId) {
    ws.send(JSON.stringify({ type: "promote", userId }))
  }

  async createChat(id) {
    try {
      await post(this.url + "/add-chat", { users: [], id }, this.user)
      for (const callback of this.loginCallbacks) {
        callback(this.user)
      }
    } catch (e) {
      alert(`a chat with id '${id}' already exists`)
    }
  }
  /** @description Caches user info by default */
  async getUserInfo(userId, forceFetch = false) {
    if (forceFetch || this.userInfo[userId] === undefined) {
      const out = await get(this.url + `/get-user/${userId}`, this.user)
      this.userInfo[userId] = out
    }
    return this.userInfo[userId]
  }
}

async function post(url, data, user) {
  let auth = user ? `Bearer ${user.id}:${user.secretId}` : ""
  return (
    await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: auth,
      },
      body: JSON.stringify(data),
    })
  ).json()
}

async function get(url, user) {
  let auth = user ? `Bearer ${user.id}:${user.secretId}` : ""
  return (
    await fetch(url, {
      headers: {
        Authorization: auth,
      },
    })
  ).json()
}
