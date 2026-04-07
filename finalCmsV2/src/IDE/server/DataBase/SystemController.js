/**
 * SystemController
 * 数据库控制器，负责：
 * - 用户索引管理
 * - Token 管理与验证
 * - 轻量级内存鉴权
 * - 网站数据的CRUD操作
 */
import fs from "fs"      // 文件系统模块，用于读写文件
import path from "path"  // 路径模块，用于处理文件路径
import crypto from 'crypto'  // 加密模块，用于生成token哈希
/**
 * 创建数据库控制器实例
 * @returns {Object} 数据库控制器对象，包含各种方法
 */
const SystemController = () => {
    /**
     * token 池，用于存储用户token信息
     * 结构: { token: { user, registerTime, activateTime } }
     */
    const tokenPool = {}

    /**
     * 项目根路径
     */
    const BaseUrl = process.cwd();

    /**
     * Token 过期时间：2小时
     */
    const TOKEN_EXPIRE_TIME = 2 * 60 * 60 * 1000   // 2 小时

    /**
     * Token 空闲时间：15分钟
     */
    const TOKEN_IDLE_TIME = 15 * 60 * 1000       // 15 分钟

    /**
     * Token 巡检间隔：30秒
     */
    const INSPECT_INTERVAL = 30 * 1000            // 30 秒

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
     * 根据用户名获取用户信息
     * @param {string} username 用户名
     * @returns {Promise<Object|null>} 用户信息或null
     */
    async function getUserByName(username) {
        const DB = await getDB()
        return DB.user.find(user => user.username == username)
    }

    /**
     * 获取用户菜单数据
     * @param {string} userId 用户ID
     * @returns {Promise<Object>} 包含系统菜单和网站菜单的对象
     */
    async function getUserMenuData(userId) {
        let systemMenu = []
        const DB = await getDB()
        const userSystemRole = DB.systemUserRole.filter(item => item.userId == userId)

        // 获取用户的系统角色对应的菜单
        userSystemRole.forEach(async role => {
            DB.systemRoleMenu.filter(item => item.roleId == role.roleId).forEach(roleMenu => {
                systemMenu.push(DB.systemMenu.find(item => item.id == roleMenu.menuId))
            })
        })

        // 去重
        systemMenu = [...new Set(systemMenu)]

        const website = []
        let userWebsiteRole = DB.websiteUserRole.filter(item => item.userId == userId)

        // 获取用户的网站角色对应的菜单
        userWebsiteRole.forEach(userRole => {
            const websiteRole = DB.websiteRole.find(item => userRole.roleId == item.id)
            const roleWebsite = DB.website.find(web => websiteRole.websiteId == web.id)
            roleWebsite["menu"] = []

            websiteRole.menuIds.forEach(menuId => {
                roleWebsite.menu.push(DB.websiteMenu.find(item => item.id == menuId))
            })

            // 去重
            roleWebsite.menuTemp = [...new Set(roleWebsite.menu)]
            website.push(roleWebsite)
        })

        // 构建网站菜单的层级结构
        website.forEach(async website => {
            // 获取父菜单
            website.menu = website.menuTemp.filter(item => item.parentId == null)

            // 获取子菜单
            website.menu.forEach(item => {
                item.children = website.menuTemp.filter(menu => menu.parentId == item.id)
                if (item.children.length == 0)
                    delete item.children
            })
        })

        return { systemMenu: systemMenu, website: website }
    }

    /**
     * Token 巡检，定期清理过期或空闲的token
     */
    setInterval(() => {
        const now = Date.now()

        Object.keys(tokenPool).forEach(token => {
            const info = tokenPool[token]

            // 注册时间超过 2 小时，删除token
            if (now - info.registerTime > TOKEN_EXPIRE_TIME) {
                delete tokenPool[token]
                return
            }

            // 15 分钟未激活，删除token
            if (now - info.activateTime > TOKEN_IDLE_TIME) {
                delete tokenPool[token]
            }
        })
    }, INSPECT_INTERVAL)

    /**
     * 注册 token
     * @param {Object} user 用户信息
     * @returns {string} 生成的token
     */
    function registerToken(user) {

        // 如果该用户已有 token → 覆盖
        Object.keys(tokenPool).forEach(token => {
            if (tokenPool[token].user.username === user.username) {
                delete tokenPool[token]
            }
        })

        // 生成新token
        const token = stringToHash(
            Date.now().toString(36) + JSON.stringify(user)
        )

        // 存储token信息
        tokenPool[token] = {
            user,
            registerTime: Date.now(),
            activateTime: Date.now()
        }
        return token
    }

    /**
     * 校验 token
     * @param {string} token 要校验的token
     * @returns {Object|null} 用户信息或null
     */
    function verifyToken(token) {
        const info = tokenPool[token]
        if (!info) return null

        // 刷新活跃时间
        info.activateTime = Date.now()
        return info.user
    }

    /**
     * 将字符串转换为哈希值
     * @param {string} str 要转换的字符串
     * @returns {string} 哈希值
     */
    function stringToHash(str) {
        return crypto
            .createHash('sha256')
            .update(str, 'utf8')
            .digest('hex')
    }

    // 返回控制器方法
    return {
        getUserMenuData,    // 获取用户菜单数据
        getUserByName,      // 根据用户名获取用户信息
        registerToken,      // 注册token
        verifyToken         // 校验token
    }
}

export default SystemController()