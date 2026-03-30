import { ref, onUnmounted } from 'vue';

const SERVER_URL = 'ws://localhost:3000';

export function useWebSocket() {
  const ws = ref(null);
  const isConnected = ref(false);
  
  // 连接WebSocket服务器
  function connect(username) {
    ws.value = new WebSocket(SERVER_URL);
    
    ws.value.onopen = () => {
      console.log('WebSocket connected');
      isConnected.value = true;
      // 发送登录消息
      sendMessage({
        type: 'login',
        username
      });
    };
    
    ws.value.onclose = () => {
      console.log('WebSocket disconnected');
      isConnected.value = false;
    };
    
    ws.value.onerror = (error) => {
      console.error('WebSocket error:', error);
      isConnected.value = false;
    };
  }
  
  // 发送消息
  function sendMessage(message) {
    if (ws.value && ws.value.readyState === WebSocket.OPEN) {
      ws.value.send(JSON.stringify(message));
    } else {
      console.error('WebSocket is not connected');
    }
  }
  
  // 关闭WebSocket连接
  function close() {
    if (ws.value) {
      ws.value.close();
    }
  }
  
  // 组件卸载时关闭WebSocket
  onUnmounted(() => {
    close();
  });
  
  return {
    ws,
    isConnected,
    connect,
    sendMessage,
    close
  };
}
