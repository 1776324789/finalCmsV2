<script setup>
import { onMounted } from 'vue';
import { useWebSocket } from '../composables/useWebSocket';
import { useVideo } from '../composables/useVideo';
import { useUser } from '../composables/useUser';
import LoginForm from '../components/LoginForm.vue';
import UserInfo from '../components/UserInfo.vue';
import VideoList from '../components/VideoList.vue';
import VideoPlayer from '../components/VideoPlayer.vue';

// 引入composables
const { ws, connect, sendMessage } = useWebSocket();
const { 
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
} = useVideo();
const { username, showLogin, onlineUsers, login: userLogin, updateOnlineUsers } = useUser();



// 登录
function login() {
  if (userLogin(username.value)) {
    connect(username.value);
    fetchVideos();
    
    // 设置WebSocket消息处理
    if (ws.value) {
      ws.value.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          handleMessage(data);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };
    }
  }
}

// 处理视频选择
function handleSelectVideo(video) {
  // 选择视频的用户成为时间更新的主用户
  isTimeUpdateMaster = true;
  selectVideo(video, sendMessage);
}

// 处理播放
function handlePlay() {
  playVideo(null, sendMessage);
}

// 处理暂停
function handlePause(currentTime) {
  pauseVideo(currentTime, sendMessage);
}

// 处理跳转
function handleSeek(currentTime) {
  seekVideo(currentTime, sendMessage);
}

// 处理返回视频列表
function handleBack() {
  backToVideoList(sendMessage);
}

// 是否是时间更新的主用户
let isTimeUpdateMaster = false;

// 处理视频时间更新
function handleTimeUpdate(currentTime) {
  // 只有当当前用户是时间更新的主用户时才发送时间更新消息
  if (isTimeUpdateMaster) {
    // 发送时间更新消息给服务器
    sendMessage({
      type: 'seek',
      currentTime
    });
  }
}

// 处理WebSocket消息
function handleMessage(message) {
  switch (message.type) {
    case 'sync':
      // 当收到同步消息时，如果有视频在播放，自动切换到播放页面
      if (message.data.url) {
        showVideoList.value = false;
      }
      updateVideoState(message.data);
      break;
    case 'play':
    case 'pause':
    case 'seek':
      updateVideoState(message.data);
      break;
    case 'selectVideo':
      // 当其他用户选择视频时
      showVideoList.value = false;
      updateVideoState({
        url: message.data.url,
        isPlaying: false,
        currentTime: 0
      });
      break;
    case 'backToVideoList':
      // 当其他用户返回视频列表时
      showVideoList.value = true;
      break;
    case 'userList':
    case 'userJoined':
      // 更新在线用户列表
      updateOnlineUsers(message.users);
      // 只有当用户是第一个在线用户时，才成为时间更新的主用户
      if (message.users.length === 1 && message.users[0] === username.value) {
        isTimeUpdateMaster = true;
      }
      break;
    case 'userLeft':
      // 更新在线用户列表
      updateOnlineUsers(message.users);
      // 当主用户离开时，重新分配主用户
      if (message.users.length > 0 && !isTimeUpdateMaster) {
        // 简单起见，让第一个用户成为主用户
        isTimeUpdateMaster = message.users[0] === username.value;
      }
      break;
  }
}

// 组件挂载时
onMounted(() => {
  // 初始显示登录界面
});
</script>

<template>
  <div class="video-container">
    <h1>共享视频播放器</h1>
    
    <!-- 登录界面 -->
    <div v-if="showLogin" class="login-container">
      <LoginForm 
        v-model:username="username"
        @login="login"
      />
    </div>
    
    <!-- 视频列表 -->
    <div v-else-if="showVideoList" class="video-list-container">
      <UserInfo 
        :username="username"
        :online-users="onlineUsers"
      />
      <VideoList 
        :videos="videos"
        @select-video="handleSelectVideo"
      />
    </div>
    
    <!-- 视频播放器 -->
    <div v-else class="video-player-container">
      <UserInfo 
        :username="username"
        :online-users="onlineUsers"
      />
      <VideoPlayer 
        :video-state="videoState"
        @play="handlePlay"
        @pause="handlePause"
        @seek="handleSeek"
        @back="handleBack"
        @timeupdate="handleTimeUpdate"
      />
    </div>
  </div>
</template>

<style scoped>
.video-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;
}

.video-list-container,
.video-player-container {
  width: 100%;
}
</style>
