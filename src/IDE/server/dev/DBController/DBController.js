/**
 * DBController
 * - 用户索引
 * - token 管理
 * - 轻量级内存鉴权
 */

import DB from './db.json' with { type: 'json' }
import crypto from 'crypto'

const DBController = () => {

    /** ---------------- 用户索引 ---------------- */
    const userData = {}
    DB.user.forEach(user => {
        userData[user.username] = user
    })

    function getUserByName(username) {
        return userData[username]
    }

    /** ---------------- token 池 ---------------- */
    const tokenPool = {}

    const TOKEN_EXPIRE_TIME = 2 * 60 * 60 * 1000   // 2 小时
    const TOKEN_IDLE_TIME = 15 * 60 * 1000       // 15 分钟
    const INSPECT_INTERVAL = 30 * 1000            // 30 秒

    /** ---------------- token 巡检 ---------------- */
    setInterval(() => {
        const now = Date.now()

        Object.keys(tokenPool).forEach(token => {
            const info = tokenPool[token]

            // 注册时间超过 2 小时
            if (now - info.registerTime > TOKEN_EXPIRE_TIME) {
                delete tokenPool[token]
                return
            }

            // 15 分钟未激活
            if (now - info.activateTime > TOKEN_IDLE_TIME) {
                delete tokenPool[token]
            }
        })
    }, INSPECT_INTERVAL)

    /** ---------------- 注册 token ---------------- */
    function registerToken(user) {

        // 如果该用户已有 token → 覆盖
        Object.keys(tokenPool).forEach(token => {
            if (tokenPool[token].user.username === user.username) {
                delete tokenPool[token]
            }
        })

        const token = stringToHash(
            Date.now().toString(36) + JSON.stringify(user)
        )

        tokenPool[token] = {
            user,
            registerTime: Date.now(),
            activateTime: Date.now()
        }

        return token
    }

    /** ---------------- 校验 token ---------------- */
    function verifyToken(token) {
        const info = tokenPool[token]
        if (!info) return null

        // 刷新活跃时间
        info.activateTime = Date.now()
        return info.user
    }

    /** ---------------- hash ---------------- */
    function stringToHash(str) {
        return crypto
            .createHash('sha256')
            .update(str, 'utf8')
            .digest('hex')
    }

    return {
        getUserByName,
        registerToken,
        verifyToken
    }
}

export default DBController
