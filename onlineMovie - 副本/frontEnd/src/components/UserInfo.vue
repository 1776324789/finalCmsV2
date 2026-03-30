<script setup>
const props = defineProps({
  username: {
    type: String,
    required: true
  },
  onlineUsers: {
    type: Array,
    default: () => []
  }
});
</script>

<template>
  <div class="user-info">
    <div class="current-user">当前用户: {{ username }}</div>
    <div class="online-users">
      <span>在线用户 ({{ onlineUsers.length }}):</span>
      <ul>
        <li v-for="user in onlineUsers" :key="user">{{ user }}</li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.user-info {
  background-color: #f0f0f0;
  padding: 15px;
  border-radius: 4px;
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.current-user {
  font-weight: bold;
}

.online-users {
  flex: 1;
  margin-left: 20px;
}

.online-users ul {
  list-style: none;
  padding: 0;
  margin: 5px 0 0 0;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.online-users li {
  background-color: #e0e0e0;
  padding: 5px 10px;
  border-radius: 15px;
  font-size: 14px;
}
</style>
