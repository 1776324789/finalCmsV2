<template>
    <canvas ref="canvasRef" class="canvas-bg"></canvas>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";

class Dot {
    constructor(canvasWidth, canvasHeight) {
        this.deep = Math.random();
        this.x = canvasWidth * Math.random() * (Math.random() > 0.5 ? 1.5 : -1);
        this.y = canvasHeight * Math.random() * (Math.random() > 0.5 ? 1.5 : -1);

        this.size = this.deep * 150;
        this.opacity = Math.random();

        // 用于定时改变状态
        this.nextChange = Date.now() + 1000 + Math.random() * 1000;
    }

    update(canvasWidth, canvasHeight) {
        // 定时进行随机移动 + 随机透明度
        if (Date.now() > this.nextChange) {
            this.x -= 5 * Math.random() * (Math.random() > 0.5 ? 1 : -1) * this.deep;
            this.y -= 5 * Math.random() * (Math.random() > 0.5 ? 1 : -1) * this.deep;
            this.opacity = Math.random();
            this.nextChange = Date.now() + 1000 + Math.random() * 1000;
        }

        // 不出边界就渲染，出了就跳过
        return (
            this.x > -this.size &&
            this.x < canvasWidth + this.size &&
            this.y > -this.size &&
            this.y < canvasHeight + this.size
        );
    }

    moveBy(dx, dy) {
        this.x -= dx * this.deep;
        this.y -= dy * this.deep;
    }

    draw(ctx) {
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = "rgba(26,63,97,0.25)";
        ctx.fillRect(this.x, this.y, this.size, this.size);
    }
}

// ------------------------ 组件逻辑 ------------------------

const canvasRef = ref(null);
let ctx = null;
let dots = [];
let animId = null;

const dotCount = 500;

onMounted(() => {
    const canvas = canvasRef.value;
    ctx = canvas.getContext("2d");

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // 初始化粒子
    dots = [];
    for (let i = 0; i < dotCount; i++) {
        dots.push(new Dot(canvas.width, canvas.height));
    }

    // 鼠标移动
    window.addEventListener("mousemove", handleMouseMove);

    animate();
});

onBeforeUnmount(() => {
    cancelAnimationFrame(animId);
    window.removeEventListener("mousemove", handleMouseMove);
    window.removeEventListener("resize", resizeCanvas);
});

function resizeCanvas() {
    const canvas = canvasRef.value;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

function handleMouseMove(e) {
    dots.forEach((dot) => {
        dot.moveBy(e.movementX / 5, e.movementY / 5);
    });
}

function animate() {
    animId = requestAnimationFrame(animate);

    const canvas = canvasRef.value;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    dots.forEach((dot) => {
        if (dot.update(canvas.width, canvas.height)) {
            dot.draw(ctx);
        }
    });
}
</script>

<style scoped>
.canvas-bg {
    width: 100vw;
    height: 100vh;
    display: block;
    position: absolute;
    top: 0;
    left: 0;
}
</style>
