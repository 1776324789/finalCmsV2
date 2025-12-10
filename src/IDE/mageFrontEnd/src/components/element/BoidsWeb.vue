<template>
    <canvas ref="canvasRef" class="canvas"></canvas>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const numBoids = 50
const maxSpeed = 0.3
const maxForce = 0.5
const perceptionRadius = 20

const canvasRef = ref(null)
let ctx
let boids = []
let animationId

class Boid {
    constructor(x, y) {
        this.position = { x, y }
        const angle = Math.random() * Math.PI * 2
        this.velocity = { x: Math.cos(angle), y: Math.sin(angle) }
        this.acceleration = { x: 0, y: 0 }
        this.radius = Math.random() * 70 + 10 // 随机半径 4~10
        this.color = `rgba(7, 46, 51, 0.15)` // 半透明天蓝色
    }

    update() {
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
        this.velocity.x += this.acceleration.x
        this.velocity.y += this.acceleration.y

        const speed = Math.hypot(this.velocity.x, this.velocity.y)
        if (speed > maxSpeed) {
            this.velocity.x = (this.velocity.x / speed) * maxSpeed
            this.velocity.y = (this.velocity.y / speed) * maxSpeed
        }

        this.acceleration.x = 0
        this.acceleration.y = 0
    }

    edges(width, height) {
        const margin = 20 // 离边界多少像素开始掉头
        if (this.position.x < margin) this.acceleration.x += 0.1
        else if (this.position.x > width - margin) this.acceleration.x -= 0.1

        if (this.position.y < margin) this.acceleration.y += 0.1
        else if (this.position.y > height - margin) this.acceleration.y -= 0.1
    }

    align(boids) {
        let steering = { x: 0, y: 0 }
        let total = 0
        for (const other of boids) {
            const d = Math.hypot(
                other.position.x - this.position.x,
                other.position.y - this.position.y
            )
            if (other !== this && d < perceptionRadius) {
                steering.x += other.velocity.x
                steering.y += other.velocity.y
                total++
            }
        }
        if (total > 0) {
            steering.x /= total
            steering.y /= total
            const mag = Math.hypot(steering.x, steering.y)
            steering.x = (steering.x / mag) * maxSpeed
            steering.y = (steering.y / mag) * maxSpeed
            steering.x -= this.velocity.x
            steering.y -= this.velocity.y
            const steerMag = Math.hypot(steering.x, steering.y)
            if (steerMag > maxForce) {
                steering.x = (steering.x / steerMag) * maxForce
                steering.y = (steering.y / steerMag) * maxForce
            }
        }
        return steering
    }

    cohesion(boids) {
        let steering = { x: 0, y: 0 }
        let total = 0
        for (const other of boids) {
            const d = Math.hypot(
                other.position.x - this.position.x,
                other.position.y - this.position.y
            )
            if (other !== this && d < perceptionRadius) {
                steering.x += other.position.x
                steering.y += other.position.y
                total++
            }
        }
        if (total > 0) {
            steering.x /= total
            steering.y /= total
            steering.x -= this.position.x
            steering.y -= this.position.y
            const mag = Math.hypot(steering.x, steering.y)
            steering.x = (steering.x / mag) * maxSpeed
            steering.y = (steering.y / mag) * maxSpeed
            steering.x -= this.velocity.x
            steering.y -= this.velocity.y
            const steerMag = Math.hypot(steering.x, steering.y)
            if (steerMag > maxForce) {
                steering.x = (steering.x / steerMag) * maxForce
                steering.y = (steering.y / steerMag) * maxForce
            }
        }
        return steering
    }

    separation(boids) {
        let steering = { x: 0, y: 0 }
        let total = 0
        for (const other of boids) {
            const d = Math.hypot(
                other.position.x - this.position.x,
                other.position.y - this.position.y
            )
            if (other !== this && d < perceptionRadius / 2) {
                steering.x += this.position.x - other.position.x
                steering.y += this.position.y - other.position.y
                total++
            }
        }
        if (total > 0) {
            steering.x /= total
            steering.y /= total
            const mag = Math.hypot(steering.x, steering.y)
            if (mag > 0) {
                steering.x = (steering.x / mag) * maxSpeed
                steering.y = (steering.y / mag) * maxSpeed
                steering.x -= this.velocity.x
                steering.y -= this.velocity.y
                const steerMag = Math.hypot(steering.x, steering.y)
                if (steerMag > maxForce) {
                    steering.x = (steering.x / steerMag) * maxForce
                    steering.y = (steering.y / steerMag) * maxForce
                }
            }
        }
        return steering
    }

    flock(boids) {
        const alignment = this.align(boids)
        const cohesion = this.cohesion(boids)
        const separation = this.separation(boids)

        this.acceleration.x += alignment.x * 1.0
        this.acceleration.y += alignment.y * 1.0
        this.acceleration.x += cohesion.x * 0.3   // 从 0.8 降低到 0.3
        this.acceleration.y += cohesion.y * 0.3
        this.acceleration.x += separation.x * 2.2 // 从 1.5 提高到 2.2
        this.acceleration.y += separation.y * 2.2
    }

    draw(ctx) {
        ctx.save()
        ctx.beginPath()
        ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
        ctx.fillStyle = this.color
        ctx.shadowBlur = 5 // 模糊半径
        ctx.shadowColor = this.color
        ctx.fill()
        ctx.restore()
    }
}

onMounted(() => {
    canvasRef.value.style.width = document.body.clientWidth + "px"
    canvasRef.value.style.height = window.innerHeight + "px"
    const canvas = canvasRef.value
    const dpr = window.devicePixelRatio || 1

    // 获取显示尺寸（CSS 控制的大小）
    const rect = canvas.getBoundingClientRect()

    // 设置画布内部像素尺寸
    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr

    ctx = canvas.getContext('2d')
    ctx.scale(dpr, dpr) // 缩放绘制，使 1px 对应 CSS 像素

    // 创建boids
    boids = []
    for (let i = 0; i < numBoids; i++) {
        boids.push(new Boid(Math.random() * rect.width, Math.random() * rect.height))
    }

    function animate() {
        if (document.body.clientWidth < 1250) {
            return
        }
        ctx.clearRect(0, 0, rect.width, rect.height)
        for (const boid of boids) {
            boid.edges(rect.width, rect.height)
            boid.flock(boids)
            boid.update()
            boid.draw(ctx)
        }
        animationId = requestAnimationFrame(animate)
    }

    animate()
})



</script>

<style scoped>
.canvas {
    filter: blur(5px);
    position: fixed;
    z-index: 0;
    left: 0;
    top: 0;
    width: 100vw;
    height: 100vh;
}
</style>
