<template>
    <Menu>
        <RouterView v-slot="{ Component }">
            <KeepAlive>
                <component :is="Component" />
            </KeepAlive>
        </RouterView>
    </Menu>
</template>
<script setup lang="ts">
import Menu from './element/Menu.vue';

</script>