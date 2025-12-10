<template>
  <!-- <HomeCotent /> -->
  <!-- <LoadingCover />
  <RouterView v-slot="{ Component }">
    <KeepAlive>
      <component :is="Component" />
    </KeepAlive>
  </RouterView> -->
  <div class="main">
    <div class="leftBlock">
      <img src="@/assets/imgs/background.png"></img>
    </div>
    <div class="bar1"></div>
    <div class="bar"></div>
    <div class="rightBlock">
      <div style="flex:0.5;"></div>
      <div class="title">FinalCMS</div>

      <div class="label">用户名<span class="tip">请输入用户名</span></div>
      <input class="input" type="text" placeholder="请输入用户名">

      <div class="label">密码<span class="tip">请输入密码</span></div>
      <input class="input" type="text" placeholder="请输入密码">

      <div class="label">验证码<span class="tip">请输入验证码</span></div>
      <div class="verifyBlock">
        <input class="inputSmall" placeholder="请输入验证码" type="text">
        <div class="svgBlock">

        </div>
      </div>
      <button class="loginButton">登&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;录</button>
      <div class="bottom">
        <div style="flex:1;"></div>
        @Ahead
        <div style="flex:0.5;"></div>
      </div>
    </div>
  </div>
 
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import BoidsWeb from './components/element/BoidsWeb.vue';
import DotBackground from './components/element/DotBackground.vue';

</script>
<style scoped>
/* ---------- base ---------- */
:root {
  --bg1: #0f172a;
  --accent: 220 80% 60%;
  /* hue saturation lightness for dynamic use */
  --glass-bg: rgba(255, 255, 255, 0.06);
  --glass-border: rgba(255, 255, 255, 0.12);
  --glass-highlight: rgba(255, 255, 255, 0.25);
  --glass-shadow: 0 10px 30px rgba(2, 6, 23, 0.6);
}

html,
body {
  height: 100%;
}

body {
  margin: 0;
  font-family: Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background: radial-gradient(1200px 600px at 10% 10%, rgba(99, 102, 241, 0.12), transparent),
    radial-gradient(800px 400px at 90% 80%, rgba(236, 72, 153, 0.08), transparent),
    linear-gradient(180deg, var(--bg1), #081028 80%);
  color: #e6eef8;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 48px;
  overflow: hidden;
}

/* animated colorful blobs in background */
.blobs {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  mix-blend-mode: screen;
}

.blob {
  position: absolute;
  width: 520px;
  height: 520px;
  border-radius: 50%;
  filter: blur(120px);
  opacity: 0.55;
  transform: translate3d(0, 0, 0);
}

.blob.b1 {
  background: linear-gradient(135deg, #7c3aed, #3b82f6);
  left: -10%;
  top: -20%;
  animation: move1 12s infinite ease-in-out;
}

.blob.b2 {
  background: linear-gradient(135deg, #ef4444, #f97316);
  right: -15%;
  bottom: -5%;
  animation: move2 14s infinite ease-in-out;
}

.blob.b3 {
  background: linear-gradient(135deg, #06b6d4, #06b6d4);
  left: 20%;
  bottom: -25%;
  animation: move3 16s infinite ease-in-out;
}


.bottom {
  flex: 1;
  color: #ebebeb;
  text-align: center;
  display: flex;
  flex-direction: column;
}

.loginButton {
  font-size: 14px;
  cursor: pointer;
  background-color: #D94F1E;
  height: 40px;
  border: none;
  border-radius: 5px;
  color: #fff;
  margin-top: 40px;
  transition: all 0.2s;
}

.loginButton:hover {
  opacity: 0.9;
  font-size: 16px;
}

.verifyBlock {
  display: flex;
}

.bar {
  margin-bottom: 60px;
  margin-top: 60px;
  z-index: 99;
  width: 150px;
  background-color: rgba(26, 63, 97, 0.25);
  border-radius: 30px;
  margin-right: -50px;
  backdrop-filter: blur(10px);
}

.bar1 {
  margin-top: 90px;
  margin-bottom: 90px;
  backdrop-filter: blur(10px);
  z-index: 98;
  width: 325px;
  background-color: rgba(26, 63, 97, 0.25);
  border-radius: 30px;
  margin-right: -250px;
}

.main {
  position: absolute;
  z-index: 100;
  height: 80vh;
  width: 80vw;
  margin: 10vh 10vw;
  border: 1px solid rgba(26, 63, 97, 0.25);
  /* background-color: rgba(7, 46, 51, 0.5); */
  backdrop-filter: blur(20px);
  border-radius: 30px;
  display: flex;
}

.leftBlock {
  flex: 1;
}

.leftBlock img {

  width: calc(100% - 60px);
  height: calc(100% - 200px);
  object-fit: cover;
  margin: 30px;
  margin-top: 100px;
  margin-bottom: 100px;
  border-radius: 30px;

}

.rightBlock {
  margin-right: 30px;
  margin-bottom: 30px;
  margin-top: 30px;
  width: 300px;
  padding-left: 70px;
  padding-right: 70px;
  z-index: 100;
  border-radius: 30px;
  display: flex;
  flex-direction: column;
  background-color: rgba(26, 63, 97);
  border: 1px solid rgba(3, 15, 27, 0.25);
}

.label {
  line-height: 35px;
  font-size: 14px;
  color: #D94F1E;
  border-left: 3px solid #D94F1E;
  text-indent: 10px;
}

.tip {
  margin-left: 7px;
  font-size: 12px;
  color: #ff2e2e;
}

.input {

  height: 30px;
  font-size: 14px;
  text-indent: 10px;
  border: none;
  color: #fff;
  margin-bottom: 20px;
  border-left: 3px solid #D94F1E;
  border-bottom: 1px solid #D94F1E;
  background-color: rgb(20, 48, 75);
}

.svgBlock {
  height: 41px;
  background-color: red;
  margin-left: 20px;
  flex: 1;
}

.inputSmall {
  padding-top: 10px;
  height: 30px;
  font-size: 14px;
  text-indent: 10px;
  border: none;
  width: 120px;
  color: #fff;
  margin-bottom: 20px;
  border-left: 3px solid #D94F1E;
  border-bottom: 1px solid #D94F1E;
  background-color: rgb(20, 48, 75);
}

.title {
  font-size: 50px;
  font-weight: bold;
  color: #D94F1E;
  margin-bottom: 30px;
}
</style>