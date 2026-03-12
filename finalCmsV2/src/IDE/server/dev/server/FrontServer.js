/**
 * 映射前端资源文件
 * 目标路径: Front
 */

import express from 'express'
import http from 'http'
import path from 'path'
import fs from 'fs'

const FrontServer = (DB) => {
    const PORT = 20829
    const app = express()
    const server = http.createServer(app)

    const FRONT_ROOT = path.resolve('Front')

    // 初始化网站列表
    let webDirs = []
    if (fs.existsSync(FRONT_ROOT)) {
        webDirs = fs
            .readdirSync(FRONT_ROOT)
            .filter(item => item !== 'ROOT')
    }

    // 首页（必须在正则路由前）
    app.get('/', (req, res) => {
        const filePath = path.resolve('Front/ROOT/index.html')
        res.type('html')
        res.sendFile(filePath)
    })

    // 匹配除 "/" 外所有路径
    app.get(/^\/.+/, (req, res) => {
        const filePath = initUrl(req.url, webDirs)
        const ext = path.extname(filePath).toLowerCase()

        res.type(ext || 'html')

        if (fs.existsSync(filePath)) {
            res.sendFile(path.resolve(filePath))
        } else {
            res.status(404).end()
        }
    })

    server.listen(PORT, () => {
        console.log(`前端页面已启动：http://localhost:${PORT}`)
    })

    return app
}

/**
 * URL → 文件路径解析
 */
function initUrl(url, webDirs) {
    let urlPath = url.split('/').filter(Boolean)

    // /site → /site/index.html
    if (webDirs.includes(urlPath[urlPath.length - 1])) {
        urlPath.push('index.html')
    }

    // 自动补 .html
    if (!urlPath[urlPath.length - 1].includes('.')) {
        urlPath[urlPath.length - 1] += '.html'
    }

    // 是否子站点
    if (!webDirs.includes(urlPath[0])) {
        urlPath.unshift('ROOT')
    }

    // 定位 Front
    urlPath.unshift('Front')

    const fullPath = path.join(...urlPath)

    // 404 fallback
    if (fullPath.endsWith('.html') && !fs.existsSync(fullPath)) {
        return path.join('Front', urlPath[1], '404.html')
    }

    return fullPath
}

export default FrontServer
