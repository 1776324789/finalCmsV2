const express = require('express');
const cors = require('cors');
const WebSocket = require('ws');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

// 启用CORS
app.use(cors());

// 静态文件服务，用于提供视频文件
app.use('/video', express.static(path.join(__dirname, 'files', 'video')));
app.use('/image', express.static(path.join(__dirname, 'files', 'image')));

// 获取视频列表
app.get('/api/videos', (req, res) => {
  const videoDir = path.join(__dirname, 'files', 'video');
  
  fs.readdir(videoDir, (err, files) => {
    if (err) {
      console.error('Error reading video directory:', err);
      res.status(500).json({ error: 'Failed to read video directory' });
      return;
    }
    
    // 过滤出视频文件
    const videoFiles = files.filter(file => {
      const ext = path.extname(file).toLowerCase();
      return ['.mp4', '.avi', '.mov', '.wmv', '.flv', '.mkv'].includes(ext);
    });
    
    // 生成视频信息列表
    const videos = videoFiles.map(file => ({
      id: file, // 使用文件名作为ID
      name: path.basename(file, path.extname(file)), // 去除扩展名的文件名
      url: `/video/${file}`, // 视频URL
      filename: file // 完整文件名
    }));
    
    res.json(videos);
  });
});

// 启动HTTP服务器
const server = app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Video files available at http://localhost:${PORT}/video`);
});

// 创建WebSocket服务器
const wss = new WebSocket.Server({ server });

// 存储所有连接的客户端及其用户名
const clients = new Map(); // key: WebSocket, value: username

// 存储当前视频状态
let videoState = {
  url: '',
  isPlaying: false,
  currentTime: 0
};

// 获取在线用户列表
function getOnlineUsers() {
  return Array.from(clients.values());
}

// 广播在线用户列表
function broadcastUserList() {
  const users = getOnlineUsers();
  broadcast({
    type: 'userList',
    users
  });
}

// 处理WebSocket连接
wss.on('connection', (ws) => {
  console.log('New client connected');
  
  // 处理客户端消息
  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      
      switch (data.type) {
        case 'login':
          // 处理登录消息
          const username = data.username || `User_${Date.now()}`;
          clients.set(ws, username);
          console.log(`User logged in: ${username}`);
          
          // 发送当前视频状态给新登录的客户端
          ws.send(JSON.stringify({
            type: 'sync',
            data: videoState
          }));
          
          // 广播用户加入消息
          broadcast({
            type: 'userJoined',
            users: getOnlineUsers()
          });
          break;
          
        case 'play':
          videoState = {
            ...videoState,
            url: data.url,
            isPlaying: true,
            currentTime: data.currentTime || 0
          };
          broadcast({
            type: 'play',
            data: videoState
          });
          break;
          
        case 'pause':
          videoState.isPlaying = false;
          videoState.currentTime = data.currentTime;
          broadcast({
            type: 'pause',
            data: videoState
          });
          break;
          
        case 'seek':
          videoState.currentTime = data.currentTime;
          broadcast({
            type: 'seek',
            data: videoState
          });
          break;
          
        case 'selectVideo':
          // 更新视频状态
          videoState = {
            ...videoState,
            url: data.url,
            isPlaying: false,
            currentTime: 0
          };
          // 广播视频选择消息
          broadcast({
            type: 'selectVideo',
            data: {
              url: data.url
            }
          });
          break;
          
        case 'backToVideoList':
          // 广播返回视频列表消息
          broadcast({
            type: 'backToVideoList'
          });
          break;
          
        case 'sync':
          // 同步请求，发送当前状态
          ws.send(JSON.stringify({
            type: 'sync',
            data: videoState
          }));
          break;
      }
    } catch (error) {
      console.error('Error processing message:', error);
    }
  });
  
  // 处理连接关闭
  ws.on('close', () => {
    const username = clients.get(ws);
    if (username) {
      console.log(`User disconnected: ${username}`);
      clients.delete(ws);
      // 广播用户离开消息
      broadcast({
        type: 'userLeft',
        users: getOnlineUsers()
      });
    } else {
      console.log('Client disconnected without login');
    }
  });
  
  // 处理错误
  ws.on('error', (error) => {
    const username = clients.get(ws);
    if (username) {
      console.error(`WebSocket error for user ${username}:`, error);
      clients.delete(ws);
      // 广播用户离开消息
      broadcast({
        type: 'userLeft',
        users: getOnlineUsers()
      });
    } else {
      console.error('WebSocket error:', error);
    }
  });
});

// 广播消息给所有客户端
function broadcast(message) {
  const messageString = JSON.stringify(message);
  clients.forEach((username, client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(messageString);
    }
  });
}

console.log('WebSocket server started');
console.log('Waiting for client connections...');