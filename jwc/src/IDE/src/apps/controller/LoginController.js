const BaseBackController = require("../BaseBackController")

class LoginController extends BaseBackController {
    constructor() {
        super()
        this.verifyCodeMap = new Map()//存储验证码
        this.svgCaptcha = require('svg-captcha');//生成验证码
        this.authorization = require("../../utils/Authorization")
    }

    initPost() {
        // 验证验证码
        this.app.post("/verifyCode", (req, res) => {
            let code = (req.body.code + "").toUpperCase()
            let connectId = req.body.connectId

            if (!this.verifyCodeMap.has(connectId)) {
                res.send({ code: 404 })
            } else if ((this.verifyCodeMap.get(connectId) + "").toUpperCase() == code) {
                this.verifyCodeMap.delete(connectId)
                res.send({ code: 200 })
            } else res.send({ code: 400 })
            this.log.cmsAccess(req, res)
        })

        // 获取验证码
        this.app.post("/getverifyCode", (req, res) => {
            // 生成包含数字的验证码
            const captcha = this.svgCaptcha.create({
                size: 4, // 验证码的长度
                ignoreChars: '0123456789oOiIl', // 排除容易混淆的字符
                noise: 5, // 干扰线条的数量
            });
            this.verifyCodeMap.set(req.body.connectId, captcha.text)
            //五分钟后自动删除
            setTimeout(() => {
                this.verifyCodeMap.delete(req.body.connectId)
            }, 120000);
            res.send({ svg: captcha.data })
            this.log.cmsAccess(req, res)
        })

        // 登录接口
        this.app.post("/login", (req, res) => {
            let body = req.body
            let user = this.authorization.verifyUser(body.account, body.password)
            if (user == false) {
                res.send({
                    code: 400
                })
            } else {
                res.send({
                    code: 200,
                    token: user.token,
                    userName: user.userName
                })
            }
            this.log.cmsAccess(req, res)
        })

        // 登录接口
        this.app.post("/verifyUserToken", (req, res) => {
            let result = this.authorization.verifyToken(req.body.token)
            res.send({ code: result })
            this.log.cmsAccess(req, res)
        })

        //退出登录
        this.app.post('/logout', (req, res) => {
            try {
                this.authorization.removeToken(req.headers.authorization)
                res.send({ code: 200 })
            } catch (error) {
                //console.log(error)
                res.send({ code: 400 })
            }
            this.log.cmsAccess(req, res)

        })
        //退出登录
        this.post('/getUserPremission', (req, res) => {
            try {
                res.send({ code: 200, data: this.authorization.getPremission(req.headers.authorization) })
            } catch (error) {
                //console.log(error)
                res.send({ code: 400 })
            }
            this.log.cmsAccess(req, res)

        })
    }
}

module.exports = new LoginController()