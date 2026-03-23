BaseBackController = require("../BaseBackController")

class UserController extends BaseBackController {
    constructor() {
        super()
    }

    initPost() {
        // 获取列表点击量数据
        this.post("/getUserData", (req, res) => {
            let userInfo = this.authorization.getUserInfo()
            let roleInfo = this.authorization.getRoleInfo()
            let roleMap = new Map()
            roleInfo.forEach(item => {
                item.premission = ""
                roleMap.set(item.id, item)
            })
            userInfo.forEach(user => {
                user.role.forEach((role, index) => {
                    user.role[index] = roleMap.get(role)
                })
            })
            res.send({
                code: 200,
                data: userInfo
            });
            this.log.cmsAccess(req, res)
        })

        this.post("/addUser", (req, res) => {
            let user = req.body;
            let code = 200
            let roles = []
            user.role.forEach(role => {
                roles.push(role.value)
            })
            user.role = roles
            user.createDate = this.tools.formatDate(new Date, "YYYY-MM-DD HH-mm-SS")
            let userInfo = this.authorization.getUserInfo()
            userInfo.forEach(item => {
                if (item.account == user.account) {
                    code = 201 //账号重复
                }
            })
            if (code == 200) {
                userInfo.push(user)
                this.authorization.setUserInfo(JSON.stringify(userInfo))
            }
            res.send({
                code: code
            });
            this.log.cmsAccess(req, res)
        })

        this.post("/updateUser", (req, res) => {
            let user = req.body;
            let code = 200
            let roles = []
            user.role.forEach(role => {
                roles.push(role.value)
            })
            user.role = roles

            let userInfo = this.authorization.getUserInfo()
            userInfo.forEach((item, index) => {
                if (item.account == user.account) {
                    userInfo[index] = user
                    this.authorization.setUserInfo(JSON.stringify(userInfo))
                    return
                }
            })
            res.send({
                code: code
            });
            this.log.cmsAccess(req, res)
        })
        this.post("/delUser", (req, res) => {
            let user = req.body;
            let code = 200
            let userInfo = this.authorization.getUserInfo()
            userInfo.forEach((item, index) => {
                if (item.account == user.account) {
                    userInfo.splice(index, 1)
                    this.authorization.setUserInfo(JSON.stringify(userInfo))
                    return
                }
            })
            res.send({
                code: code
            });
            this.log.cmsAccess(req, res)
        })
    }
}

module.exports = new UserController()