class BaseBackController {
    static listData = [] //所有的一级列表数据缓存
    static listMap = new Map() //所有的列表缓存

    constructor() {
        this.log = require("../utils/LogController")
        this.tools = require("../utils/Tools")
        this.setting = require("../../setting")
        this.os = require('os');
        this.platform = this.os.platform();
        this.authorization = require("../utils/Authorization")
        this.fs = require("fs")
        this.path = require("path")
        this.basePath = process.cwd();
        this.dataTemplatePath = this.path.join(this.basePath, "Front", "template", 'data')
        this.dataDistPath = this.path.join(this.basePath, "Front", "dist", "data")
    }

    init(setting) {
        for (var key in setting) {
            this[key] = setting[key]
        }
        this.fs.writeFileSync(this.path.join(this.basePath, 'Front', 'template', 'ModifyDate.json'), JSON.stringify({ date: Date.now() }))
        this.initPost()
    }

    initPost() {
    }

    post(url, fun) {
        this.app.post(url, (req, res) => {
            try {
                if (!this.interfaceVerify(req, res)) return
                this.fs.writeFileSync(this.path.join(this.basePath, 'Front', 'template', 'ModifyDate.json'), JSON.stringify({ date: Date.now() }))
                fun(req, res)
            } catch (e) {
                console.log(e)
                res.send({ code: 400, message: e })
            }

        })
    }

    get(url, fun) {
        this.app.get(url, (req, res) => {
            try {
                if (!this.interfaceVerify(req, res)) return
                this.fs.writeFileSync(this.path.join(this.basePath, 'Front', 'template', 'ModifyDate.json'), JSON.stringify({ date: Date.now() }))
                fun(req, res)
            } catch (e) {
                res.send({ code: 400, message: "error" })
            }
        })
    }

    // 接口的token验证
    interfaceVerify(req, res) {
        let result = this.authorization.verifyToken(req.headers.authorization)
        if (result === 200) {
            return true
        } else {
            res.send({ code: 203 })
        }
        this.log.cmsAccess(req, res)
        return false
    }

    file() {

    }

    readNode(id) {
        return this.fs.readFileSync(this.path.join(this.dataTemplatePath, 'node', `${id}.json`), "utf-8")
    }

    //读取系节点内容
    readNodeContent(id) {
        return this.fs.readFileSync(this.path.join(this.dataTemplatePath, 'content', `${id}.json`), "utf-8")
    }

    //传入列表id返回列表对象数据
    readList(id) {
        return JSON.parse(this.fs.readFileSync(this.path.join(this.dataTemplatePath, 'list', `${id}.json`), "utf-8"))
    }

    writeNode(id, data) {
        this.fs.writeFileSync(this.path.join(this.dataTemplatePath, 'node', `${id}.json`), data, { flag: 'w' })
        // return this.antiTemple.setDataFileFingerPrint(this.path.join(this.dataTemplatePath, 'node', `${id}.json`))// 在写入文件的时候将文件的指纹记录到缓存
    }

    writeNodeContent(id, data) {
        this.fs.writeFileSync(this.path.join(this.dataTemplatePath, 'content', `${id}.json`), data, { flag: 'w' })
        // return this.antiTemple.setDataFileFingerPrint(this.path.join(this.dataTemplatePath, 'content', `${id}.json`))// 在写入文件的时候将文件的指纹记录到缓存
    }

    writeList(id, data) {
        this.fs.writeFileSync(this.path.join(this.dataTemplatePath, 'list', `${id}.json`), typeof data == "object" ? JSON.stringify(data) : data, { flag: 'w' })
        // return this.antiTemple.setDataFileFingerPrint(this.path.join(this.dataTemplatePath, 'list', `${id}.json`))// 在写入文件的时候将文件的指纹记录到缓存
    }

    //获取list 带分页
    getList(page, limit, name) {
        if (name == null || name === "") name == false
        let resultList = []
        for (let a = (page - 1) * limit; a < (page - 1) * limit + limit; a++) {
            if (BaseBackController.listData[a] == null) {
                break
            } else if (!name) {
                this.getListList(BaseBackController.listData[a].id, resultList)
            } else if (BaseBackController.listData[a].name.includes(name)) {
                this.getListList(BaseBackController.listData[a].id, resultList)
            }
        }
        let result = []
        resultList.forEach(item => {
            this.log.info("getFile:" + item)
            try {
                result.push(JSON.stringify(this.readList(item)))
            } catch (error) {
                this.log.error("can no read file:" + error)
            }
        })
        return result
    }

    // 加载列表至缓存数据中
    initListData() {
        try {
            BaseBackController.listMap = new Map()
            BaseBackController.listData = []
            // 读取目录中的所有文件
            // 将文件列表加载到缓存
            const files = this.fs.readdirSync(this.path.join(this.dataTemplatePath, 'list'));
            files.forEach(file => {
                let fileData = JSON.parse(this.fs.readFileSync(this.path.join(this.path.join(this.dataTemplatePath, 'list'), file), "utf-8"))
                let list = {
                    id: fileData.id, index: fileData.index, name: fileData.name, listId: fileData.listId
                }
                //所有list加载进listmap
                BaseBackController.listMap.set(fileData.id, list)
                if (fileData.delFlag === 0 && (fileData.parentId == null || fileData.parentId === '')) {
                    // 将第一级列表加载至listdata，用于主列表渲染
                    BaseBackController.listData.push(list)
                }
            });
            this.sortLists()
        } catch (err) {
            this.log.error(err);
        }
    }

    getListList(listId, array) {
        array.push(listId)
        if (BaseBackController.listMap.get(listId).listId != null) BaseBackController.listMap.get(listId).listId.forEach(item => {
            this.getListList(item, array)
        })
    }

    //将列表按照index进行排序
    sortLists() {
        BaseBackController.listData.sort((a, b) => a.index - b.index);
        BaseBackController.listMap.forEach(list => {
            this.sortChildren(list)
        })
    }

    //将子列表排序
    sortChildren(list) {
        let childrenList = []
        //获取所有的子列表内容到childrenList
        list.listId.forEach(item => {
            let child = BaseBackController.listMap.get(item)
            childrenList.push(child)
            this.sortChildren(child)
        })
        childrenList.sort((a, b) => a.index - b.index);

        list.listId = []
        childrenList.forEach(item => {
            list.listId.push(item.id)
        })
        let listTem = this.readList(list.id)
        listTem.listId = list.listId
        this.writeList(list.id, listTem)
    }
}

module.exports = BaseBackController