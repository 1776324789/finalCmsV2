import express from 'express'
import cors from 'cors'
import SystemController from '../../DataBase/SystemController.js'
import LoginServer from './server/LoginServer.js'
import WebsiteListServer from './server/WebsiteListServer.js'
import FileServer from './server/FileServer.js'
import WebsiteNodeServer from './server/WebsiteNodeServer.js'
import UserManageServer from './server/UserManageServer.js'
import WebsiteManageServer from './server/WebsiteManageServer.js'
import SystemConfig from '../../DataBase/SystemConfig.js'

const BackEndServer = () => {
    const app = express()
    const PORT = SystemConfig.backPort

    app.use(cors())
    app.use(express.json())
    app.use(express.urlencoded({ extended: true }))

    app.get('/health', (req, res) => {
        res.json({ status: '200' })
    })

    app.listen(PORT, () => {
        console.log(`CMS backend running at http://localhost:${PORT}`)
    })

    // POST（带 token 校验）
    app.tokenPost = (url, handler) => {
        app.post(url, async (req, res) => {
            try {
                const token = req.get("token")
                const user = SystemController.verifyToken(token)
                if (user == null) return res.json({ code: 400, message: "登录信息不存在或已过期，请重新登录" })
                await handler(req, res, user)
            } catch (e) {
                console.log(e);
                res.json({ code: 400, message: e })
            }
        })
    }

    // 文件上传（带 token 校验）
    app.tokenFileUpload = (url, upload, handler) => {
        app.post(url, upload, async (req, res) => {
            try {
                const token = req.get("token")
                const user = SystemController.verifyToken(token)
                if (user == null) return res.json({ code: 400, message: "登录信息不存在或已过期，请重新登录" })
                await handler(req, res, user)
            } catch (e) {
                console.log(e);
                res.json({ code: 400, message: e })
            }
        })
    }

    LoginServer(app)
    WebsiteListServer(app)
    FileServer(app)
    WebsiteNodeServer(app)
    UserManageServer(app)
    WebsiteManageServer(app)
    return app
}

export default BackEndServer()
