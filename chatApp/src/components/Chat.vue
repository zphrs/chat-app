<script setup>
import { useRoute, useRouter } from 'vue-router'
import { onBeforeUnmount, ref, toRefs, computed } from 'vue'
import TextForm from './TextForm.vue'
import Message from './Message.vue'
import ChatDB from '../db/ChatDB'
import ApprovePeople from './ApprovePeople.vue'
const props = defineProps({
  db: ChatDB,
  user: Object,
})
const route = useRoute()
const router = useRouter()
const { db, user } = toRefs(props)
// get variable in route
const chatId = route.params.id
const isAdmin = computed(() => {
  return chatMetadata.value.id
})

const messages = ref([])
const chatMetadata = ref({})
const messagesDiv = ref(null)
const showUserModal = ref(false)
const ws = ref(null)

let subbedToChat = false

async function subToChat() {
  if (subbedToChat) {
    return
  }
  subbedToChat = true
  try {
    ws.value = await db.value.subToChatMessages(
      chatId,
      (message) => {
        if (message.type && message.type === 'error') {
          router.push({
            path: '/',
            query: {
              error: message.message,
            },
          })
        }
        console.log('added message ', message)
        messages.value = [...messages.value, message]
        window.setTimeout(() => {
          messagesDiv.value.scrollTo(0, messagesDiv.value.scrollHeight, {
            behavior: 'smooth',
          })
        }, 0)
      },
      async (metadata) => {
        console.log('metadata', metadata)
        metadata.viewedBy = await Promise.all(
          metadata.viewedBy.map((id) => {
            return db.value.getUserInfo(id)
          })
        )
        metadata.users = await Promise.all(
          metadata.users.map((id) => {
            return db.value.getUserInfo(id)
          })
        )
        chatMetadata.value = metadata
      }
    )
  } catch (e) {
    console.log('HERE')
    router.push(route.path.replace(/\/+$/, '') + '/404')
  }
}

if (user.value) {
  subToChat()
}

const unsub = db.value.onUserChange(subToChat)

function postMessage(message) {
  if (message.length < 1) {
    return
  }
  db.value.sendMessage(chatId, message)
}

onBeforeUnmount(() => {
  unsub()
  ws.value.close()
})

function scrollToBottom() {
  messagesDiv.value.scrollTo(0, messagesDiv.value.scrollHeight, {
    behavior: 'smooth',
  })
}

function promote(id) {
  db.value.promote(ws.value, id)
}
</script>

<template>
  <div class="chat-parent">
    <div class="top">
      <router-link to="/" class="link">home</router-link>
      <button v-if="isAdmin" @click="showUserModal = !showUserModal">
        {{ showUserModal ? 'Hide' : 'Show Viewers' }}
      </button>
    </div>
    <div
      class="messages"
      ref="messagesDiv"
      v-if="!showUserModal"
      @vnodeMounted="scrollToBottom"
    >
      <Message
        v-for="message in messages"
        :message="message"
        :user="user"
        :db="db"
        :key="message.id"
      ></Message>
    </div>
    <ApprovePeople
      :chatMetadata="chatMetadata"
      :user="user"
      :db="db"
      @promote="promote"
      v-else
    ></ApprovePeople>
    <div v-if="!showUserModal" class="send">
      <TextForm
        v-if="isAdmin"
        btnText="post"
        placeholder="message"
        @submit="postMessage"
        minlength="1"
      />
      <div v-else>
        <p>
          You are not allowed to post in this chat. Contact the person who sent
          you the link to ask for posting privleges.
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.messages {
  display: flex;
  flex-direction: column;
  overflow: auto;
  ::-webkit-scrollbar {
    width: 0;
  }
  scroll-behavior: smooth;
}
.chat-parent {
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  padding: 0.5rem;
  box-sizing: border-box;
  justify-content: flex-start;
  .send {
    margin-top: auto;
  }
}

.top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}
</style>