<template>
    <div class="video-player-container">
        <video ref="videoRef" :src="videoSrc" controls @play="handlePlay" @pause="handlePause"
            @timeupdate="handleTimeUpdate" @seeking="handleSeek" class="video-player"></video>
        <div class="sync-info">
            <p>连接状态: {{ connectionStatus }}</p>
            <p>当前播放时间: {{ formatTime(currentTime) }}</p>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const videoRef = ref(null)
const videoSrc = 'http://server.friendnest.cn/video'
const connectionStatus = ref('未连接')
const currentTime = ref(0)

let ws = null
let isSyncing = false
let lastSentTime = 0

const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

const handlePlay = () => {
    if (!isSyncing && ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({
            type: 'play',
            currentTime: videoRef.value.currentTime
        }))
    }
}

const handlePause = () => {
    if (!isSyncing && ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({
            type: 'pause',
            currentTime: videoRef.value.currentTime
        }))
    }
}

const handleTimeUpdate = () => {
    currentTime.value = videoRef.value.currentTime
}

const handleSeek = () => {
    if (!isSyncing && ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({
            type: 'seek',
            currentTime: videoRef.value.currentTime
        }))
    }
}

const initWebSocket = () => {
    ws = new WebSocket("ws://server.friendnest.cn/ws/")

    ws.onopen = () => {
        connectionStatus.value = '已连接'
        console.log('WebSocket connected')
    }

    ws.onmessage = (event) => {
        const data = JSON.parse(event.data)
        handleWebSocketMessage(data)
    }

    ws.onclose = () => {
        connectionStatus.value = '已断开'
        console.log('WebSocket disconnected')
        setTimeout(() => {
            initWebSocket()
        }, 3000)
    }

    ws.onerror = (error) => {
        console.error('WebSocket error:', error)
        connectionStatus.value = '连接错误'
    }
}

const handleWebSocketMessage = (data) => {
    isSyncing = true

    switch (data.type) {
        case 'init':
        case 'sync':
            if (videoRef.value) {
                videoRef.value.currentTime = data.state.currentTime
                if (data.state.isPlaying) {
                    videoRef.value.play().catch((error) => {
                        console.log('Autoplay prevented:', error)
                    })
                } else {
                    videoRef.value.pause()
                }
            }
            break
        case 'play':
            if (videoRef.value) {
                videoRef.value.currentTime = data.currentTime
                videoRef.value.play().catch((error) => {
                    console.log('Autoplay prevented:', error)
                })
            }
            break
        case 'pause':
            if (videoRef.value) {
                videoRef.value.currentTime = data.currentTime
                videoRef.value.pause()
            }
            break
        case 'seek':
            if (videoRef.value) {
                videoRef.value.currentTime = data.currentTime
            }
            break
    }

    setTimeout(() => {
        isSyncing = false
    }, 100)
}

onMounted(() => {
    initWebSocket()
})

onUnmounted(() => {
    if (ws) {
        ws.close()
    }
})
</script>

<style scoped>
.video-player-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
}

.video-player {
    width: 800px;
    max-width: 100%;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.sync-info {
    margin-top: 20px;
    padding: 15px;
    background-color: #f0f0f0;
    border-radius: 8px;
    text-align: center;
}
</style>