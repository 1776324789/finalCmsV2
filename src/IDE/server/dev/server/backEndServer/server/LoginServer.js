import express from 'express'
import cors from 'cors'
import path from 'path'
import fs from 'fs'
import svgCaptcha from 'svg-captcha'
import crypto from 'crypto'
const LoginServer = (app, DB) => {
    const verifyCodeMap = new Map()
    // 获取验证码
    app.post('/getverifyCode', (req, res) => {
        const { connectId } = req.body

        if (!connectId) {
            return res.status(400).json({ message: 'connectId required' })
        }

        // 生成验证码
        const captcha = svgCaptcha.create({
            size: 4,
            ignoreChars: '0123456789oOiIl',
            noise: 5,
            width: 175,
            height: 40
        })

        // 保存验证码
        verifyCodeMap.set(connectId, captcha.text)

        // 1 分钟后自动删除
        setTimeout(() => {
            verifyCodeMap.delete(connectId)
        }, 60 * 1000)

        res.json({
            code: 200,
            svg: captcha.data
        })
    })

    app.post('/login', (req, res) => {
        const { connectId, username, password, verifyCode } = req.body

        if (!verifyCodeMap.has(connectId))
            return res.json({
                code: 400,
                message: "二维码已过期"
            })
        else if (verifyCodeMap.get(connectId).toString().toUpperCase() != verifyCode.toUpperCase())
            return res.json({
                code: 400,
                message: "二维码错误"
            })
        const user = DB.getUserByName(username)
        if (user == null)
            return res.json({
                code: 400,
                message: "用户不存在"
            })
        else if (user.password != stringToHash(password))
            return res.json({
                code: 400,
                message: "密码错误"
            })
        else {
            res.json({
                code: 200,
                token: DB.registerToken(user)
            })
        }


    })

    /**
     * 字符串转 hash（SHA-256）
     * @param {string} str 原始字符串
     * @returns {string} hash 字符串（hex）
     */
    function stringToHash(str) {
        return crypto
            .createHash('sha256')
            .update(str, 'utf8')
            .digest('hex')
    }
}

export default LoginServer