import { ref } from 'vue';

const API_URL = 'http://localhost:3000';

export function useVideo() {
  const videoState = ref({
    url: '',
    isPlaying: false,
    currentTime: 0
  });
  const videos = ref([]);
  const showVideoList = ref(true);
  
  // 获取视频列表
  async function fetchVideos() {
    try {
      const response = await fetch(`${API_URL}/api/videos`);
      if (response.ok) {
        const data = await response.json();
        videos.value = data;
      } else {
        console.error('Failed to fetch videos:', response.status);
      }
    } catch (error) {
      console.error('Error fetching videos:', error);
    }
  }
  
  // 更新视频状态
  function updateVideoState(data) {
    videoState.value = { ...data };
  }
  
  // 选择视频
  function selectVideo(video, sendMessage) {
    const fullUrl = `${API_URL}${video.url}`;
    showVideoList.value = false;
    
    // 通知所有用户选择了视频
    sendMessage({
      type: 'selectVideo',
      data: {
        url: fullUrl
      }
    });
    
    // 自动开始播放
    setTimeout(() => {
      playVideo(fullUrl, sendMessage);
    }, 500);
  }
  
  // 播放视频
  function playVideo(videoUrl = null, sendMessage) {
    const url = videoUrl || videoState.value.url || 'http://localhost:3000/video/test.mp4';
    const currentTime = videoState.value.currentTime || 0;
    
    sendMessage({
      type: 'play',
      url,
      currentTime
    });
  }
  
  // 暂停视频
  function pauseVideo(currentTime, sendMessage) {
    sendMessage({
      type: 'pause',
      currentTime
    });
  }
  
  // 跳转视频
  function seekVideo(currentTime, sendMessage) {
    sendMessage({
      type: 'seek',
      currentTime
    });
  }
  
  // 返回视频列表
  function backToVideoList(sendMessage) {
    showVideoList.value = true;
    
    // 通知所有用户返回视频列表
    sendMessage({
      type: 'backToVideoList'
    });
  }
  
  return {
    videoState,
    videos,
    showVideoList,
    fetchVideos,
    updateVideoState,
    selectVideo,
    playVideo,
    pauseVideo,
    seekVideo,
    backToVideoList
  };
}
