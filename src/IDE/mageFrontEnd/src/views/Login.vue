<template>
  <div class="main" :style="`pointer-events:${showLogin ? 'auto' : 'none'};`">
    <div class="bottomTitle" v-bind:class="{ outBottom: !showLogin }">POWERED BY AHEAD SOFT</div>
    <div class="rightBlock" v-bind:class="{ outRight: !showLogin }">
      <!-- <GlassSurface :displace="10" className="mainBlockContent" :width="500" :height="800" :Saturation="3"
        :border-radius="55"> -->
      <div class="mainBlockContent">
        <div class="title1">WEB&nbsp;&nbsp;&nbsp;BUILDER</div>
        <div class="title">Login</div>
        <div class="line">
          <span class="icon-account-pin-circle-fill inputIcon"></span>
          <input class="input" placeholder="请输入用户名" type="text" />
        </div>
        <div class="line">
          <span class="icon-lock-line inputIcon"></span>
          <input class="input" placeholder="请输入密码" type="text" />
        </div>
        <div class="line">
          <span class="icon-android-line inputIcon"></span>
          <input class="input" placeholder="请输入验证码" type="text" />
          <div class="svgBlock"></div>
        </div>
        <div class="tipBlock">
          <div class="tip">
            <span class="icon-error-warning-line" style="margin-right: 5px"></span>请输入密码
          </div>
          <div style="flex: 1"></div>
        </div>
        <button class="loginButton" @click="login">
          <div class="font">
            登&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;录
          </div>

        </button>
        <div class="copyright">@Ahead</div>
        <!-- </GlassSurface> -->
      </div>
    </div>
    <!-- <div class="leftBlock" v-bind:class="{ outLeft: showLogin }"> -->
    <!-- <GlassSurface :width="75" :height="75" className="leftIcon1" :Saturation="0" :border-radius="55">
        AHEAD
      </GlassSurface> -->
    <div class="leftIcon1" v-bind:class="{ outLeft: !showLogin }">AHEAD</div>

    <!-- <GlassSurface :width="500" className="leftIcon2" :height="55" :Saturation="0" :border-radius="55">
        FinalCMS&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;先锋网站内容管理平台
      </GlassSurface> -->
    <div class="leftIcon2" v-bind:class="{ outLeft: !showLogin }">
      FinalCMS&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;先锋网站内容管理平台
    </div>
  </div>
  <!-- </div> -->
</template>
<script setup>
import { ref, watch } from 'vue'
const showLogin = ref(true)
const emit = defineEmits(['login'])
const props = defineProps({ modelValue: Boolean })

watch(
  () => props.modelValue,
  (val) => {
    if (val) {
      showLogin.value = true
    } else {
      showLogin.value = false
    }
  },
  { immediate: true } // 👈 初始化时也同步一次状态
)


function login() {
  emit('login')
}

</script>
<style scoped>
.copyright {
  margin-top: 130px;
  text-align: center;
  color: #fff;
  font-weight: 350;
}

