<template>
  <div>
    <h1>Chat App</h1>
    <h2>About</h2>
    <router-link to="/">back</router-link>
    <p>
      Chats are readable by anyone who knows (or guesses) the chat id. Only
      promoted users are able to send messages. Any promoted user can see who
      has viewed the chat and promote any of them to be a messenger. Treat the
      chat id like a password for the chat.
    </p>
    <p>
      Your account and messages might be deleted at any time for any reason.
      This site is mostly an educational exercise for me, but if you want to use
      it feel free.
    </p>
    <p>
      Accounts are on a per-browser basis. There is no sign out and no way to
      log into another browser. For security's sake and my laziness in not
      wanting to do oAuth, you cannot log in on any other device. You can delete
      your account if you would like (the closest action to logging out) which
      will remove your name from all messages and will remove you from all
      chats. If a chat has no messengers left then the chat will be deleted.
      This action is irreversible. I recommend you delete your account before
      you log off if you are using a shared computer.
    </p>
    <p>
      If you want a secure and robust chat system, find a different chat system.
      If you just want an easy way to make a quick group chat (that has no
      notifications, verification, or guarentees about messages continuing to
      exist) with an easy join code then this site is for you!
    </p>
    <details>
      <summary>Nerdy Details</summary>
      <h3>Authentication</h3>
      <p>
        Essentially I use a uuid-v4 as a de facto password for every user,
        stored in localstorage. This is not secure as if the uuid is leaked then
        the account is permanently compromised since the uuid password never
        expires. What I <i>should</i> do is store a hashed+salted+peppered
        password for each user and manage all the oAuth stuff with a database.
        It's on my list of todos.
      </p>
      <h3>Database</h3>
      <p>
        I use node's fs library to read and write to json files. It isn't thread
        safe. It caches the data as it needs to in HashTables and then on every
        request after the first it will just get the data from memory. The
        database stores the data object on every assignment. The data object and
        its children get frozen. This ensures that the json file and the cached
        data remain in sync.
      </p>
      <h3>API</h3>
      <p>
        I wrote an api using express. The api consists of get requests to see
        messages and user info and post requests to create new messages and
        register accounts. Anyone can get messages if they know the chat id.
        Anyone can get user info if they know the user id. Only promoted
        approved users can post. Authentication for the API is done with bearer
        tokens.
      </p>
      <h3>Websocket</h3>
      <p>
        I use a websocket to allow messages to be updated in real time without
        needing to constantly poll the server for new messages. The websocket
        also sends information about metadata changes to anyone who is allowed
        to send messages to the chat.
      </p>
    </details>
    <router-link to="/">back</router-link>
  </div>
</template>

<style lang="scss" scoped>
p {
  text-align: left;
  margin: 1rem;
}
summary {
  font: inherit;
  padding: 10px;
  border-radius: 10px;
  border: 2px solid #2c3e50;
  color: #2c3e50;
  background-color: transparent;
  width: fit-content;
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
details {
  padding: 1rem;
  border-radius: 10px;
  text-align: left;
  border: 1px solid transparent;
  h3 {
    margin-bottom: 0;
  }
  h3 + p {
    margin-top: 0.1rem;
  }
}
details[open] {
  border-color: #2c3e50;
}
</style>