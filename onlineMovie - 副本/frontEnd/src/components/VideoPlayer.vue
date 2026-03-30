<script setup>
import { ref, watch, onMounted } from 'vue';

const props = defineProps({
  videoState: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['play', 'pause', 'seek', 'back', 'timeupdate']);

const videoRef = ref(null);

function handlePlay() {
  emit('play');
}

function handlePause() {
  if (videoRef.value) {
    emit('pause', videoRef.value.currentTime);
  }
}

function handleSeek() {
  const seekTime = prompt('Enter seek time (seconds):', videoRef.value ? videoRef.value.currentTime : 0);
  const currentTime = parseFloat(seekTime) || 0;
  emit('seek', currentTime);
}

function handleTogglePlay() {
  if (!videoRef.value) return;
  
  if (videoRef.value.paused) {
    handlePlay();
  } else {
    handlePause();
  }
}

// 时间更新计时器
let lastTimeUpdate = 0;

function handleTimeUpdate() {
  // 每1000毫秒同步一次时间（每秒一次）
  const now = Date.now();
  if (now - lastTimeUpdate >= 1000 && videoRef.value) {
    lastTimeUpdate = now;
    emit('timeupdate', videoRef.value.currentTime);
  }
}

function handleBack() {
  emit('back');
}

// 监听videoState的变化，更新视频元素的播放状态
watch(() => props.videoState, (newState, oldState) => {
  if (videoRef.value) {
    // 只有当状态真正变化时才更新
    if (!oldState || JSON.stringify(newState) !== JSON.stringify(oldState)) {
      // 更新视频源
      if (videoRef.value.src !== newState.url) {
        videoRef.value.src = newState.url;
        // 视频源变化后，等待视频加载完成再播放
        videoRef.value.onloadedmetadata = () => {
          if (newState.isPlaying) {
            videoRef.value.currentTime = newState.currentTime;
            videoRef.value.play().catch(error => console.error('Error playing video:', error));
          }
        };
      } else {
        // 视频源未变化，直接更新播放状态
        if (newState.isPlaying && videoRef.value.paused) {
          videoRef.value.currentTime = newState.currentTime;
          videoRef.value.play().catch(error => console.error('Error playing video:', error));
        } else if (!newState.isPlaying && !videoRef.value.paused) {
          videoRef.value.pause();
        } else if (Math.abs(videoRef.value.currentTime - newState.currentTime) > 0.5) {
          // 只更新时间，不影响播放状态
          videoRef.value.currentTime = newState.currentTime;
        }
      }
    }
  }
}, { deep: true });

// 组件挂载时初始化视频状态
onMounted(() => {
  if (videoRef.value && props.videoState.url) {
    // 初始化视频源
    videoRef.value.src = props.videoState.url;
    
    // 等待视频加载完成后再设置时间和播放
    videoRef.value.onloadedmetadata = () => {
      // 初始化播放时间
      videoRef.value.currentTime = props.videoState.currentTime;
      
      // 初始化播放状态
      if (props.videoState.isPlaying) {
        videoRef.value.play().catch(error => console.error('Error playing video:', error));
      }
    };
  }
});
</script>

<template>
  <div class="video-player">
    <button class="back-button" @click="handleBack">返回视频列表</button>
    <video 
      ref="videoRef" 
      width="800" 
      height="450" 
      controls 
      @timeupdate="handleTimeUpdate"
      @click="handleTogglePlay"
    >
      <source :src="videoState.url" type="video/mp4">
      Your browser does not support the video tag.
    </video>
    <div class="controls">
      <button @click="handlePlay">播放</button>
      <button @click="handlePause">暂停</button>
      <button @click="handleSeek">跳转</button>
    </div>

  </div>
</template>

<style scoped>
.video-player {
  width: 100%;
}

video {
  width: 100%;
  height: auto;
  margin-bottom: 20px;
}

.controls {
  margin-bottom: 20px;
}

button {
  padding: 10px 20px;
  margin-right: 10px;
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

.back-button {
  margin-bottom: 20px;
  background-color: #2196F3;
}

.back-button:hover {
  background-color: #0b7dda;
}

.status {
  background-color: #f0f0f0;
  padding: 15px;
  border-radius: 4px;
}

.status p {
  margin: 5px 0;
}
</style>
