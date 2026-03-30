<script setup>
const props = defineProps({
  videos: {
    type: Array,
    default: () => []
  }
});

const emit = defineEmits(['select-video']);

function handleSelectVideo(video) {
  emit('select-video', video);
}
</script>

<template>
  <div class="video-list">
    <h2>选择视频</h2>
    <div class="video-items">
      <div 
        v-for="video in videos" 
        :key="video.id" 
        class="video-item"
        @click="handleSelectVideo(video)"
      >
        <div class="video-name">{{ video.name }}</div>
        <div class="video-filename">{{ video.filename }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.video-list {
  margin-bottom: 30px;
}

.video-items {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 20px;
}

.video-item {
  padding: 15px;
  background-color: #f0f0f0;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.video-item:hover {
  background-color: #e0e0e0;
}

.video-name {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 5px;
}

.video-filename {
  font-size: 14px;
  color: #666;
}
</style>
