import express from 'express'
import cors from 'cors'
import LoginServer from './server/LoginServer.js'
const BackEndServer = (DB) => {
    const app = express()
    const PORT = 17514

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
        app.post(url, (req, res) => {
            try {
                const token = req.get("token")
                const user = DB.verifyToken(token)
                if (user == null) return res.json({ code: 400, message: "登录信息不存在或已过期，请重新登录" })
                handler(req, res, user)
            } catch (e) {
                console.log(e);
                res.json({ code: 400, message: e })
            }
        })
    }

    LoginServer(app, DB)
    return app
}

export default BackEndServer
