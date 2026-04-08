/**
 * 前端静态资源服务（最终稳定版）
 */

import express from 'express'
import http from 'http'
import path from 'path'
import fs from 'fs'
import SystemConfig from '../../DataBase/SystemConfig.js'

const FrontServer = () => {
    const PORT = SystemConfig.frontPort
    const app = express()
    const server = http.createServer(app)

    // =============================
    // 📁 根目录
    // =============================
    const FRONT_ROOT = path.resolve('Front')

    // =============================
    // ✅ 1. 静态资源托管（必须最前）
    // =============================

    // 上传目录（解决你访问不了图片的问题）
    app.use('/upload', express.static(path.join(FRONT_ROOT, 'upload')))

    // 可选资源目录
    app.use('/assets', express.static(path.join(FRONT_ROOT, 'assets')))

    // =============================
    // ✅ 2. 读取站点目录
    // =============================
    let webDirs = []

    if (fs.existsSync(FRONT_ROOT)) {
        webDirs = fs
            .readdirSync(FRONT_ROOT)
            .filter(item => {
                const fullPath = path.join(FRONT_ROOT, item)
                return item !== 'ROOT' && fs.statSync(fullPath).isDirectory()
            })
    }

    // =============================
    // ✅ 3. 首页
    // =============================
    app.get('/', (req, res) => {
        const filePath = path.join(FRONT_ROOT, 'ROOT', 'index.html')
        sendFileSafe(res, filePath)
    })

    // =============================
    // ✅ 4. 通用 fallback（替代 *，避免报错）
    // =============================
    app.use((req, res) => {
        try {
            const filePath = resolvePagePath(req.path, webDirs)
            sendFileSafe(res, filePath)
        } catch (err) {
            console.error(err)
            res.status(500).end('Server Error')
        }
    })

    // =============================
    // ✅ 5. 启动服务
    // =============================
    server.listen(PORT, () => {
        console.log(`前端服务已启动：http://localhost:${PORT}`)
    })

    return app
}

export default FrontServer()

/**
 * =============================
 * 📦 工具函数
 * =============================
 */

/**
 * URL → 页面路径解析
 */
function resolvePagePath(urlPath, webDirs) {
    const cleanPath = urlPath.split('?')[0]
    let parts = cleanPath.split('/').filter(Boolean)

    // 默认站点
    let site = 'ROOT'

    // 判断是否子站点
    if (parts.length > 0 && webDirs.includes(parts[0])) {
        site = parts.shift()
    }

    // 没路径 → index.html
    if (parts.length === 0) {
        parts = ['index.html']
    }

    let last = parts[parts.length - 1]

    // 没扩展名 → 自动补 .html
    if (!last.includes('.')) {
        last += '.html'
        parts[parts.length - 1] = last
    }

    const filePath = path.join('Front', site, ...parts)

    // 404 fallback（仅 html）
    if (last.endsWith('.html') && !fs.existsSync(filePath)) {
        const fallback = path.join('Front', site, '404.html')
        if (fs.existsSync(fallback)) {
            return fallback
        }
    }

    return filePath
}

/**
 * 安全发送文件
 */
function sendFileSafe(res, filePath) {
    if (!fs.existsSync(filePath)) {
        return res.status(404).end('Not Found')
    }

    const ext = path.extname(filePath).toLowerCase()
    res.type(getMimeType(ext))
    res.sendFile(path.resolve(filePath))
}

/**
 * MIME 类型
 */
function getMimeType(ext) {
    const map = {
        '.html': 'text/html',
        '.js': 'application/javascript',
        '.css': 'text/css',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.gif': 'image/gif',
        '.webp': 'image/webp',
        '.svg': 'image/svg+xml',
        '.ico': 'image/x-icon',
        '.mp4': 'video/mp4',
        '.mp3': 'audio/mpeg',
        '.woff': 'font/woff',
        '.woff2': 'font/woff2',
        '.ttf': 'font/ttf'
    }

    return map[ext] || 'application/octet-stream'
}