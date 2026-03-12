<template>
    <div>
        <button @click="play">播放左侧人声音频</button>
    </div>
</template>
<script setup>
import { ref } from 'vue'
let audioContext = null
let panner = ref(null)
let source = null

const initAudio = async () => {

    audioContext = new AudioContext()

    const audio = new Audio("/public/test.mp3")
    audio.crossOrigin = "anonymous"

    source = audioContext.createMediaElementSource(audio)

    // 创建空间节点
    panner.value = audioContext.createPanner()

    panner.value.panningModel = "HRTF"
    panner.value.distanceModel = "inverse"

    // 声音位置
    panner.value.positionX.value = -1
    panner.value.positionY.value = 0
    panner.value.positionZ.value = 0

    source.connect(panner.value)
    panner.value.connect(audioContext.destination)

    audio.play()
}

const play = () => {
    if (!audioContext) {
        initAudio()
    }
}

</script>