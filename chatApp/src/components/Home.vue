<script setup>
import ChatDB from '../db/ChatDB'
import { useRouter, useRoute } from 'vue-router'
import { ref, toRefs } from 'vue'
import TextForm from './TextForm.vue'

const props = defineProps({
  db: Object,
  user: Object,
})

const { db, user } = toRefs(props)
const router = useRouter()
const route = useRoute()
console.log(user.value)

async function deleteAccount() {
  await db.value.deleteAccount()
  localStorage.removeItem('user')
  localStorage.removeItem('token')
  router.push('/')
}

async function createUser(name) {
  console.log('clicked')
  const user = await db.value.createUser(name)
  if (!user) {
    router.push({
      path: '/',
      query: {
        error: 'connection to chat server could not be made',
      },
    })
    window.setTimeout(() => {
      history.replaceState &&
        history.replaceState(
          history.state,
          '',
          location.pathname +
            location.search.replace(/[\?&]error=[^&]+/, '').replace(/^&/, '?') +
            location.hash
        )
    }, 0)
    return
  }
  localStorage.setItem('user', user.value.id)
  localStorage.setItem('token', user.value.secretId)
  if (route.query.redirect) {
    router.push(route.query.redirect)
  }
}

async function createChat(id) {
  try {
    await db.value.createChat(id)
  } catch (e) {
    console.log(e)
  }
  console.log(user.value)
}

async function joinChat(id) {
  router.push(`/chat/${id}`)
}

history.replaceState &&
  history.replaceState(
    history.state,
    '',
    location.pathname +
      location.search.replace(/[\?&]error=[^&]+/, '').replace(/^&/, '?') +
      location.hash
  )
</script>

<template>
  <div v-if="!user || user.name === undefined">
    <div class="error" v-if="route.query.error">
      {{ route.query.error }}
    </div>
    <h1>Chat App</h1>
    <h2 v-if="route.query.redirect">
      Create an account to go to {{ route.query.redirect }}
    </h2>
    <h2 v-else>Mostly just a tech demo.</h2>
    <p>
      <b>
        Warning: anything and everything that you post can be deleted or
        publicly exposed at any time. Use at your own risk.
      </b>
    </p>
    <router-link to="/about">About/policies</router-link>
    <br />
    <TextForm
      @submit="createUser"
      placeholder="username"
      btnText="Create Account"
      class="form"
      minlength="3"
    />
  </div>
  <div v-else>
    <div class="error" v-if="route.query.error">
      {{ route.query.error }}
    </div>
    <h1>Hello {{ user.name }}</h1>
    <router-link to="/about">About/policies</router-link>
    <br />
    <button @click="deleteAccount">Delete Account</button>
    <div class="chat-flex">
      <div class="form">
        <TextForm
          @submit="createChat"
          placeholder="id"
          btnText="Create Chat"
          minlength="6"
        />
        <h3>Postable Chats</h3>
        <div v-for="chat of [...user.chatIds].reverse()" :key="chat">
          <router-link :to="`/chat/${chat}`">{{ chat }}</router-link>
        </div>
      </div>
      <div class="form">
        <TextForm
          @submit="joinChat"
          placeholder="id"
          btnText="Join Chat"
          minlength="6"
        />
        <h3>Viewed Chats</h3>
        <div v-for="chat of [...user.viewedChats].reverse()" :key="chat">
          <router-link :to="`/chat/${chat}`">{{ chat }}</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
button {
  font: inherit;
  padding: 10px;
  border-radius: 10px;
  border: 2px solid #2c3e50;
  color: #2c3e50;
  background-color: transparent;
  cursor: pointer;
  &:hover {
    background-color: #2c3e50;
    color: #fff;
  }
  &:focus {
    box-shadow: inset 0 0 0 2px #2c3e50;
    outline: none;
  }
}
</style>

<style lang="scss" scoped>
.form {
  width: 400px;
  max-width: 100%;
}

.col {
  display: inline-block;
}

.error {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  white-space: nowrap;
  background-color: lightcoral;
}
.chat-flex {
  display: flex;
  justify-content: space-evenly;
  flex-wrap: wrap;
}
</style>