<script setup>
import { ref } from 'vue';

const props = defineProps({
  username: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['update:username', 'login']);

const localUsername = ref(props.username);

function handleInput(e) {
  localUsername.value = e.target.value;
  emit('update:username', localUsername.value);
}

function handleLogin() {
  if (localUsername.value.trim()) {
    emit('login');
  } else {
    alert('请输入用户名');
  }
}

function handleKeyEnter(e) {
  if (e.key === 'Enter') {
    handleLogin();
  }
}
</script>

<template>
  <div class="login-form">
    <h2>请输入用户名</h2>
    <input 
      type="text" 
      :value="localUsername"
      @input="handleInput"
      placeholder="输入用户名" 
      @keyup.enter="handleKeyEnter"
    >
    <button @click="handleLogin">登录</button>
  </div>
</template>

<style scoped>
.login-form {
  background-color: #f0f0f0;
  padding: 30px;
  border-radius: 8px;
  text-align: center;
  width: 100%;
  max-width: 400px;
}

.login-form h2 {
  margin-bottom: 20px;
}

.login-form input {
  width: 100%;
  padding: 10px;
  margin-bottom: 20px;
  font-size: 16px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

button {
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
}

button:hover {
  background-color: #45a049;
}
</style>
