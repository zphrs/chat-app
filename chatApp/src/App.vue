<script setup>
import ChatDB from './db/ChatDB'
import { ref, onMounted } from 'vue'
import { useRoute, useRouter, onBeforeRouteUpdate } from 'vue-router'
const db = new ChatDB('https://zchats-backend.glitch.me')
const user = ref(db.user)
const route = useRoute()
const router = useRouter()
db.onUserChange(() => {
  user.value = { ...db.user }
  console.log('user changed', user.value)
})

router.beforeEach(async (to, from) => {
  console.log('before each', to, from, user.value)
  if (user.value) {
    return true
  }
  if (to.path === '/') {
    try {
      await db.setUser(
        localStorage.getItem('user'),
        localStorage.getItem('token')
      )
      return true
    } catch (e) {
      return true
    }
  }
  if (!user.value && localStorage.getItem('user')) {
    await db.setUser(
      localStorage.getItem('user'),
      localStorage.getItem('token')
    )
    if (!user.value) {
      localStorage.removeItem('user')
      localStorage.removeItem('token')
    } else {
      return true
    }
  }
  return {
    path: '/',
    query: {
      redirect: to.fullPath,
    },
  }
})
</script>

<template>
  <div id="app">
    <router-view :user="user" :db="db"></router-view>
  </div>
</template>

<style lang="scss" scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
