<template>
    <template v-if="userStore.user != null && userStore.systemInfo != null">
        <div v-for="movie in userStore.systemInfo.movieList" @click="watch(movie)" :key="movie.name">
            {{ movie.name }}
            <img class="cover" :src="movie.cover" alt="">
        </div>
    </template>

</template>
<script setup>
import { useUserStore } from '@/stores/userStore'
const userStore = useUserStore()

function watch(movie) {
    userStore.watchMovie(movie)
}

</script>
<style scoped>
.cover {
    width: 100px;
    height: 150px;
    object-fit: contain
}
</style>
