// file1.js
class DataExpress {
    constructor() {
        this.fs = require("fs")
        this.http = require('http');
        this.path = require('path');
        this.cors = require('cors'); // 引入 cors 中间件
        this.rateLimit
        this.helmet
        this.app
        this.basePath = process.cwd();
        this.templatePath = this.path.join(this.basePath, "Front", 'template', "data")
        this.distPath = this.path.join(this.basePath, "Front", 'dist', "data")
        this.setting = require("../../setting")
        // 后台
        this.server = this.http.createServer(this.app);
        this.port //后台默认运行端口
        this.clicksThreadMap = new Map()
        this.log = require("../utils/LogController")
        this.nodeClicks = {} //文章的点击率数据统计{clicks: node.clicks * 1,title: node.title, parentId: node.parentId}
        this.clicksDateData
    }

    setApp(app) {
        this.app = app
        this.init()
    }

    init() {
        this.initDirs()
        this.initSearch()
        this.initConfigure()
        this.runClicksThread()
    }

    initDirs() {
        //初始化文件、数据目录
        if (!this.fs.existsSync(this.path.join(this.templatePath))) {
            this.fs.mkdirSync(this.path.join(this.templatePath));
        }
        if (!this.fs.existsSync(this.path.join(this.templatePath, 'list'))) {
            this.fs.mkdirSync(this.path.join(this.templatePath, 'list'));
        }
        if (!this.fs.existsSync(this.path.join(this.templatePath, 'content'))) {
            this.fs.mkdirSync(this.path.join(this.templatePath, 'content'));
        }
        if (!this.fs.existsSync(this.path.join(this.templatePath, 'node'))) {
            this.fs.mkdirSync(this.path.join(this.templatePath, 'node'));
        }
        if (!this.fs.existsSync(this.path.join(this.distPath))) {
            this.fs.mkdirSync(this.path.join(this.distPath));
        }
        if (!this.fs.existsSync(this.path.join(this.distPath, 'list'))) {
            this.fs.mkdirSync(this.path.join(this.distPath, 'list'));
        }
        if (!this.fs.existsSync(this.path.join(this.distPath, 'content'))) {
            this.fs.mkdirSync(this.path.join(this.distPath, 'content'));
        }
        if (!this.fs.existsSync(this.path.join(this.distPath, 'node'))) {
            this.fs.mkdirSync(this.path.join(this.distPath, 'node'));
        }
        if (!this.fs.existsSync(this.path.join(this.distPath, 'upload'))) {
            this.fs.mkdirSync(this.path.join(this.distPath, 'upload'));
        }
        if (!this.fs.existsSync(this.path.join(this.distPath, 'upload', 'img'))) {
            this.fs.mkdirSync(this.path.join(this.distPath, 'upload', 'img'));
        }
        if (!this.fs.existsSync(this.path.join(this.distPath, 'upload', 'img', 'imgQuality_1'))) {
            this.fs.mkdirSync(this.path.join(this.distPath, 'upload', 'img', 'imgQuality_1'));
        }
        if (!this.fs.existsSync(this.path.join(this.distPath, 'upload', 'img', 'imgQuality_2'))) {
            this.fs.mkdirSync(this.path.join(this.distPath, 'upload', 'img', 'imgQuality_2'));
        }
        if (!this.fs.existsSync(this.path.join(this.distPath, 'upload', 'img', 'imgQuality_3'))) {
            this.fs.mkdirSync(this.path.join(this.distPath, 'upload', 'img', 'imgQuality_3'));
        }
        if (!this.fs.existsSync(this.path.join(this.distPath, 'upload', 'file'))) {
            this.fs.mkdirSync(this.path.join(this.distPath, 'upload', 'file'));
        }
        if (!this.fs.existsSync(this.path.join(this.distPath, 'upload', 'editor'))) {
            this.fs.mkdirSync(this.path.join(this.distPath, 'upload', 'editor'));
        }
        if (!this.fs.existsSync(this.path.join(this.distPath, 'cmsScripts'))) {
            this.fs.mkdirSync(this.path.join(this.distPath, 'cmsScripts'));
        }
        if (!this.fs.existsSync(this.path.join(this.distPath, 'componentScripts'))) {
            this.fs.mkdirSync(this.path.join(this.distPath, 'componentScripts'));
        }
        //加载所有前端脚本至dist
        this.fs.readdirSync(this.path.join(this.basePath, "IDE", "src", 'cmsScripts')).forEach(item => {
            this.fs.copyFileSync(this.path.join(this.basePath, "IDE", "src", 'cmsScripts', item), this.path.join(this.distPath, 'cmsScripts', item))
        })
    }
    // 初始化全文检索
    initSearch() {
        this.listList = this.fs.readdirSync(this.path.join(this.distPath, "list"))
        this.listMap = new Map()
        this.nodeData = []
        this.parentList = []
        this.listList.forEach(item => {
            let tempListData = JSON.parse(this.fs.readFileSync(this.path.join(this.distPath, "list", item), "utf-8"))
            this.listMap.set(item.replace(".json", ""), tempListData)
            if (tempListData.parentId == null || tempListData.parentId == "") {
                this.parentList.push(tempListData)
            }
        })

        this.parentList.forEach(item => {
            this.loadAllNode(item)
        })

        this.contentMap = {}

        this.nodeData.forEach(item => {
            if (this.fs.existsSync(this.path.join(this.basePath, "Front", "template", 'data', "content", item + ".json"))) {
                let nodeTitle = JSON.parse(this.fs.readFileSync(this.path.join(this.basePath, "Front", "template", 'data', "node", item + ".json"), "utf-8")).title
                let nodeContent = (this.stripHtmlTags(JSON.parse(this.fs.readFileSync(this.path.join(this.basePath, "Front", "template", 'data', "content", item + ".json"), "utf-8")).content))
                let content = nodeContent + nodeTitle
                content = content.replace(/\\n/g, "")
                    .replace(/&nbsp;/g, '')
                    .replace(/，/g, '')
                    .replace(/。/g, '')
                    .replace(/ /g, '')
                    .replace(/\n/g, "")
                    .replace(/&rdquo;/g, "")
                    .replace(/；/g, '')
                    .replace(/&hellip;/g, '')
                    .replace(/&ldquo;/g, '')
                this.contentMap[item] = content
            }
        })

        this.fs.writeFileSync(this.path.join(this.basePath, "Front", "template", 'data', "searchContent.json"), JSON.stringify(this.contentMap), { flag: 'w' })

        this.caculateClicksData()
        setInterval(() => {
            this.caculateClicksData()
        }, this.setting.clicksSyncTime)
    }

