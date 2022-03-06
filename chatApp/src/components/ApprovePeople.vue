<script setup>
import { toRefs, computed } from 'vue'
import ChatDB from '../db/ChatDB'
const props = defineProps({
  user: Object,
  chatMetadata: Object,
  db: ChatDB,
})

const emit = defineEmits(['promote'])
const { db, user, chatMetadata } = toRefs(props)
const filteredUsers = computed(() => {
  return chatMetadata.value.users.filter((id) => {
    return id !== user.value.id
  })
})
const filteredViewers = computed(() => {
  return chatMetadata.value.viewedBy.filter((id) => {
    return id !== user.value.id && !chatMetadata.value.users.includes(id)
  })
})

console.log(filteredUsers.value, filteredViewers.value)

function promoteUser(id) {
  emit('promote', id)
}
</script>

<template>
  <div>
    <div class="posters" v-if="filteredUsers.length">
      <h3>Posters:</h3>
      <div class="poster" v-for="chatUser in filteredUsers" :key="chatUser.id">
        {{ chatUser.name }}
      </div>
    </div>
    <div class="viewers" v-if="filteredViewers.length">
      <h3>Viewers:</h3>
      <div class="viewer" v-for="user in filteredViewers" :key="user.id">
        {{ user.name }} -
        <button @click="(e) => promoteUser(user.id)">Promote</button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.viewers {
  display: flex;
  flex-direction: column;
  margin-top: 0.5rem;
  & > * {
    margin-bottom: 0.5rem;
  }
}
</style>