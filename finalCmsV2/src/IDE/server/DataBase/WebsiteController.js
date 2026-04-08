/**
 * DBController
 * 数据库控制器，负责：
 * - 用户索引管理
 * - Token 管理与验证
 * - 轻量级内存鉴权
 * - 网站数据的CRUD操作
 */
import fs from "fs"      // 文件系统模块，用于读写文件
import path from "path"  // 路径模块，用于处理文件路径

/**
 * 创建网站控制器实例
 * @returns {Object} 网站控制器对象，包含各种方法
 */
const WebsiteController = () => {
    /**
     * 项目根路径
     */
    const BaseUrl = process.cwd();

    /**
     * 读取数据库配置文件
     * @returns {Promise<Object>} 数据库配置对象
     */
    async function getDB() {
        const webListPath = path.join(BaseUrl, "IDE", "server", "DataBase", "systemData.json")
        const data = await fs.readFileSync(webListPath, "utf-8")
        return JSON.parse(data)
    }

    /**
     * 获取网站数据
     * @param {string} websiteId 网站ID
     * @returns {Promise<Array|Object>} 网站数据数组或错误对象
     */
    async function getWebsiteData(websiteId, original = false) {
        const DB = await getDB()
        const target = DB.website.find(item => item.id == websiteId)?.target
        if (target == null) return { code: 404, message: "网站不存在" }
        const webListPath = path.join(BaseUrl, "IDE", "server", "webapps", target, "data", "list.json")
        let data = []
        try {
            data = await fs.readFileSync(webListPath, "utf-8")
            data = JSON.parse(data)
            if (!original)
                data = filterTree(data)
        } catch (error) {
            console.log("noBaseData initNow")
        }
        return data
    }

    /**
     * 过滤树结构数据，移除已删除的节点
     * @param {Array} arr 树结构数组
     * @returns {Array} 过滤后的树结构数组
     */
    function filterTree(arr) {
        if (!Array.isArray(arr)) return []

        return arr
            .filter(item => item.delFlag !== 1) // 先过滤当前层，移除已删除的节点
            .map(item => {
                const newItem = { ...item }

                // 递归处理 children（子节点）
                if (Array.isArray(newItem.children)) {
                    newItem.children = filterTree(newItem.children)
                }

                // 处理 nodes（非递归）
                if (Array.isArray(newItem.nodes)) {
                    newItem.nodes = newItem.nodes.filter(n => n.delFlag !== 1)
                }

                return newItem
            })
    }

    /**
     * 写入网站数据
     * @param {Array} data 网站数据
     * @param {string} websiteId 网站ID
     * @returns {Promise<Object>} 操作结果
     */
    async function writeWebsiteData(data, websiteId) {
        const DB = await getDB()
        const target = DB.website.find(item => item.id == websiteId)?.target
        if (target == null) return { code: 404, message: "网站不存在" }
        const webListPath = path.join(BaseUrl, "IDE", "server", "webapps", target, "data", "list.json")
        const webData = sortTree(data)

        await fs.writeFileSync(webListPath, JSON.stringify(webData), { flag: 'w' })
    }
    /**
    * 对树结构数据进行排序（children + nodes）
    * @param {Array} arr 树结构数组
    * @returns {Array}
    */
    function sortTree(arr) {
        if (!Array.isArray(arr)) return []

        return arr
            .map(item => {
                const newItem = { ...item }

                /** ✅ 1. 处理 nodes 排序 */
                if (Array.isArray(newItem.nodes)) {
                    newItem.nodes = [...newItem.nodes].sort((a, b) => {
                        // 防御：top 默认 false
                        const topA = a.top === true
                        const topB = b.top === true

                        // ✅ top 优先
                        if (topA !== topB) {
                            return topB - topA
                        }

                        // ✅ 解析时间字符串（兼容 Safari）
                        const timeA = a.date
                            ? new Date(a.date.replace(/-/g, '/')).getTime()
                            : 0

                        const timeB = b.date
                            ? new Date(b.date.replace(/-/g, '/')).getTime()
                            : 0

                        // ✅ 时间倒序（最新在前）
                        return timeB - timeA
                    })
                }

                /** ✅ 2. 递归 children */
                if (Array.isArray(newItem.children) && newItem.children.length > 0) {
                    newItem.children = sortTree(newItem.children)
                }

                return newItem
            })
            /** ✅ 3. children 自身排序（index） */
            .sort((a, b) => {
                const indexA = a.index ?? 0
                const indexB = b.index ?? 0
                return indexA - indexB
            })
    }

    async function updateWebsiteData(id, websiteId, handel) {
        let webData = await getWebsiteData(websiteId, true)
        const updateTargetDataById = (list) => {
            list.forEach(item => {
                if (item.id == id) {
                    handel(item)
                    return
                }
                if (item.children && item.children.length > 0)
                    updateTargetDataById(item.children)
            })
        }
        updateTargetDataById(webData)
        await writeWebsiteData(webData, websiteId)
    }

    async function deleteWebsiteList(id, websiteId) {
        try {
            updateWebsiteData(id, websiteId, (e) => e.delFlag = 1)
            return { code: 200, message: "success" }
        } catch (error) {
            console.log("noBaseData initNow", error)
            return { code: 400, message: error }
        }
    }



    /**
     * 更新网站列表数据
     * @param {Object} data 要更新的数据
     * @param {string} websiteId 网站ID
     * @returns {Promise<Object>} 操作结果
     */
    async function updateWebsiteList(data, websiteId) {
        try {

            updateWebsiteData(data.id, websiteId, (e) => {
                for (let key in data) {
                    e[key] = data[key]
                }
            })

            return { code: 200, message: "success" }
        } catch (error) {
            console.log("noBaseData initNow", error)
            return { code: 400, message: error }
        }
    }

    /**
     * 创建网站列表数据
     * @param {Object} data 要创建的数据
     * @param {string} websiteId 网站ID
     * @returns {Promise<Object>} 操作结果
     */
    async function createWebsiteList(data, websiteId) {
        try {
            // 如果没有ID，生成一个新的ID
            if (data.id == null) {
                data.id = getListId()
                if (data.children == null)
                    data.children = []
                if (data.nodes == null)
                    data.nodes = []
            }



            // 如果有父ID，添加到指定父节点下
            if (data.parentId != null) {
                /**
                 * 向目标列表添加子节点
                 * @param {Array} list 数据列表
                 */
                updateWebsiteData(data.parentId, websiteId, (e) => {
                    e.children.push(data)
                })
            } else {
                let webData = await getWebsiteData(websiteId, true)
                // 如果没有父ID，添加到根节点
                webData.push(data)
                await writeWebsiteData(webData, websiteId)
            }



            return { code: 200, message: "success" }
        } catch (error) {
            console.log("noBaseData initNow", error)
            return { code: 400, message: error }
        }
    }



    /**
     * 生成列表ID
     * @returns {string} 生成的列表ID
     */
    function getListId() {
        return "l_" + Math.floor(Math.random() * Date.now()).toString(36)
    }
    /**
     * 生成节点ID
     * @returns {string} 生成的节点ID
     */
    function getNodeId() {
        return "n_" + Math.floor(Math.random() * Date.now()).toString(36)
    }
    async function getNodeContent(nodeId, websiteId) {
        const DB = await getDB()
        const target = DB.website.find(item => item.id == websiteId)?.target
        if (target == null) return { code: 404, message: "网站不存在" }
        const webListPath = path.join(BaseUrl, "IDE", "server", "webapps", target, "data", "content", nodeId + ".node")
        if (fs.existsSync(webListPath)) {
            const content = await fs.readFileSync(webListPath, "utf-8")
            return { code: 200, message: "success", data: content }
        } else {
            return { code: 201, message: "success but content file is not exist , save node to create a new file", data: "" }
        }
    }

    async function updateNode(node, websiteId) {
        const DB = await getDB()
        const target = DB.website.find(item => item.id == websiteId)?.target
        if (target == null) return { code: 404, message: "网站不存在" }
        const webListPath = path.join(BaseUrl, "IDE", "server", "webapps", target, "data", "list.json")

        const content = node.content
        delete node.content
        const list = await getWebsiteData(websiteId, true)
        const findNode = (lists, nodeId, handel) => {
            lists.forEach(list => {
                if (list.nodes)
                    list.nodes.forEach(node => {
                        if (node.id == nodeId) {
                            return handel(node, list)
                        }
                    })
                findNode(list.children, nodeId, handel)
            })
        }
        findNode(list, node.id, ((target, list) => {
            for (let key in node) {
                target[key] = node[key]
            }
        }))
        await writeWebsiteData(list, websiteId)

        if (content != null) {
            const fsp = fs.promises
            const webListPath = path.join(BaseUrl, "IDE", "server", "webapps", target, "data", "content", node.id + ".node")

            try {
                // ✅ 1. 确保目录存在
                const dir = path.dirname(webListPath)
                await fsp.mkdir(dir, { recursive: true })

                // ✅ 2. 写文件（不存在会自动创建）
                await fsp.writeFile(webListPath, content)

                return { code: 200, message: "success" }

            } catch (e) {
                console.error(e)
                return { code: 500, message: "写入失败" }
            }
        }

        return { code: 200, message: "success" }
    }


    async function createNode(node, websiteId, listId) {

        const DB = await getDB()
        const target = DB.website.find(item => item.id == websiteId)?.target
        if (target == null) return { code: 404, message: "网站不存在" }
        const webListPath = path.join(BaseUrl, "IDE", "server", "webapps", target, "data", "list.json")
        node.id = getNodeId()
        node.createData = Date.now()
        const content = node.content
        delete node.content
        const list = await getWebsiteData(websiteId, true)
        const findList = (lists, listId, handel) => {
            lists.forEach(list => {
                if (list.id == listId) handel(list)
                findList(list.children, listId, handel)
            })
        }

        findList(list, listId, ((target) => {
            if (target.nodes == null) target.nodes = []
            target.nodes.unshift(node)
        }))

        await writeWebsiteData(list, websiteId)

        if (content != null) {
            const fsp = fs.promises
            const webListPath = path.join(BaseUrl, "IDE", "server", "webapps", target, "data", "content", node.id + ".node")

            try {
                // ✅ 1. 确保目录存在
                const dir = path.dirname(webListPath)
                await fsp.mkdir(dir, { recursive: true })

                // ✅ 2. 写文件（不存在会自动创建）
                await fsp.writeFile(webListPath, content)

                return { code: 200, message: "success" }

            } catch (e) {
                console.error(e)
                return { code: 500, message: "写入失败" }
            }
        }

        return { code: 200, message: "success" }
    }

    async function deleteNode(nodeId, websiteId) {

        const DB = await getDB()
        const target = DB.website.find(item => item.id == websiteId)?.target
        if (target == null) return { code: 404, message: "网站不存在" }
        const webListPath = path.join(BaseUrl, "IDE", "server", "webapps", target, "data", "list.json")

        const list = await getWebsiteData(websiteId, true)
        const findNode = (lists, nodeId, handel) => {
            lists.forEach(list => {
                if (list.nodes)
                    list.nodes.forEach(node => {
                        if (node.id == nodeId) {
                            return handel(node, list)
                        }
                    })
                findNode(list.children, nodeId, handel)
            })
        }
        findNode(list, nodeId, ((target, list) => {
            target.delFlag = 1
            console.log(target);
            console.log(list);
        }))
        await writeWebsiteData(list, websiteId)
        return { code: 200, message: "success" }
    }


    // 返回控制器方法
    return {
        deleteNode,         // 删除节点
        createNode,         // 创建节点
        updateNode,         // 更新节点
        getNodeContent,     // 获取节点内容
        deleteWebsiteList,  // 删除网站列表数据
        createWebsiteList,  // 创建网站列表数据
        getWebsiteData,     // 获取网站数据
        updateWebsiteList   // 更新网站列表数据
    }
}

export default WebsiteController()
