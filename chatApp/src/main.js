import { createApp } from "vue"
import App from "./App.vue"
import About from "./components/About.vue"
import Home from "./components/Home.vue"
import Chat from "./components/Chat.vue"
import Chat404 from "./components/Chat404.vue"
import { createRouter, createWebHistory } from "vue-router"

const routes = [
  { path: "/", component: Home },
  { path: "/about", component: About },
  { path: "/chat/:id", component: Chat },
  { path: "/chat/:id/404", component: Chat404 },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

createApp(App).use(router).mount("#app")
