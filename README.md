# Chat APP

## Mostly just a tech demo

check it out at [https://zchats.glitch.me](https://zchats.glitch.me)

## Run it
> Make sure to run npm install in the root directory!
### To run the front end locally:

1. cd into chatApp
2. npm install
3. npm run dev

### To run the back end locally:

1. cd into server
2. npm install
3. npm start

## Get local front end to talk to local backend

1. find [/chatApp/src/App.vue](/chatApp/src/App.vue)
2. find the line that says:

```js
const db = new ChatDB("https://zchats-backend.glitch.me")
```

3. change it to be 
```js
const db = new ChatDB("http://localhost:5500")
```
