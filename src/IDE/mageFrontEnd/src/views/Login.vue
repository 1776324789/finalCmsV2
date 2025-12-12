<template>
    <img class="img" src="@/assets/imgs/background-1.jpg" alt="">
    <div class="main">

        <div class="bottomTitle">POWER BY AHEAD SOFT</div>
        <div class="mainBlock"></div>
        <div class="mainBlock1"></div>
        <div class="mainBlockContent">
            <div class="title1">WEB&nbsp;&nbsp;&nbsp;BUILDER</div>
            <div class="title">Login</div>
            <div class="line">
                <span class="icon-account-pin-circle-fill inputIcon"></span>
                <input class="input" placeholder="请输入用户名" type="text">
            </div>
            <div class="line">
                <span class="icon-lock-line inputIcon"></span>
                <input class="input" placeholder="请输入密码" type="text">
            </div>
            <div class="line">
                <span class="icon-android-line inputIcon"></span>
                <input class="input" placeholder="请输入验证码" type="text">
                <div class="svgBlock"></div>
            </div>
            <div class="tipBlock">
                <div class="tip"><span class="icon-error-warning-line" style="margin-right: 5px;"></span>请输入密码</div>
                <div style="flex:1;"></div>
            </div>
            <button class="loginButton" @click="login">登&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;录</button>
            <div class="copyright">@Ahead</div>
        </div>
        <div class="leftIcon1"></div>
        <div class="leftIcon2" style="display: flex;">
            FinalCMS&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;先锋网站内容管理平台
        </div>
        <div class="leftIcon3"></div>
        <div class="leftIcon4">
            先锋网站内容管理平台
        </div>
    </div>
</template>
<script setup>
import { useRouter } from 'vue-router';
const router = useRouter()
function login() {
    router.push("/index")
}

</script>
<style scoped>
.copyright {
    margin-top: 130px;
    text-align: center;
    color: #fff;
    font-weight: 300;
}

.loginButton {
    margin-left: 60px;
    margin-right: 60px;
    margin-top: 20px;
    height: 50px;
    border-radius: 25px;
    border: none;
    background-color: rgba(255, 137, 27, 0.494);
    font-size: 20px;
    font-weight: 300;
    color: #fff;
    cursor: pointer;
    position: relative;
}

.loginButton::after {
    transition: all 0.3s;
    content: "";
    width: 350px;
    filter: blur(10px);
    opacity: 0;
    border-radius: 20px;
    height: 30px;
    transform: translate(-50%, -50%);
    left: 50%;
    top: 50%;
    background-color: #fff;
    position: absolute;
}

.loginButton:hover::after {
    opacity: 0.25;
}

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
    font-weight: 300;
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
    font-weight: 300;
}

.title1 {
    margin-left: 60px;
    margin-top: 50px;
    font-size: 25px;
    font-weight: 100;
}

.input {
    font-size: 18px;
    font-weight: 300;
    color: #000;
    flex: 1;
    text-indent: 60px;
    height: 50px;
    border-radius: 25px;
    border: none;
    background-color: rgba(255, 255, 255, 0.35);
}

.input:hover {
    background-color: rgba(255, 255, 255, 0.45);
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
    font-size: 50px;
    font-weight: 100;
    margin-left: 60px;
    margin-top: 50px;
    margin-bottom: 30px;
}

.main {
    scale: 0.9;
    user-select: none;
    position: relative;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
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
    box-shadow: 5px 5px 15px rgba(65, 37, 10, 0.753);
    backdrop-filter: blur(5px);
    position: fixed;
    background-color: #a15e20cc;
    left: calc((100vh - 800px)/2 * (100vw / 100vh));
    top: calc((100vh - 800px)/2);
    border-radius: 50%;
    width: 75px;
    height: 75px;
}

.leftIcon2 {
    box-shadow: 5px 5px 15px rgba(65, 37, 10, 0.753);
    position: fixed;
    backdrop-filter: blur(5px);
    background-color: #e98930ab;
    left: calc((100vh - 800px)/2 * (100vw / 100vh) + 100px);
    top: calc((100vh - 800px)/2);
    border-radius: 55px;
    width: 500px;
    height: 55px;
    margin-top: 10px;
    text-indent: 32.5px;
    line-height: 55px;
    font-size: 20px;
    font-weight: 300;
    color: #fff;
}

.leftIcon3 {
    box-shadow: 5px 5px 15px #703f12c0;
    backdrop-filter: blur(5px);
    position: fixed;
    background-color: #a55d1ac0;
    left: calc((100vh - 800px)/2 * (100vw / 100vh));
    top: calc((100vh - 800px)/2 + 150px);
    border-radius: 50%;
    width: 75px;
    height: 75px;
    display: none;
}

.leftIcon4 {
    box-shadow: 5px 5px 15px #703f12c0;
    backdrop-filter: blur(5px);
    position: fixed;
    background-color: #f3e3c5b4;
    left: calc((100vh - 800px)/2 * (100vw / 100vh) + 100px);
    top: calc((100vh - 800px)/2 + 150px);
    border-radius: 55px;
    width: 300px;
    height: 75px;
    text-indent: 32.5px;
    line-height: 75px;
    color: #a55d1a;
    font-size: 20px;
    font-weight: 300;
    display: none;
}





.mainBlock {
    z-index: 100;
    position: fixed;
    height: 800px;
    width: 500px;
    right: calc((100vh - 800px)/2 * (100vw / 100vh));
    top: calc((100vh - 800px)/2);
    border-radius: 50px;
    background-color: rgba(199, 173, 153, 0.75);
    backdrop-filter: blur(10px);
    box-shadow: 5px 5px 35px rgba(109, 93, 81, 0.75);
}

.mainBlockContent {
    display: flex;
    flex-direction: column;
    z-index: 102;
    position: fixed;
    height: 800px;
    width: 500px;
    right: calc((100vh - 800px)/2 * (100vw / 100vh));
    top: calc((100vh - 800px)/2);
}

.mainBlock1 {
    z-index: 101;
    position: fixed;
    height: 640px;
    width: 400px;
    right: calc(((100vh - 640px)/2 * (100vw / 100vh)) * 0.8 - 50px);
    top: calc((100vh - 640px)/2);
    border-radius: 50px;
    background-color: rgba(255, 255, 255, 0.25);
    filter: blur(50px);
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
    position: fixed;
    left: calc((100vh - 800px)/2 * (100vw / 100vh));
    bottom: calc((100vh - 800px)/2);
    font-size: 18px;
    color: #fff;
}
</style>