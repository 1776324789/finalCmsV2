import svgCaptcha from 'svg-captcha'
import crypto from 'crypto'
import SystemController from '../../../DataBase/SystemController.js'

const LoginServer = (app) => {
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
            ignoreChars: '0123456789oOiIlqgp',
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

    app.post('/verifyToken', (req, res) => {
        const { token } = req.body
        const data = SystemController.verifyToken(token)
        if (data != null)
            return res.json({
                code: 200,
                data: data
            })
        else
            return res.json({
                code: 400,
                message: "token is invalid"
            })
    })

    app.tokenPost("/getMenuData", async (req, res, user) => {
        return res.json({ code: 200, data: await SystemController.getUserMenuData(user.id) })
    })




    app.post('/login', async (req, res) => {
        const { connectId, username, password, verifyCode } = req.body

        const user = await SystemController.getUserByName(username)

        if (user == null)
            return res.json({
                code: 401,
                message: "用户不存在"
            })

        // 检查账户状态
        if (!user.status)
            return res.json({
                code: 402,
                message: "账户已停用，请联系管理员"
            })

        if (user.password != stringToHash(password))
            return res.json({
                code: 401,
                message: "密码错误"
            })

        res.json({
            code: 200,
            token: SystemController.registerToken(user)
        })
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