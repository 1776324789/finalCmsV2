const BaseBackController = require("../BaseBackController")

class PremissionController extends BaseBackController {
    constructor() {
        super()

        this.initListData()
    }

    initPost() {
        // 获取列表列表
        //传入page limit
        this.post('/getPremissionList', (req, res) => {
            try {
                res.send({ code: 200, data: this.authorization.getPremissionInfo() })
            } catch (error) {
                this.log.error(error)
                res.send({ code: 400, message: "error" })
            }
            this.log.cmsAccess(req, res)
        })
        // 根据传入数据更新或者创建功能

        this.post('/updatePremission', (req, res) => {
            try {
                let premissionList = this.authorization.getPremissionInfo()
                let premission = {}
                let premissionTem = req.body
                premission.able = premissionTem.able
                premission.label = premissionTem.label
                premission.group = premissionTem.group
                premission.src = premissionTem.src
                premission.name = premissionTem.name
                premission.icon = premissionTem.icon
                premission.groupIcon = premissionTem.groupIcon
                if (premission.name == "") {
                    premission.name = "p_" + Date.now().toString(36)
                    premissionList.push(premission)
                } else {
                    premissionList.forEach((item, index) => {
                        if (item.name == premission.name) {
                            premissionList[index] = premission
                        }
                    })
                }
                this.authorization.setPremissionInfo(JSON.stringify(premissionList))
                res.send({ code: 200, message: "success" })
            } catch (error) {
                this.log.error(error)
                res.send({ code: 400, message: "error" })
            }
            this.log.cmsAccess(req, res)
        })
        this.post('/delPremission', (req, res) => {
            try {
                let premissionList = this.authorization.getPremissionInfo()

                premissionList.forEach((item, index) => {
                    if (item.name == req.body.name) {
                        premissionList.splice(index, 1)
                        return
                    }
                })

                this.authorization.setPremissionInfo(JSON.stringify(premissionList))
                res.send({ code: 200, message: "success" })
            } catch (error) {
                this.log.error(error)
                res.send({ code: 400, message: "error" })
            }
            this.log.cmsAccess(req, res)
        })

    }
}
module.exports = new PremissionController()