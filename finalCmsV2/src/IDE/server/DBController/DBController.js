/**
 * DBController
 * - 用户索引
 * - token 管理
 * - 轻量级内存鉴权
 */
import fs from "fs"
import path from "path"
import crypto from 'crypto'


const DBController = () => {
    /** ---------------- token 池 ---------------- */
    const tokenPool = {}
    const BaseUrl = process.cwd();
    const TOKEN_EXPIRE_TIME = 2 * 60 * 60 * 1000   // 2 小时
    const TOKEN_IDLE_TIME = 15 * 60 * 1000       // 15 分钟
    const INSPECT_INTERVAL = 30 * 1000            // 30 秒
    /** ---------------- 用户索引 ---------------- */

    async function getDB() {
        const webListPath = path.join(BaseUrl, "IDE", "server", "DBController", "db.json")
        const data = await fs.readFileSync(webListPath, "utf-8")
        return JSON.parse(data)
    }

    async function getWebsiteData(id) {
        const DB = await getDB()
        const target = DB.website.find(item => item.id == id)?.target
        console.log(target);

        if (target == null) return { code: 404, message: "网站不存在" }
        const webListPath = path.join(BaseUrl, "IDE", "server", "webapps", target, "list.json")
        console.log(webListPath);
        let data = []
        try {
            data = await fs.readFileSync(webListPath, "utf-8")
            data = JSON.parse(data)
        } catch (error) {
            console.log("noBaseData initNow")
        }
        return data
    }

    async function updateWebsiteList(data, targetWebsite) {
        try {
            const webListPath = path.join(BaseUrl, "IDE", "server", "webapps", targetWebsite, "list.json")
            let webData = []
            try {
                webData = await fs.readFileSync(webListPath, "utf-8")
                webData = JSON.parse(webData)

                const updateTargetDataById = (list) => {
                    list.forEach(item => {
                        if (item.id == data.id) {
                            for (let key in data) {
                                item[key] = data[key]
                            }
                            return
                        }
                        if (item.children && item.children.length > 0)
                            updateTargetDataById(item.children)
                    })
                }
                updateTargetDataById(webData)
                console.log(webData);

                await fs.writeFileSync(webListPath, JSON.stringify(webData))
            } catch (error) {
                console.log("noBaseData initNow", error)
                return { code: 400, message: error }
            }
        } catch (error) {
            console.log("updateWebsiteData error", error)
            return { code: 400, message: error }
        }
        return { code: 200, message: "success" }
    }



    async function getUserByName(username) {
        const DB = await getDB()
        return DB.user.find(user => user.username == username)
    }

    async function getUserMenuData(userId) {
        let systemMenu = []
        const DB = await getDB()
        const userSystemRole = DB.systemUserRole.filter(item => item.userId == userId)

        userSystemRole.forEach(async role => {
            DB.systemRoleMenu.filter(item => item.roleId == role.roleId).forEach(roleMenu => {
                systemMenu.push(DB.systemMenu.find(item => item.id == roleMenu.menuId))
            })
        })

        systemMenu = [...new Set(systemMenu)]
        const website = []
        let userWebsiteRole = DB.websiteUserRole.filter(item => item.userId == userId)
        userWebsiteRole.forEach(userRole => {
            const websiteRole = DB.websiteRole.find(item => userRole.roleId == item.id)
            const roleWebsite = DB.website.find(web => websiteRole.websiteId == web.id)
            roleWebsite["menu"] = []

            websiteRole.menuIds.forEach(menuId => {
                roleWebsite.menu.push(DB.websiteMenu.find(item => item.id == menuId))
            })
            roleWebsite.menuTemp = [...new Set(roleWebsite.menu)]
            website.push(roleWebsite)
        })

        website.forEach(async website => {
            website.menu = website.menuTemp.filter(item => item.parentId == null)
            website.menu.forEach(item => {
                item.children = website.menuTemp.filter(menu => menu.parentId == item.id)
                if (item.children.length == 0)
                    delete item.children
            })
        })

        return { systemMenu: systemMenu, website: website }
    }




    /** ---------------- token 巡检 ---------------- */
    setInterval(() => {
        const now = Date.now()

        Object.keys(tokenPool).forEach(token => {
            const info = tokenPool[token]

            // 注册时间超过 2 小时
            if (now - info.registerTime > TOKEN_EXPIRE_TIME) {
                delete tokenPool[token]
                return
            }

            // 15 分钟未激活
            if (now - info.activateTime > TOKEN_IDLE_TIME) {
                delete tokenPool[token]
            }
        })
    }, INSPECT_INTERVAL)

    /** ---------------- 注册 token ---------------- */
    function registerToken(user) {

        // 如果该用户已有 token → 覆盖
        Object.keys(tokenPool).forEach(token => {
            if (tokenPool[token].user.username === user.username) {
                delete tokenPool[token]
            }
        })

        const token = stringToHash(
            Date.now().toString(36) + JSON.stringify(user)
        )

        tokenPool[token] = {
            user,
            registerTime: Date.now(),
            activateTime: Date.now()
        }
        return token
    }

    /** ---------------- 校验 token ---------------- */
    function verifyToken(token) {
        const info = tokenPool[token]
        if (!info) return null

        // 刷新活跃时间
        info.activateTime = Date.now()
        return info.user
    }

    /** ---------------- hash ---------------- */
    function stringToHash(str) {
        return crypto
            .createHash('sha256')
            .update(str, 'utf8')
            .digest('hex')
    }

    return {
        getWebsiteData,
        updateWebsiteList,
        getUserMenuData,
        getUserByName,
        registerToken,
        verifyToken
    }
}

export default DBController
