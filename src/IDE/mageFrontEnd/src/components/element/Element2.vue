<template>
    <div @click="store.count++">
        <p>{{ store.count }}</p>
    </div>
    <!-- <HomeCotent /> -->
    <!-- <LoadingCover />
  <RouterView v-slot="{ Component }">
    <KeepAlive>
      <component :is="Component" />
    </KeepAlive>
  </RouterView> -->
    <!-- <div class="main">
    <div class="leftBlock">

    </div>
    <div class="rightBlock">
      <div class="title">FinalCMS</div>

      <div class="label">用户名<span class="tip">请输入用户名</span></div>
      <input class="input" type="text" placeholder="请输入用户名">

      <div class="label">密码<span class="tip">请输入密码</span></div>
      <input class="input" type="text">

      <div class="label">验证码<span class="tip">请输入验证码</span></div>
      <div>
        <input type="text">
        <div>

        </div>
      </div>
      <button>登录</button>
      <div>@Ahead</div>
    </div>
  </div> -->
</template>
<script setup>
// 这里引入我们导出的 useStore；
import { useStore } from '@/store/index'
// 值得注意的是 useStore 是一个方法，调用之后会给我们返回一个对象。
//  这个时候，你就会发现，页面上就能正常显示我们在index.js 里面的 state 里面定义的 count 数据。

const store = useStore();

</script>
<style scoped>
.main {
  height: 100vh;
  display: flex;
}

.leftBlock {
  flex: 1;
}

.rightBlock {
  flex: 0.5;
  display: flex;
  flex-direction: column;
  background-color: #fff;
}

.label {
  line-height: 35px;
  margin-left: 30px;
  font-size: 15px;

}

.tip {
  margin-left: 10px;
}

.input {
  height: 40px;
  font-size: 14px;
  text-indent: 10px;
  border: #ddd solid 1px;
  border-radius: 5px;

  margin-left: 30px;
  margin-right: 30px;
}



.tip {
  font-size: 13px;

}

.title {
  font-size: 30px;
  font-weight: bold;
  color: #fff;
  margin: 30px;
}
</style>