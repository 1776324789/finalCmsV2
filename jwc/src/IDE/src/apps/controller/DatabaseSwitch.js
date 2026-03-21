const BaseBackController = require("../BaseBackController")
const NDBC = require("../../utils/NDBC")

class DatabaseSwitch extends BaseBackController {
    constructor() {
        super()
        this.DataController = require("../../utils/DataController")
        this.connectionMap = new Map()
        this.idIndex = 0
        this.DataController = require("../../utils/DataController")

    }

    initPost() {
        //连接数据库
        this.post('/connectMysql', async (req, res) => {
            if (req.body.connectId != null) {
                if (this.connectionMap.has(req.body.connectId)) {
                    let connection = this.connectionMap.get(req.body.connectId)
                    if (connection.connection == null) {
                        let connect = await connection.connect()
                        if (connect.code == 200) {
                            let data = await connection.getData()
                            if (data.code == 200) {
                                res.send({
                                    code: 200, data: data.data, message: "success", connectId: req.body.connectId
                                })
                            } else {
                                res.send({
                                    code: 401, message: data.message, connectId: req.body.connectId
                                })
                            }
                        } else {
                            res.send({
                                code: 400, message: connect.message
                            })
                        }
                    } else {
                        let data = await connection.getData()
                        if (data.code == 200) {
                            res.send({
                                code: 200, data: data.data, message: "success", connectId: req.body.connectId
                            })
                        } else {
                            res.send({
                                code: 401, message: data.message, connectId: req.body.connectId
                            })
                        }
                    }
                }
                return
            }
            let targetId = Date.now().toString(36) + ""
            let connection = new NDBC(req.body)
            let connect = await connection.connect()
            if (connect.code == 200) {
                this.connectionMap.set(targetId, connection)
                let data = await connection.getData()
                if (data.code == 200) {
                    res.send({
                        code: 200, data: data.data, message: "success", connectId: targetId
                    })
                } else {
                    res.send({
                        code: 401, message: data.message, connectId: targetId
                    })
                }
            } else {
                res.send({
                    code: 400, message: connect.message
                })
            }
            this.log.cmsAccess(req, res)
        })

        this.post('/reloadMysqlData', async (req, res) => {
            let data = await this.connectionMap.get(req.body.connectId).getData()
            res.send(data)
        })

        this.post('/insertData', async (req, res) => {
            try {
                let data = this.formatData(this.connectionMap.get(req.body.connectId).databaseResult)
                this.DataController.ClearData()
                this.DataController.CreateData(data)
                this.initListData()//重新加载全部list到缓存
                res.send({
                    code: 200, msg: "success"
                })
            } catch (e) {
                console.log(e);

                res.send({
                    code: 400, msg: "data format fail"
                })
            }
        })

        // 数据转换为sql
        this.post('/dataToSQL', (req, res) => {
            try {
                this.DataController.DataToSQL()
                // 告诉浏览器将此文件作为附件下载
                res.send({
                    code: 200, msg: "success"
                })
            } catch (e) {
                //console.log(e)
                res.send({
                    code: 400, msg: "data format fail"
                })
            }
        })
    }

    formatData(data) {
        let listMap = new Map()
        let nodeMap = new Map()
        let contentMap = new Map()
        let contentIdMap = new Map()
        let list = []
        let allList = []
        let listIdMap = new Map()

        data.list.forEach(item => {
            if (item.delFlag == 1) return
            let newId = this.getId("l")
            listIdMap.set(item.id, newId)
            listMap.set(item.id, item)
            item.id = newId
            listMap.set(item.id, item)
            allList.push(item)
            item.nodeId = []
            item.listId = []
            if (item.parentId == "" || item.parentId == null) {
                list.push(item)
            }
        })
        data.list.forEach(item => {
            if (item.parentId != null && item.parentId != "") {
                if (listMap.has(item.parentId)) {
                    listMap.get(item.parentId).listId.push(item.id)
                    item.parentId = listIdMap.get(item.parentId)
                }
            }
        })

        data.content.forEach(item => {
            contentIdMap.set(item.id, item)
        })

        data.node.forEach(item => {
            let content = contentIdMap.get(item.id)
            item.id = this.getId("n")
            if (content) {
                content.id = item.id
                contentMap.set(item.id, content)
            }
            nodeMap.set(item.id, item)
            if (item.top === "true" || item.top === true) {
                item.top = {
                    "top": true, "untop": false
                }
            } else {
                item.top = {
                    "top": false, "untop": true
                }
            }
            if (item.publish === "true" || item.publish === true) {
                item.publish = {
                    "publish": true, "unpublish": false
                }
            } else {
                item.publish = {
                    "publish": true, "unpublish": false
                }
            }
            item.date = this.formatTime(item.date, "YYYY-MM-DD hh:mm:ss")
            if (listMap.has(item.parentId)) {
                listMap.get(item.parentId).nodeId.push({
                    "id": item.id, "date": item.date, "top": item.top, "clicks": item.clicks, "publish": item.publish
                })
            }
        })

        let allNode = []
        Array.from(nodeMap).forEach(item => {
            item[1].parentId = listIdMap.get(item[1].parentId)
            if (item[1].link == null) item[1].link = ""
            if (item[1].note == null) item[1].note = ""
            if (item[1].cover == null) item[1].cover = ""
            allNode.push(item[1])
        })

        allList.forEach(item => {
            if (item.link == null) item.link = ""
            if (item.enName == null) item.enName = ""
            if (item.template == null) item.template = ""
            if (item.nodeTemplate == null) item.nodeTemplate = ""
            if (item.index == null) item.index = 50
            if (item.note == null) item.note = ""
            if (item.parentId == null) item.parentId = ""
            if (item.cover == null) item.cover = ""
            if (item.delFlag == null) item.delFlag = 0
        })

        let allContent = []
        Array.from(contentMap).forEach(item => {
            allContent.push(item[1])
        })
        return { list: allList, node: allNode, content: allContent }
    }

    getId(i) {
        this.idIndex += Math.floor(Math.random() * 100)
        return i + "_" + (Date.now() + this.idIndex).toString(36)
    }

    formatTime(timeStr, format) {
        const date = new Date(timeStr)
        let year = date.getFullYear() > 9 ? date.getFullYear() : "0" + date.getFullYear()
        let month = (date.getMonth() + 1) > 9 ? (date.getMonth() + 1) : "0" + (date.getMonth() + 1)
        let day = date.getDate() > 9 ? date.getDate() : "0" + date.getDate()
        let hour = date.getHours() > 9 ? date.getHours() : "0" + date.getHours()
        let minute = date.getMinutes() > 9 ? date.getMinutes() : "0" + date.getMinutes()
        let second = date.getSeconds() > 9 ? date.getSeconds() : "0" + date.getSeconds()
        format = format.replaceAll("YYYY", year)
        format = format.replaceAll("YY", (year + "").substring(2, 4))
        format = format.replaceAll("yyyy", year)
        format = format.replaceAll("yy", (year + "").substring(2, 4))
        format = format.replaceAll("MM", month)
        format = format.replaceAll("DD", day)
        format = format.replaceAll("dd", day)
        format = format.replaceAll("HH", hour)
        format = format.replaceAll("hh", hour)
        format = format.replaceAll("mm", minute)
        format = format.replaceAll("SS", second)
        format = format.replaceAll("ss", second)
        return format;
    }
}

module.exports = new DatabaseSwitch()