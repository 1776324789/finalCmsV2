<template>
    <template v-if="userStore.user != null">
        <div v-for="friend in userStore.DefaultUser" :key="friend">
            {{ friend.user }}{{ userStore.systemInfo.onlineUser.includes(friend.user) ? '（在线）' : '（离线）' }}
        </div>
    </template>
</template>
<script setup>
import { useUserStore } from '@/stores/userStore'
const userStore = useUserStore()
</script>
<style scoped></style>
