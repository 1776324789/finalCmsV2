<template>
    <img class="img" src="@/assets/imgs/background-1.jpg" alt=""></img>
    <div class="mainBlock">
        <div class="contentBlock">
            <div class="title">站点列表</div>
            <div class="webBlock">
                <div class="web">
                    <div class="webTitle">校友网</div>
                </div>
                <div class="web">
                    <div class="webTitle">招生网</div>
                </div>
                <div class="web">
                    <div class="webTitle">经济管理学院</div>
                </div>
                <div class="web">
                    <div class="webTitle">校务处</div>
                </div>
            </div>
        </div>
    </div>
</template>
<style scoped>
.webTitle {
    font-size: 20px;
    font-weight: 300;
    color: #9e8673;
}

.webBlock {
    flex: 1;
    display: flex;
    flex-wrap: wrap;
    margin-top: 25px;
    gap: 25px;
}

.web {
    cursor: pointer;
    height: 200px;
    width: calc((100% / 5) - 50px);
    border-radius: 25px;
    padding: 25px;
    background-color: #fff3e2;
}

.title {
    font-size: 30px;
    font-weight: 300;
    height: 50px;
    width: 300px;
    color: #573214;
    border-radius: 25px;
    line-height: 50px;
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

.mainBlock {
    z-index: 100;
    width: 100vw;
    height: 100vh;
    display: flex;
}

.contentBlock {
    background-color: #ffffff8c;
    backdrop-filter: blur(25px);
    box-shadow: 5px 5px 25px rgba(0, 0, 0, 0.5);
    flex: 1;
    margin: 150px;
    border-radius: 50px;
    padding: 50px;
    display: flex;
    flex-direction: column;
}
</style>