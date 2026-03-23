const BaseBackController = require("../BaseBackController")
const sharp = require('sharp'); // 引入 sharp 库

class NodeController extends BaseBackController {
    constructor() {
        super()
        this.multer = require('multer'); // 引入 multer 中间件
        this.storage // 配置图片 multer 存储
        this.upload
        this.storageFile  // 配置文件 multer 存储
        this.uploadFile
        this.storageEditor  // 配置编辑器 multer 存储
        this.uploadEditor
        this.initConfigration()
    }

    initConfigration() {
        //图片文件存储
        this.storage = this.multer.diskStorage({
            destination: (req, file, cb) => {
                cb(null, this.path.join(this.dataDistPath, 'upload', 'img'));
            },
            filename: (req, file, cb) => {
                cb(null, Date.now() + this.path.extname(file.originalname));
            }
        });

        this.upload = this.multer({ storage: this.storage });

        // 配置文件 multer 存储
        this.storageFile = this.multer.diskStorage({
            destination: (req, file, cb) => {
                cb(null, this.path.join(this.dataDistPath, 'upload', 'file'));
            },
            filename: (req, file, cb) => {
                cb(null, Date.now() + this.path.extname(file.originalname));
            }
        });

        this.uploadFile = this.multer({ storage: this.storageFile });

        // 配置编辑器 multer 存储
        this.storageEditor = this.multer.diskStorage({
            destination: (req, file, cb) => {
                cb(null, this.path.join(this.dataDistPath, 'upload', 'editor'));
            },
            filename: (req, file, cb) => {
                let fileName = Date.now() + this.path.extname(file.originalname)
                if (req.fileNames == null) req.fileNames = []
                if (file.mimetype.includes("image")) {
                    req["viedo"] = false
                    req.fileNames.push({
                        alt: fileName,
                        url: "/data/upload/editor/" + fileName,
                        href: "/data/upload/editor/" + fileName
                    })
                } else {
                    req["viedo"] = true
                    req.fileNames.push({
                        url: "/data/upload/editor/" + fileName,
                        poster: ""//图片封面，未实装
                    })
                }
                cb(null, fileName);
            }
        });

        this.uploadEditor = this.multer({ storage: this.storageEditor });
     
    }
    initPost() {
        // 上传图片接口
        this.app.post('/upload', this.upload.single('image'), async (req, res) => {
            if (!this.interfaceVerify(req, res)) return;
            if (!req.file) {
                return res.status(400).send('No file uploaded.');
            }
            const fileName = req.file.filename;

            // 压缩图片到不同质量
            const qualities = [0, 75, 50];
            const qualityFolders = ['imgQuality_1', 'imgQuality_2', 'imgQuality_3'];

            try {
                await Promise.all(qualities.map((quality, index) => {
                    if (quality === 0) {
                        // 当quality等于0时，不压缩画质
                        return sharp(req.file.path)
                            .jpeg() // 不设置压缩质量，保持原图质量
                            .toFile(`${this.path.join(this.dataDistPath, 'upload', 'img', qualityFolders[index], fileName)}`);
                    } else {
                        return sharp(req.file.path)
                            .jpeg({ quality }) // 设置压缩质量
                            .toFile(`${this.path.join(this.dataDistPath, 'upload', 'img', qualityFolders[index], fileName)}`);
                    }
                }));

                res.send({
                    code: 200,
                    message: 'File uploaded and compressed successfully',
                    filename: `/data/upload/img/imgQuality_1/${fileName}` // 返回 imgQuality_1 文件夹中的路径
                });
            } catch (error) {
                console.error(error);
                res.status(500).send('Error processing the image.');
            }

            this.log.cmsAccess(req, res);
        });

        // 上传接口
        this.app.post('/uploadFile', this.uploadFile.single('*'), (req, res) => {
            if (!this.interfaceVerify(req, res)) return
            if (!req.file) {
                return res.status(400).send('No file uploaded.');
            }
            res.send({
                code: 200,
                message: 'File uploaded successfully',
                filename: `/data/upload/file/${req.file.filename}`
            });
            this.log.cmsAccess(req, res)
        });

        this.app.post("/editor/uploadFile", this.uploadEditor.array("files"), (req, res) => {
            if (!this.interfaceVerify(req, res)) return
            if (req.viedo) {
                res.send({
                    errno: 0,
                    data: req.fileNames[0]
                })
            } else {
                res.send({
                    errno: 0,
                    data: req.fileNames
                })
            }
            this.log.cmsAccess(req, res)
        })

        //获取内容列表
        this.post('/getContentByListId', (req, res) => {
            let listId = req.body.id
            let page = req.body.page
            let limit = req.body.limit
            let listData = this.readList(listId)
            let result = []
            for (var a = listData.nodeId.length - 1; a >= 0; a--) {
                let item = listData.nodeId[a]
                let index = listData.nodeId.length - a - 1
                if (index >= (page - 1) * limit && index <= (page - 1) * limit + (limit - 1))
                    result.push(this.readNode(item.id))
            }
            res.send({ code: 200, message: "success", data: result, listData: listData, total: listData.nodeId.length });
            this.log.cmsAccess(req, res)
        });

        //获取节点内容
        this.post('/getNodeContent', (req, res) => {
            let id = req.body.id
            let content = this.readNodeContent(id)
            res.send({ code: 200, message: "success", data: content });
            this.log.cmsAccess(req, res)
        });

        //删除节点
        this.post('/delNode', (req, res) => {
            let id = req.body.id
            let node = this.readNode(id)
            node = JSON.parse(node)
            let parent = this.readList(node.parentId)
            parent.nodeId.forEach((item, index) => {
                if (item.id == id)
                    parent.nodeId.splice(index, 1)
            })
            this.writeList(parent.id, JSON.stringify(parent))
            res.send({ code: 200, message: "success" });
            this.log.cmsAccess(req, res)
        });

        // 创建节点数据
        this.post("/createNode", (req, res) => {
            try {
                let node = req.body
                let listFileData = this.readList(node.parentId)
                if (node.id == null) {
                    node["id"] = "n_" + (Date.now()).toString(36)
                    listFileData.nodeId.push({
                        id: node.id,
                        date: node.date,
                        top: node.top,
                        clicks: node.clicks,
                        publish: node.publish
                    })
                    this.writeList(node.parentId, JSON.stringify(listFileData))
                } else {
                    listFileData.nodeId.forEach(item => {
                        if (item.id == node.id) {
                            item.date = node.date
                            item.top = node.top
                            item.clicks = node.clicks
                            item.publish = node.publish
                        }
                    })
                    this.writeList(node.parentId, JSON.stringify(listFileData))
                }
                this.writeNode(node["id"], JSON.stringify(node))
                if (node.type == "1") {
                    let content = { content: node.content + "" }
                    node.content = ""
                    this.writeNodeContent(node["id"], JSON.stringify(content))
                }
                res.send({ code: 200, message: "success" })
            } catch (error) {
                //console.log(error)
                res.send({ code: 400, message: error })
            }
            this.log.cmsAccess(req, res)
        })
    }
}

module.exports = new NodeController()