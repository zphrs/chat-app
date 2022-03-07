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
  border-radius: 5px 5px 5px 0px;
  background-color: #f5f5f5;
  margin-bottom: 10px;
  text-align: left;
  display: block;
  width: fit-content;
  max-width: 80%;
}

.me {
  background-color: #2c3e50;
  border-radius: 5px 5px 0px 5px;
  color: #fff;
  margin-left: auto;
}

.parent {
  display: flex;
  flex-direction: row;
  align-items: center;
}
</style>