    loadAllNode(list) {
        if (list.type == 1 && list.delFlag == 0) {
            list.nodeId.forEach(node => {
                this.nodeData.push(node.id)
            })
            if (list.listId.length > 0) {
                list.listId.forEach(item => {
                    let listData = this.listMap.get(item)
                    this.loadAllNode(listData)
                })
            }
        }
    }

    caculateClicksData() {
        let listMap = new Map()
        this.fs.readdirSync(this.path.join(this.templatePath, 'node')).forEach(item => {
            try {
                let node = JSON.parse(this.fs.readFileSync(this.path.join(this.templatePath, 'node', item), 'utf-8'))
                if (!listMap.has(node.parentId)) {
                    let list = JSON.parse(this.fs.readFileSync(this.path.join(this.templatePath, 'list', node.parentId + ".json"), "utf-8"))

                    listMap.set(node.parentId, list)
                }
                if (listMap.get(node.parentId).type == 1 && listMap.get(node.parentId).delFlag == 0) {
                    let has = false
                    listMap.get(node.parentId).nodeId.forEach(item => {
                        if (item.id == node.id) has = true
                    })
                    if (has) {
                        this.nodeClicks[node.id] = {
                            clicks: node['realClicks'] == null ? 0 : node['realClicks'] * 1,
                            title: node.title,
                            parentId: node.parentId,
                            date: node.date,
                            id: node.id
                        }
                        this.nodeClicks[node.id]["parentName"] = listMap.get(node.parentId).name
                    }
                }
            } catch (error) {
                this.log.error(error.message)
            }
        })
        this.fs.writeFileSync(this.path.join(this.basePath, "IDE", 'clicks.json'), JSON.stringify(this.nodeClicks))
        listMap.clear()
    }

    stripHtmlTags(str) {
        if (str)
            return str.replace(/<\/?[^>]+(>|$)/g, "");
        else return ""
    }


