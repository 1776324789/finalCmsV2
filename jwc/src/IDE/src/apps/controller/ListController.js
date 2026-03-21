const BaseBackController = require("../BaseBackController")

class ListController extends BaseBackController {
    constructor() {
        super()
    }

    initPost() {
        this.post('/getListSubmits', (req, res) => {
            let request = req.body
            let list = this.readList(request.id)
            let submitData = []
            list.submitData.forEach(item => {
                submitData.push(JSON.parse(this.readNode(item.id)))
            })
            res.send({
                code: 200,
                message: 'success',
                data: submitData
            });
            this.log.cmsAccess(req, res)
        })

        this.post('/getListById', (req, res) => {
            let request = req.body
            res.send({
                code: 200,
                message: 'success',
                data: this.readList(request.id)
            });
            this.log.cmsAccess(req, res)
        })

        // 获取列表列表
        //传入page limit
        this.post('/getListData', (req, res) => {
            this.sortLists()
            let request = req.body
            res.send({
                code: 200,
                message: 'success',
                data: this.getList(request.page, request.limit, request.name),
                total: BaseBackController.listData.length
            });
            this.log.cmsAccess(req, res)
        })
        // 移动列表
        this.post('/moveList', (req, res) => {
            try {
                let request = req.body
                let id = request.id
                let moveId = request.moveId
                let targetList = null
                if (id) targetList = this.readList(id)
                moveId.forEach(item => {
                    if (id) targetList.listId.push(item)
                    let childList = this.readList(item)
                    if (childList.parentId != null && childList.parentId !== "") {
                        let parentList = this.readList(childList.parentId)
                        parentList.listId.splice(parentList.listId.indexOf(childList.id), 1)
                        this.writeList(parentList.id, parentList)
                    }
                    if (id) childList.parentId = id
                    else childList.parentId = ""
                    this.writeList(childList.id, childList)
                })
                if (id) this.writeList(targetList.id, targetList)
                this.initListData()
                res.send({ code: 200, message: "error" })
            } catch (e) {
                res.send({ code: 400, message: "error" })
            }
        })
        // 创建新的list
        this.post('/createNewList', (req, res) => {
            let newList = req.body
            newList["id"] = "l_" + (Date.now()).toString(36)
            newList["nodeId"] = []
            newList["listId"] = []
            newList["delFlag"] = 0
            let list = {
                id: newList.id, index: newList.index, name: newList.name, listId: newList.listId
            }

            // 将新建的列表加入到缓存区
            if (newList.parentId == null || newList.parentId === '') {
                BaseBackController.listData.push(list)
                this.sortLists()
            } else {
                BaseBackController.listMap.get(newList.parentId).listId.push(newList.id)
            }
            BaseBackController.listMap.set(newList.id, list)
            this.writeList(newList.id, JSON.stringify(newList))

            // 当list的parentId不为null，则写入父列表文件
            if (newList.parentId != null) {
                let parentData = this.readList(newList.parentId)
                parentData.listId.push(newList.id)
                this.writeList(newList.parentId, JSON.stringify(parentData))
            }
            res.send({ code: 200, message: "success" });
            this.log.cmsAccess(req, res)

        });

        //更新列表数据
        this.post('/updateList', (req, res) => {
            let list = req.body
            BaseBackController.listMap.get(list.id).name = list.name
            BaseBackController.listMap.get(list.id).index = list.index
            this.writeList(list.id, JSON.stringify(list))
            res.send({ code: 200, message: "success" });
            this.log.cmsAccess(req, res)
        });

        //删除列表数据
        this.post('/removeList', (req, res) => {
            let id = req.body.id
            if (BaseBackController.listData.indexOf(BaseBackController.listMap.get(id)) !== -1) BaseBackController.listData.splice(BaseBackController.listData.indexOf(BaseBackController.listMap.get(id)), 1)
            if (BaseBackController.listMap.has(id)) BaseBackController.listMap.delete(id)

            let list = this.readList(id)
            list.delFlag = 1
            this.writeList(id, JSON.stringify(list))
            if (list.parentId != null) {
                BaseBackController.listMap.get(list.parentId).listId.splice(BaseBackController.listMap.get(list.parentId).listId.indexOf(list.id), 1)
                let parent = this.readList(list.parentId)
                parent.listId = BaseBackController.listMap.get(list.parentId).listId
                this.writeList(list.parentId, JSON.stringify(parent))
            }
            res.send({ code: 200, message: "success" });
            this.log.cmsAccess(req, res)
        });

    }


}

module.exports = new ListController()