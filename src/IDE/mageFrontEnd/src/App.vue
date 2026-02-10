<template>
  <div ref="background"
    style="transition: all 0.5s;transition: 0.5s all;width: 100vw;height: 100vh;position: fixed;z-index: 0;">
    <ReactBackground :colors="['#ff5c7a', '#8a5cff', '#00ffd1']" :rotation="60" :speed="0.1" :scale="1" :frequency="1"
      :warpStrength="1" :mouseInfluence="0" :parallax="0.25" :noise="0.1" transparent />
  </div>
  <Login @login="loginHandel" v-model="showLogin"></Login>
  <WebMenu @logout="logoutHandel" v-model="showWebMenu"></WebMenu>
</template>
<script setup>
import ReactBackground from '@/components/element/ReactBackground.vue';
import { ref } from 'vue';
import Login from './views/Login.vue';

import WebMenu from './views/WebMenu/WebMenu.vue';
const background = ref(null)
const showLogin = ref(true)
const showWebMenu = ref(false)
function logoutHandel() {
  background.value.style.filter = "blur(0px)"
  showLogin.value = true
  showWebMenu.value = false
}
function loginHandel() {
  background.value.style.filter = "blur(30px)"
  showLogin.value = false
  showWebMenu.value = true
}
</script>
<style>
body {
  background-color: #000000;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}
</style>