    runClicksThread() {
        this.clicksDateData = JSON.parse(this.fs.readFileSync(this.path.join("IDE", 'clicksDateData.json'), 'utf-8'))

        setInterval(() => {
            try {
                this.log.info("sync node clicks data")
                if (this.clicksDateData[this.getNowFormatDate()] == null) {
                    this.clicksDateData[this.getNowFormatDate()] = { clicks: 0, visitor: [] }
                }
                Array.from(this.clicksThreadMap).forEach(item => {
                    if (!item[1].sync) {
                        let nodeData = JSON.parse(this.fs.readFileSync(this.path.join(this.templatePath, 'node', item[0] + ".json")))
                        nodeData['realClicks'] = nodeData['realClicks'] + item[1].clicks
                        nodeData['clicks'] = nodeData['clicks'] + item[1].clicks
                        this.fs.writeFileSync(this.path.join(this.templatePath, 'node', item[0] + ".json"), JSON.stringify(nodeData))
                        this.clicksThreadMap.get(item[0]).sync = true
                        this.clicksDateData[this.getNowFormatDate()].clicks = item[1].clicks + this.clicksDateData[this.getNowFormatDate()].clicks
                        this.fs.writeFileSync(this.path.join("IDE", 'clicksDateData.json'), JSON.stringify(this.clicksDateData))
                        this.clicksThreadMap.set(item[0], { clicks: 0, sync: true })
                    }
                })
                this.fs.writeFileSync(this.path.join("IDE", 'clicksDateData.json'), JSON.stringify(this.clicksDateData))
            } catch (error) {
                this.log.error(error.message)
            }
        }, this.setting.clicksSyncTime)
    }


    getNowFormatDate() {
        let date = new Date()
        return `${date.getFullYear()}-${date.getMonth() >= 9 ? date.getMonth() + 1 : "0" + (date.getMonth() + 1)}-${date.getDate() > 9 ? date.getDate() : "0" + date.getDate()}`
    }

    initConfigure() {
        if (this.setting.isLimitRequest) {
            this.rateLimit = require('express-rate-limit');
        }

        if (this.setting.isHelmet) {
            this.helmet = require('helmet');
        }

        this.port = this.setting.dataPort
        // 创建一个中间件来处理文件修改
        this.app.use((req, res, next) => {
            let ip = req.ip;
            if (req.headers['x-forwarded-for']) {
                ip = req.headers['x-forwarded-for'].split(',')[0];
            }
            ip = ip.split(":")[ip.split(":").length - 1]
            if (!this.clicksDateData[this.getNowFormatDate()]) this.clicksDateData[this.getNowFormatDate()] = {
                visitor: [],
                clicks: 0
            }
            if (!this.clicksDateData[this.getNowFormatDate()].visitor.includes(ip))
                this.clicksDateData[this.getNowFormatDate()].visitor.push(ip)
            if (req.path.toString().includes("/content/")) {
                let nodeId = req.path.toString().split("/")[req.path.toString().split("/").length - 1].toString().replace(".json", "")
                if (this.clicksThreadMap.has(nodeId)) {
                    this.clicksThreadMap.get(nodeId).clicks++
                    this.clicksThreadMap.get(nodeId).sync = false
                } else {
                    this.clicksThreadMap.set(nodeId, { clicks: 1, sync: false })
                }
            }
            next()
            this.log.dataAccess(req, res)
        });
        // // 全局检索接口
        // this.app.use("/search", (req, res) => {
        //     let searchList = decodeURIComponent(req.path.slice(1, req.path.length)).split("/")
        //     let search = searchList[0]
        //     if (search.length < 5 || search.length > 20) {
        //         res.send({ code: 401, message: "at least five words and shorter than 20" })
        //     } else {
        //         res.send({ code: 200, data: this.searchContent(search, searchList[1], searchList[2]) })
        //     }
        //     this.log.dataAccess(req, res)
        // });

        // 使用Helmet中间件，增强HTTP头的安全性 *会使文件的跨域失效
        if (this.setting.isHelmet) {
            this.app.use(this.helmet());
        }

        if (this.setting.isLimitRequest) {
            // 添加速率限制
            const limiter = this.rateLimit({
                windowMs: this.setting.windowMs, // 15分钟
                max: this.setting.max // 每个IP最多100个请求
            });
            this.app.use(limiter);
        }
    }
}

module.exports = new DataExpress()