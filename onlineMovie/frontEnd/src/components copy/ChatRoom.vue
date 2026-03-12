<template>
    <div class="room">

        <h2>语音聊天室</h2>

        <input v-model="userId" placeholder="输入你的ID" />

        <button @click="connect">连接</button>
        <button @click="startMic">打开麦克风</button>

        <h3>在线用户</h3>
        <div v-for="u in users" :key="u">
            {{ u }}
        </div>

    </div>
</template>

<script setup>
import { ref } from "vue"
import { connectSocket, startVoice, onUserList } from "./voiceClient"

const userId = ref("")
const users = ref([])

const connect = () => {
    connectSocket(userId.value)
}

const startMic = () => {
    startVoice()
}

onUserList((list) => {
    users.value = list
})
</script>