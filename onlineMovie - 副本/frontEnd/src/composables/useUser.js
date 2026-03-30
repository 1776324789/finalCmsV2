import { ref } from 'vue';

export function useUser() {
  const username = ref('');
  const showLogin = ref(true);
  const onlineUsers = ref([]);
  
  // 登录
  function login(userName) {
    if (userName.trim()) {
      username.value = userName;
      showLogin.value = false;
      return true;
    }
    return false;
  }
  
  // 更新在线用户列表
  function updateOnlineUsers(users) {
    onlineUsers.value = users;
  }
  
  return {
    username,
    showLogin,
    onlineUsers,
    login,
    updateOnlineUsers
  };
}
