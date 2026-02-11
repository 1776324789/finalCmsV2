import express from 'express'
import cors from 'cors'
import path from 'path'
import fs from 'fs'

module.exports.backEndServer = () => {
    const app = express()
    const PORT = 5174

    // 基础中间件
    app.use(cors())                  // 允许跨域（axios 必须）
    app.use(express.json())          // JSON body
    app.use(express.urlencoded({ extended: true }))

    // 健康检查
    app.get('/health', (req, res) => {
        res.json({ status: '200' })
    })

    app.get('/api/list/', (req, res) => {
        res.json(data)
    })


    app.get('/api/list/', (req, res) => {
        res.json(data)
    })



    app.listen(PORT, () => {
        console.log(`CMS backend running at http://localhost:${PORT}`)
    })

    return app
}

// 直接启动
backEndServer()
