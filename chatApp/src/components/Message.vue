<script setup>
import ChatDB from '../db/ChatDB'

defineProps({
  user: Object,
  message: Object,
})
</script>

<template>
  <div class="message" :class="message.senderId === user.id && 'me'">
    <b>{{ message.username }}</b>
    <br />
    {{ message.content }}
  </div>
</template>

<style scoped>
.message {
  padding: 10px;
  border-radius: 5px;
  background-color: #f5f5f5;
  margin-bottom: 10px;
  text-align: left;
  display: block;
  width: fit-content;
  align-self: start;
}

.me {
  background-color: #2c3e50;
  color: #fff;
  align-self: end;
}

.parent {
  display: flex;
  flex-direction: row;
  align-items: center;
}
</style>