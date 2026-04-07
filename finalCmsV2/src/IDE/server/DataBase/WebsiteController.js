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
    async function getWebsiteData(websiteId) {
        const DB = await getDB()
        const target = DB.website.find(item => item.id == websiteId)?.target
        if (target == null) return { code: 404, message: "网站不存在" }
        const webListPath = path.join(BaseUrl, "IDE", "server", "webapps", target, "list.json")
        let data = []
        try {
            data = await fs.readFileSync(webListPath, "utf-8")
            data = JSON.parse(data)
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
        const webListPath = path.join(BaseUrl, "IDE", "server", "webapps", target, "list.json")
        const webData = sortTree(data)
        await fs.writeFileSync(webListPath, JSON.stringify(data))
    }


    async function updateWebsiteData(id, websiteId, handel) {
        let webData = await getWebsiteData(websiteId)
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
                let webData = await getWebsiteData(websiteId)
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
     * 对树结构数据进行排序
     * @param {Array} arr 树结构数组
     * @returns {Array} 排序后的树结构数组
     */
    function sortTree(arr) {
        if (!Array.isArray(arr)) return []

        return arr
            .map(item => {
                // 深拷贝（避免污染原数据）
                const newItem = { ...item }

                // 递归处理 children
                if (Array.isArray(newItem.children) && newItem.children.length > 0) {
                    newItem.children = sortTree(newItem.children)
                }

                return newItem
            })
            .sort((a, b) => {
                const indexA = a.index ?? 0
                const indexB = b.index ?? 0
                return indexA - indexB
            })
    }

    /**
     * 生成列表ID
     * @returns {string} 生成的列表ID
     */
    function getListId() {
        return "l_" + (Date.now() + (Math.floor(Math.random() * 100))).toString(36)
    }


    // 返回控制器方法
    return {
        deleteWebsiteList, // 删除网站列表数据
        createWebsiteList,  // 创建网站列表数据
        getWebsiteData,     // 获取网站数据
        updateWebsiteList  // 更新网站列表数据
    }
}

export default WebsiteController()
