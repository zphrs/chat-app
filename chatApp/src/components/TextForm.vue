<script setup>
import { toRefs } from 'vue'
const emit = defineEmits(['submit'])
const props = defineProps({
  btnText: String,
  placeholder: String,
  minlength: String,
  maxlength: String,
  defaultValue: String,
})

const { btnText, placeholder, minlength, maxlength, defaultValue } =
  toRefs(props)

function onSubmit(e) {
  // get value from input
  const value = e.target.text.value
  if (minlength.value && value.length < Number.parseInt(minlength.value)) return
  if (maxlength.value && value.length > Number.parseInt(maxlength.value)) return
  // emit event
  emit('submit', value)
  e.target.children[0].value = ''
}
</script>

<template>
  <form @submit.prevent="onSubmit">
    <input
      type="text"
      :minlength="minlength"
      :maxlength="maxlength"
      name="text"
      :placeholder="placeholder"
      :value="defaultValue"
      required
    />
    <button>{{ btnText }}</button>
  </form>
</template>

<style scoped lang="scss">
input {
  font-size: 1.2em;
  padding: 10px;
  width: 100%;
  border: 2px solid #2c3e50;
  border-radius: 10px;
  font: inherit;
  color: #2c3e50;
  &:focus {
    outline: none;
    border-color: #2c3e50;
  }
  &:invalid {
    color: black;
    &::placeholder {
      color: gray;
    }
  }
}

button {
  font: inherit;
  padding: 10px;
  border-radius: 10px;
  width: max-content;
  flex: 0 0 auto;
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
form {
  display: inline-flex;
  padding: 1rem;
  * {
    margin: 0;
  }
  input {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
    border-right: none;
  }
  button {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }
  width: 100%;
  box-sizing: border-box;
}
</style>