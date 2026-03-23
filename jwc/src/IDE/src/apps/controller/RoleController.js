BaseBackController = require("../BaseBackController")

class UserController extends BaseBackController {
    constructor() {
        super()
    }

    initPost() {
        // 获取列表点击量数据
        this.post("/getRoleData", (req, res) => {
            let result = []
            let roleInfo = this.authorization.getRoleInfo()

            result = roleInfo.filter(role => role.able == true)
            res.send({
                code: 200,
                data: result
            });
            this.log.cmsAccess(req, res)
        })

        this.post("/updateRole", (req, res) => {
            let role = req.body

            let premission = []
            role.premission.forEach(item => {
                premission.push(item.value)
            })
            let roleInfo = this.authorization.getRoleInfo()
            role.premission = premission
            if (role.id == "" || role.id == null) {
                role.id = "r_" + Date.now().toString(36)
                role.id = this.tools.formatDate(new Date(), "YYYY-MM-DD HH-mm-SS")
                roleInfo.push(role)
            } else {
                roleInfo.forEach((item, index) => {
                    if (item.id == role.id) {
                        roleInfo[index] = role
                    }
                })
            }
            this.authorization.setRoleInfo(JSON.stringify(roleInfo))
            res.send({
                code: 200
            });
            this.log.cmsAccess(req, res)
        })
        this.post("/delRole", (req, res) => {
            let role = req.body

            let roleInfo = this.authorization.getRoleInfo()
            roleInfo.forEach((item, index) => {
                if (item.id == role.id) {
                    roleInfo.splice(index, 1)
                }
            })
            this.authorization.setRoleInfo(JSON.stringify(roleInfo))
            res.send({
                code: 200
            });
            this.log.cmsAccess(req, res)
        })
    }
}

module.exports = new UserController()