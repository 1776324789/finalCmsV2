<template>
    <template v-if="userStore.user == null">
        <div> 请输入你的昵称 </div>
        <input v-model="nickname" placeholder="输入你的昵称" />
        <button @click="login">登录</button>
    </template>

</template>

<script setup>
import { ref } from 'vue'
import { useUserStore } from '@/stores/userStore'
const userStore = useUserStore()


const nickname = ref("大菠萝")
function login() {
    userStore.login(nickname.value)
}

</script>