.loginButton {
  position: relative;
  transition: all 0.3s;
  margin-left: 60px;
  margin-right: 60px;
  margin-top: 20px;
  height: 50px;
  border: 1px solid #666;
  border-radius: 25px;
  background-color: #000;
  font-size: 20px;
  font-weight: 350;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.loginButton .font {
  z-index: 10;
  transition: all 0.3s;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  position: absolute;
  color: #fff;

}

.loginButton::before {
  opacity: 0;
  transition: all 0.3s;
  border-radius: 50px;
  content: "";
  width: 0;
  height: 100%;
  background-color: #fff;
  left: 0;
  top: 0;
  position: absolute;
}

.loginButton::after {
  opacity: 0;
  transition: all 0.3s;
  border-radius: 50px;
  content: "";
  width: 0;
  height: 100%;
  background-color: #fff;
  right: 0;
  top: 0;
  position: absolute;
}

.loginButton:hover {
  border: 1px solid #fff;
}

.loginButton:hover .font {
  color: #000;
}

.loginButton:hover::before {
  opacity: 1;
  width: calc(50% + 50px);
}

.loginButton:hover::after {
  opacity: 1;
  width: calc(50% + 50px);
}

/* 
.loginButton::after {
  transition: all 0.3s;
  content: "";
  width: 350px;
  filter: blur(5px);
  opacity: 0;
  border-radius: 20px;
  height: 30px;
  transform: translate(-50%, -50%);
  left: 50%;
  top: 50%;
  background-color: #ffac69;
  position: absolute;
}

.loginButton:hover::after {
  opacity: 0.25;
} */

.tipBlock {
  display: flex;
  margin-left: 60px;
  margin-top: 30px;
  margin-bottom: 10px;
}

.tip {
  padding: 5px;
  height: 20px;
  border-radius: 15px;
  background-color: rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(10px);
  font-size: 14px;
  line-height: 20px;
  display: flex;
  font-weight: 350;
  padding-left: 15px;
  padding-right: 25px;
  color: #ec1a1a;
}

.svgBlock {
  width: 175px;
  height: 40px;
  background-color: #fff;
  margin-top: 5px;
  border-radius: 20px;
  margin-left: -180px;
  margin-right: 5px;
}

.label {
  margin-top: 25px;
  margin-left: 60px;
  font-size: 18px;
  font-weight: 350;
}

.title1 {
  color: #fff;
  margin-left: 60px;
  margin-top: 50px;
  font-size: 25px;
  font-weight: 100;
}

.input {
  transition: all 0.3s;
  font-size: 17px;
  font-weight: 350;
  color: #fff;
  flex: 1;
  text-indent: 60px;
  height: 48px;
  border-radius: 25px;
  border: 1px solid #ddd;
  background-color: rgba(0, 0, 0, 0);
}

.input::placeholder {
  color: #b6b6b6;
}

.input:hover {
  background-color: rgba(255, 255, 255, 0.15);
}

.line {
  display: flex;
  margin-left: 60px;
  margin-right: 60px;
  margin-top: 10px;
}

.inputIcon {
  z-index: 100;
  background-color: #fff;
  height: 40px;
  width: 40px;
  border-radius: 50%;
  text-align: center;
  line-height: 40px;
  font-size: 20px;
  margin-top: 5px;
  margin-right: -45px;
  margin-left: 5px;
  display: block;
}

.title {
  color: #fff;
  font-size: 50px;
  font-weight: 100;
  margin-left: 60px;
  margin-top: 50px;
  margin-bottom: 30px;
}

.main {
  z-index: 100;
  transition: 0.5s all;
  user-select: none;
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: none;
}

.line1 {
  width: 3000px;
  height: 200px;
  left: -1910px;
  z-index: 10;
  filter: blur(10px);
  background-color: rgba(255, 255, 255, 0.25);
  position: fixed;
  transform: rotate(45deg);
}

.line2 {
  width: 3000px;
  height: 50px;
  left: -1910px;
  z-index: 10;
  filter: blur(10px);
  background-color: rgba(255, 255, 255, 0.25);
  position: fixed;
  transform: rotate(45deg);
}

.line3 {
  width: 3000px;
  height: 400px;
  left: -10px;
  z-index: 10;
  filter: blur(10px);
  background-color: rgba(255, 255, 255, 0.25);
  position: fixed;
  transform: rotate(45deg);
}

.leftIcon1 {
  transition: 0.5s all;
  backdrop-filter: blur(15px);
  backdrop-filter: blur(5px);
  position: absolute;
  left: calc((100vh - 800px) / 2 * (100vw / 100vh));
  top: calc((100vh - 800px) / 2);
  border-radius: 50%;
  line-height: 75px;
  text-align: center;
  color: #fff;
  font-weight: 900;
  font-size: 13px;
  width: 75px;
  height: 75px;
  border: 1px solid #fff;
}

.leftIcon4 {
  border-radius: 50%;
  width: 75px;
  height: 75px;
}

.leftIcon2 {
  backdrop-filter: blur(15px);
  color: #fff;
  transition: 0.5s all;
  position: absolute;
  left: calc((100vh - 800px) / 2 * (100vw / 100vh) + 100px);
  top: calc((100vh - 800px) / 2);
  border-radius: 55px;
  width: 500px;
  height: 55px;
  margin-top: 10px;
  text-indent: 32.5px;
  line-height: 55px;
  font-size: 20px;
  font-weight: 350;
  border: 1px solid #fff;
}


.leftIcon3 {
  transition: 0.5s all;
}

.leftIcon4 {
  box-shadow: 5px 5px 15px #703f12c0;
  backdrop-filter: blur(5px);
  position: fixed;
  background-color: #f3e3c5b4;
  left: calc((100vh - 800px) / 2 * (100vw / 100vh) + 100px);
  top: calc((100vh - 800px) / 2 + 150px);
  border-radius: 55px;
  width: 300px;
  height: 75px;
  text-indent: 32.5px;
  line-height: 75px;
  color: #a55d1a;
  font-size: 20px;
  font-weight: 350;
  display: none;
}

.mainBlock {
  z-index: 100;
  position: fixed;
  height: 800px;
  width: 500px;
  right: calc((100vh - 800px) / 2 * (100vw / 100vh));
  top: calc((100vh - 800px) / 2);
  border-radius: 50px;
  background-color: #ffffff2f;
  backdrop-filter: blur(30px);
  /* animation: 20s movement linear infinite; */
}

@keyframes movement {

  0%,
  100% {
    box-shadow: 5px 5px 5px rgba(255, 255, 255, 0.75);
  }

  50% {
    box-shadow: 5px 5px 50px rgba(255, 255, 255, 0.75);
  }
}

.mainBlockContent {
  transition: 0.5s all;
  display: flex;
  flex-direction: column;
  z-index: 102;
  position: absolute;
  height: 800px;
  width: 500px;
  backdrop-filter: blur(15px);
  right: calc((100vh - 800px) / 2 * (100vw / 100vh));
  top: calc((100vh - 800px) / 2);
  border: 1px solid #fff;
  border-radius: 50px;
}

.mainBlock1 {
  z-index: 101;
  position: fixed;
  height: 640px;
  width: 400px;
  right: calc(((100vh - 640px) / 2 * (100vw / 100vh)) * 0.8 - 50px);
  top: calc((100vh - 640px) / 2);
  border-radius: 50px;
  background-color: rgba(255, 255, 255, 0.25);
  filter: blur(100px);
}

img {
  position: fixed;
  left: 0px;
  top: 0px;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 0;
  scale: 1.1;
}

.bottomTitle {
  transition: 0.5s all;
  position: fixed;
  left: calc((100vh - 800px) / 2 * (100vw / 100vh));
  bottom: calc((100vh - 800px) / 2);
  font-size: 18px;
  color: #fff;
}

.rightBlock {
  transition: 0.5s all;
  position: fixed;
  right: 0;
}

.leftBlock {
  position: fixed;
  left: 0;
}

.outLeft {

  top: -300px;
}

.outBottom {

  bottom: -300px;
}

.outRight {

  right: -40vw;
}
</style>
