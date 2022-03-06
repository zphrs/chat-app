<script setup>
import ChatDB from '../db/ChatDB'
import { useRouter, useRoute } from 'vue-router'
import { ref, toRefs } from 'vue'
import TextForm from './TextForm.vue'

const props = defineProps({
  db: ChatDB,
  user: Object,
})

const { db, user } = toRefs(props)
const router = useRouter()
const route = useRoute()

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
</script>

<template>
  <div v-if="!user || user.name === undefined">
    <h1>Chat not found!</h1>
    <h2>Mostly just a tech demo.</h2>
    <p>
      <b>
        Warning: anything and everything that you post can be deleted or
        publicly exposed at any time. Use at your own risk.
      </b>
    </p>
    <router-link to="/">Back</router-link>
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
    <h1>Chat {{ route.params.id }} not found</h1>
    <router-link to="/">back to home</router-link>
    <br />
    <TextForm
      @submit="createChat"
      placeholder="id"
      btnText="Create Chat"
      class="form"
      minlength="6"
      :defaultValue="route.params.id"
    />
    <TextForm
      @submit="joinChat"
      placeholder="id"
      btnText="Join Chat"
      class="form"
      minlength="6"
    />

    <h3>Your chats:</h3>
    <div v-for="chat of [...user.chatIds].reverse()" :key="chat">
      <router-link :to="`/chat/${chat}`">{{ chat }}</router-link>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.form {
  width: 400px;
  max-width: 100%;
}
</style>