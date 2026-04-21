/**
 * SystemController
 * 数据库控制器，负责：
 * - 用户索引管理
 * - Token 管理与验证
 * - 轻量级内存鉴权
 * - 网站数据的 CRUD 操作
 */
import fs from "fs"
import path from "path"
import crypto from 'crypto'
import { formatTimestamp } from "../utils/timeUtils.js"

const SystemController = () => {
    const tokenPool = {}
    const BaseUrl = process.cwd()
    const TOKEN_EXPIRE_TIME = 2 * 60 * 60 * 1000
    const TOKEN_IDLE_TIME = 15 * 60 * 1000
    const INSPECT_INTERVAL = 30 * 1000

    async function getDB() {
        const webListPath = path.join(BaseUrl, "IDE", "server", "DataBase", "systemData.json")
        const data = fs.readFileSync(webListPath, "utf-8")
        return JSON.parse(data)
    }

    async function getUserByName(username) {
        const DB = await getDB()
        const user = DB.user.find(user => user.username == username)
        delete user.password
        return user
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

        // 过滤掉停用的菜单
        systemMenu = systemMenu.filter(menu => menu && menu.status !== false)

        const website = []
        const userWebsiteRole = DB.websiteUserRole.filter(item => item.userId == userId)

        // 遍历所有站点
        DB.website.forEach(roleWebsite => {
            // 过滤掉停用的站点
            if (roleWebsite.status === false) return

            // 克隆站点对象，避免修改原数据
            const websiteData = JSON.parse(JSON.stringify(roleWebsite))
            websiteData.menu = []

            // 检查是否是默认管理员
            if (websiteData.defaultAdmin == userId) {
                // 默认管理员拥有全部站点菜单权限
                websiteData.menu = DB.websiteMenu.filter(m => m.status)
                websiteData.menuTemp = websiteData.menu
                website.push(websiteData)
            } else {
                // 查出当前网站下该用户的所有角色
                const userRolesForThisSite = userWebsiteRole.filter(ur => {
                    const role = DB.websiteRole.find(r => r.id == ur.roleId)
                    return role && role.websiteId == websiteData.id
                })

                if (userRolesForThisSite.length > 0) {
                    userRolesForThisSite.forEach(userRole => {
                        const websiteRole = DB.websiteRole.find(item => item.id == userRole.roleId)
                        if (!websiteRole) return

                        websiteRole.menuIds.forEach(menuId => {
                            const menu = DB.websiteMenu.find(item => item.id == menuId)
                            if (menu && menu.status) {
                                websiteData.menu.push(menu)
                            }
                        })
                    })

                    // 去重（按对象引用去重可能不稳定，建议按 id）
                    websiteData.menuTemp = Array.from(
                        new Map(websiteData.menu.map(m => [m.id, m])).values()
                    )

                    website.push(websiteData)
                }
                // 如果既不是 defaultAdmin 也没有角色，不添加到结果中
            }
        })

        website.forEach(async website => {
            website.menu = website.menuTemp.filter(item => item.parentId == null)
            website.menu.forEach(item => {
                item.children = website.menuTemp.filter(menu => menu.parentId == item.id)
                if (item.children.length == 0)
                    delete item.children
            })
            delete website.menuTemp
        })

        return { systemMenu: systemMenu, website: website }
    }

    setInterval(() => {
        const now = Date.now()

        Object.keys(tokenPool).forEach(token => {
            const info = tokenPool[token]

            if (now - info.registerTime > TOKEN_EXPIRE_TIME) {
                delete tokenPool[token]
                return
            }

            if (now - info.activateTime > TOKEN_IDLE_TIME) {
                delete tokenPool[token]
            }
        })
    }, INSPECT_INTERVAL)

    function registerToken(user) {
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

    function verifyToken(token) {
        const info = tokenPool[token]

        if (!info) return null

        info.activateTime = Date.now()
        return info.user
    }

    function stringToHash(str) {
        return crypto
            .createHash('sha256')
            .update(str, 'utf8')
            .digest('hex')
    }

    function generateUserId() {
        return "u_" + Math.floor(Math.random() * Date.now()).toString(36)
    }

    async function getUserList() {
        const DB = await getDB()
        const userList = DB.user || []
        userList.forEach(user => {
            delete user.password
        })
        return userList
    }

    async function createUser(userData, creator) {
        const DB = await getDB()

        const existingUser = DB.user.find(u => u.username === userData.username)
        if (existingUser) {
            return { code: 400, message: "用户名已存在" }
        }

        const newUser = {
            id: generateUserId(),
            username: userData.username,
            password: stringToHash(userData.password),
            status: userData.status !== undefined ? userData.status : 1,
            createTime: formatTimestamp(new Date()),
            createBy: creator.username,
            updateTime: formatTimestamp(new Date()),
            updateBy: creator.username
        }

        DB.user.push(newUser)

        const webListPath = path.join(BaseUrl, "IDE", "server", "DataBase", "systemData.json")
        fs.writeFileSync(webListPath, JSON.stringify(DB, null, 4))

        return { code: 200, message: "创建成功", data: { id: newUser.id } }
    }

    async function updateUser(userData, modifier) {
        const DB = await getDB()

        const userIndex = DB.user.findIndex(u => u.id === userData.id)
        if (userIndex === -1) {
            return { code: 404, message: "用户不存在" }
        }

        const user = DB.user[userIndex]

        user.username = userData.username !== undefined ? userData.username : user.username
        if (userData.password !== undefined && userData.password !== '') {
            user.password = stringToHash(userData.password)
        }
        user.status = userData.status !== undefined ? userData.status : user.status
        user.updateTime = formatTimestamp(new Date())
        user.updateBy = modifier.username

        DB.user[userIndex] = user

        const webListPath = path.join(BaseUrl, "IDE", "server", "DataBase", "systemData.json")
        fs.writeFileSync(webListPath, JSON.stringify(DB, null, 4))

        return { code: 200, message: "更新成功" }
    }

    async function deleteUser(userId) {
        const DB = await getDB()

        const userIndex = DB.user.findIndex(u => u.id === userId)
        if (userIndex === -1) {
            return { code: 404, message: "用户不存在" }
        }

        DB.user.splice(userIndex, 1)

        const webListPath = path.join(BaseUrl, "IDE", "server", "DataBase", "systemData.json")
        fs.writeFileSync(webListPath, JSON.stringify(DB, null, 4))

        return { code: 200, message: "删除成功" }
    }

    async function changePassword(userId, oldPassword, newPassword, modifier) {
        const DB = await getDB()

        const userIndex = DB.user.findIndex(u => u.id === userId)
        if (userIndex === -1) {
            return { code: 404, message: "用户不存在" }
        }

        const user = DB.user[userIndex]
        const oldPasswordHash = stringToHash(oldPassword)

        if (user.password !== oldPasswordHash) {
            return { code: 400, message: "原密码错误" }
        }

        user.password = stringToHash(newPassword)
        user.updateTime = formatTimestamp(new Date())
        user.updateBy = modifier.username

        const webListPath = path.join(BaseUrl, "IDE", "server", "DataBase", "systemData.json")
        fs.writeFileSync(webListPath, JSON.stringify(DB, null, 4))

        return { code: 200, message: "密码修改成功" }
    }

    function generateMenuId() {
        return "m_" + Math.floor(Math.random() * Date.now()).toString(36)
    }

    async function getSystemMenuList() {
        const DB = await getDB()
        return DB.systemMenu || []
    }

    async function createSystemMenu(menuData, creator) {
        const DB = await getDB()

        const existingMenu = DB.systemMenu.find(m => m.target === menuData.target)
        if (existingMenu) {
            return { code: 400, message: "目标路由已存在" }
        }

        const newMenu = {
            id: generateMenuId(),
            name: menuData.name,
            icon: menuData.icon,
            target: menuData.target,
            status: menuData.status !== undefined ? menuData.status : 1,
            createTime: formatTimestamp(new Date()),
            createBy: creator.username,
            updateTime: formatTimestamp(new Date()),
            updateBy: creator.username
        }

        DB.systemMenu.push(newMenu)

        const webListPath = path.join(BaseUrl, "IDE", "server", "DataBase", "systemData.json")
        fs.writeFileSync(webListPath, JSON.stringify(DB, null, 4))

        return { code: 200, message: "创建成功", data: { id: newMenu.id } }
    }

    async function updateSystemMenu(menuData, modifier) {
        const DB = await getDB()

        const menuIndex = DB.systemMenu.findIndex(m => m.id === menuData.id)
        if (menuIndex === -1) {
            return { code: 404, message: "菜单不存在" }
        }

        const menu = DB.systemMenu[menuIndex]

        menu.name = menuData.name !== undefined ? menuData.name : menu.name
        menu.icon = menuData.icon !== undefined ? menuData.icon : menu.icon
        menu.target = menuData.target !== undefined ? menuData.target : menu.target
        menu.status = menuData.status !== undefined ? menuData.status : menu.status
        menu.updateTime = formatTimestamp(new Date())
        menu.updateBy = modifier.username

        DB.systemMenu[menuIndex] = menu

        const webListPath = path.join(BaseUrl, "IDE", "server", "DataBase", "systemData.json")
        fs.writeFileSync(webListPath, JSON.stringify(DB, null, 4))

        return { code: 200, message: "更新成功" }
    }

    async function deleteSystemMenu(menuId) {
        const DB = await getDB()

        const menuIndex = DB.systemMenu.findIndex(m => m.id === menuId)
        if (menuIndex === -1) {
            return { code: 404, message: "菜单不存在" }
        }

        DB.systemMenu.splice(menuIndex, 1)

        const webListPath = path.join(BaseUrl, "IDE", "server", "DataBase", "systemData.json")
        fs.writeFileSync(webListPath, JSON.stringify(DB, null, 4))

        return { code: 200, message: "删除成功" }
    }

    // ==================== 角色管理 ====================

    function generateRoleId() {
        return "r_" + Math.floor(Math.random() * Date.now()).toString(36)
    }

    async function getRoleList() {
        const DB = await getDB()
        return DB.systemRole || []
    }

    async function createRole(roleData, creator) {
        const DB = await getDB()

        const existingRole = DB.systemRole.find(r => r.name === roleData.name)
        if (existingRole) {
            return { code: 400, message: "角色名称已存在" }
        }

        const newRole = {
            id: generateRoleId(),
            name: roleData.name,
            description: roleData.description || "",
            status: roleData.status !== undefined ? roleData.status : true,
            createTime: formatTimestamp(new Date()),
            createBy: creator.username,
            updateTime: formatTimestamp(new Date()),
            updateBy: creator.username
        }

        DB.systemRole.push(newRole)

        const webListPath = path.join(BaseUrl, "IDE", "server", "DataBase", "systemData.json")
        fs.writeFileSync(webListPath, JSON.stringify(DB, null, 4))

        return { code: 200, message: "创建成功", data: { id: newRole.id } }
    }

    async function createWebsiteRole(roleData, creator) {
        const DB = await getDB()

        const existingRole = DB.websiteRole.find(r => r.name === roleData.name && r.websiteId === roleData.websiteId)
        if (existingRole) {
            return { code: 400, message: "角色名称已存在" }
        }

        const newRole = {
            id: generateRoleId(),
            name: roleData.name,
            websiteId: roleData.websiteId,
            description: roleData.description || "",
            status: roleData.status !== undefined ? roleData.status : true,
            createTime: formatTimestamp(new Date()),
            createBy: creator.username,
            updateTime: formatTimestamp(new Date()),
            updateBy: creator.username,
            menuIds: []
        }

        DB.websiteRole.push(newRole)

        const webListPath = path.join(BaseUrl, "IDE", "server", "DataBase", "systemData.json")
        fs.writeFileSync(webListPath, JSON.stringify(DB, null, 4))

        return { code: 200, message: "创建成功", data: { id: newRole.id } }
    }

    async function updateRole(roleData, modifier) {
        const DB = await getDB()

        const roleIndex = DB.systemRole.findIndex(r => r.id === roleData.id)
        if (roleIndex === -1) {
            return { code: 404, message: "角色不存在" }
        }

        const role = DB.systemRole[roleIndex]

        role.name = roleData.name !== undefined ? roleData.name : role.name
        role.description = roleData.description !== undefined ? roleData.description : role.description
        role.status = roleData.status !== undefined ? roleData.status : role.status
        role.updateTime = formatTimestamp(new Date())
        role.updateBy = modifier.username

        DB.systemRole[roleIndex] = role

        const webListPath = path.join(BaseUrl, "IDE", "server", "DataBase", "systemData.json")
        fs.writeFileSync(webListPath, JSON.stringify(DB, null, 4))

        return { code: 200, message: "更新成功" }
    }



    async function updateWebsiteRole(roleData, modifier) {
        const DB = await getDB()
        const roleIndex = DB.websiteRole.findIndex(r => r.id === roleData.id)
        if (roleIndex === -1) {
            return { code: 404, message: "角色不存在" }
        }

        const role = DB.websiteRole[roleIndex]

        role.name = roleData.name !== undefined ? roleData.name : role.name
        role.description = roleData.description !== undefined ? roleData.description : role.description
        role.status = roleData.status !== undefined ? roleData.status : role.status
        role.updateTime = formatTimestamp(new Date())
        role.updateBy = modifier.username

        DB.websiteRole[roleIndex] = role

        const webListPath = path.join(BaseUrl, "IDE", "server", "DataBase", "systemData.json")
        fs.writeFileSync(webListPath, JSON.stringify(DB, null, 4))

        return { code: 200, message: "更新成功" }
    }


    async function deleteRole(roleId) {
        const DB = await getDB()

        const roleIndex = DB.systemRole.findIndex(r => r.id === roleId)
        if (roleIndex === -1) {
            return { code: 404, message: "角色不存在" }
        }

        // 删除角色关联的菜单权限
        DB.systemRoleMenu = DB.systemRoleMenu.filter(item => item.roleId !== roleId)

        // 删除角色关联的用户关系
        DB.systemUserRole = DB.systemUserRole.filter(item => item.roleId !== roleId)

        DB.systemRole.splice(roleIndex, 1)

        const webListPath = path.join(BaseUrl, "IDE", "server", "DataBase", "systemData.json")
        fs.writeFileSync(webListPath, JSON.stringify(DB, null, 4))

        return { code: 200, message: "删除成功" }
    }
    async function deleteWebsiteRole(roleId) {
        const DB = await getDB()

        const roleIndex = DB.websiteRole.findIndex(r => r.id === roleId)
        if (roleIndex === -1) {
            return { code: 404, message: "角色不存在" }
        }

        // 删除角色关联的用户关系
        DB.websiteUserRole = DB.websiteUserRole.filter(item => item.roleId !== roleId)

        DB.websiteRole.splice(roleIndex, 1)

        const webListPath = path.join(BaseUrl, "IDE", "server", "DataBase", "systemData.json")
        fs.writeFileSync(webListPath, JSON.stringify(DB, null, 4))

        return { code: 200, message: "删除成功" }
    }



    async function getRoleMenu(roleId) {
        const DB = await getDB()
        const roleMenus = DB.systemRoleMenu.filter(item => item.roleId === roleId)
        const menuIds = roleMenus.map(item => item.menuId)
        return { code: 200, data: menuIds }
    }

    async function saveRoleMenu(roleId, menuIds, modifier) {
        const DB = await getDB()

        // 删除该角色的所有菜单权限
        DB.systemRoleMenu = DB.systemRoleMenu.filter(item => item.roleId !== roleId)

        // 添加新的菜单权限
        menuIds.forEach(menuId => {
            DB.systemRoleMenu.push({
                roleId: roleId,
                menuId: menuId
            })
        })

        const webListPath = path.join(BaseUrl, "IDE", "server", "DataBase", "systemData.json")
        fs.writeFileSync(webListPath, JSON.stringify(DB, null, 4))

        return { code: 200, message: "保存成功" }
    }
    async function saveWebsiteRoleMenu(roleId, menuIds, modifier) {
        const DB = await getDB()
        const role = DB.websiteRole.find(r => r.id === roleId)
        if (!role) {
            return { code: 404, message: "角色不存在" }
        }
        role.menuIds = menuIds
        role.updateTime = formatTimestamp(new Date())
        role.updateBy = modifier.username
        const webListPath = path.join(BaseUrl, "IDE", "server", "DataBase", "systemData.json")
        fs.writeFileSync(webListPath, JSON.stringify(DB, null, 4))

        return { code: 200, message: "保存成功" }
    }
    async function getRoleUsers(roleId) {
        const DB = await getDB()
        const roleUsers = DB.systemUserRole.filter(item => item.roleId === roleId)
        const userIds = roleUsers.map(item => item.userId)
        const users = DB.user.filter(user => userIds.includes(user.id))
        return { code: 200, data: users }
    }

    async function saveRoleUsers(roleId, userIds, modifier) {
        const DB = await getDB()

        // 删除该角色的所有用户关系
        DB.systemUserRole = DB.systemUserRole.filter(item => item.roleId !== roleId)

        // 添加新的用户关系
        userIds.forEach(userId => {
            DB.systemUserRole.push({
                userId: userId,
                roleId: roleId
            })
        })

        const webListPath = path.join(BaseUrl, "IDE", "server", "DataBase", "systemData.json")
        fs.writeFileSync(webListPath, JSON.stringify(DB, null, 4))

        return { code: 200, message: "保存成功" }
    }

    // 获取用户的角色列表
    async function getUserRoles(userId) {
        const DB = await getDB()
        const userRoles = DB.systemUserRole.filter(item => item.userId === userId)
        const roleIds = userRoles.map(item => item.roleId)
        const roles = DB.systemRole.filter(role => roleIds.includes(role.id))
        return { code: 200, data: roles }
    }

    // 保存用户的角色关系（通过 userId）
    async function saveUserRoles(userId, roleIds, modifier) {
        const DB = await getDB()

        // 删除该用户的所有角色关系
        DB.systemUserRole = DB.systemUserRole.filter(item => item.userId !== userId)

        // 添加新的角色关系
        roleIds.forEach(roleId => {
            DB.systemUserRole.push({
                userId: userId,
                roleId: roleId
            })
        })

        const webListPath = path.join(BaseUrl, "IDE", "server", "DataBase", "systemData.json")
        fs.writeFileSync(webListPath, JSON.stringify(DB, null, 4))

        return { code: 200, message: "保存成功" }
    }

    // ==================== 网站菜单管理 ====================

    function generateWebsiteMenuId() {
        return "wm_" + Math.floor(Math.random() * Date.now()).toString(36)
    }

    function generateWebsiteId() {
        return "w_" + Math.floor(Math.random() * Date.now()).toString(36)
    }

    async function getWebsiteList() {
        const DB = await getDB()
        return DB.website || []
    }

    async function getWebsiteMenuList() {
        const DB = await getDB()

        return DB.websiteMenu
    }

    async function createWebsiteMenu(menuData, creator) {
        const DB = await getDB()

        // 检查目标路由是否已存在（只有当提供了 target 时才检查）
        if (menuData.target) {
            const existingMenu = DB.websiteMenu.find(m => m.target === menuData.target)
            if (existingMenu) {
                return { code: 400, message: "目标路由已存在" }
            }
        }

        const newMenu = {
            id: generateWebsiteMenuId(),
            name: menuData.name,
            icon: menuData.icon,
            target: menuData.target,
            parentId: menuData.parentId || null,
            status: menuData.status !== undefined ? menuData.status : true,
            createTime: formatTimestamp(new Date()),
            createBy: creator.username,
            updateTime: formatTimestamp(new Date()),
            updateBy: creator.username
        }

        DB.websiteMenu.push(newMenu)

        const webListPath = path.join(BaseUrl, "IDE", "server", "DataBase", "systemData.json")
        fs.writeFileSync(webListPath, JSON.stringify(DB, null, 4))

        return { code: 200, message: "创建成功", data: { id: newMenu.id } }
    }

    async function updateWebsiteMenu(menuData, modifier) {
        const DB = await getDB()

        const menuIndex = DB.websiteMenu.findIndex(m => m.id === menuData.id)
        if (menuIndex === -1) {
            return { code: 404, message: "菜单不存在" }
        }

        const menu = DB.websiteMenu[menuIndex]

        menu.name = menuData.name !== undefined ? menuData.name : menu.name
        menu.icon = menuData.icon !== undefined ? menuData.icon : menu.icon
        menu.target = menuData.target !== undefined ? menuData.target : menu.target
        menu.parentId = menuData.parentId !== undefined ? menuData.parentId : menu.parentId
        menu.status = menuData.status !== undefined ? menuData.status : menu.status
        menu.updateTime = formatTimestamp(new Date())
        menu.updateBy = modifier.username

        DB.websiteMenu[menuIndex] = menu

        const webListPath = path.join(BaseUrl, "IDE", "server", "DataBase", "systemData.json")
        fs.writeFileSync(webListPath, JSON.stringify(DB, null, 4))

        return { code: 200, message: "更新成功" }
    }

    async function deleteWebsiteMenu(menuId) {
        const DB = await getDB()

        const menuIndex = DB.websiteMenu.findIndex(m => m.id === menuId)
        if (menuIndex === -1) {
            return { code: 404, message: "菜单不存在" }
        }

        // 从所有 websiteRole 中移除该菜单
        DB.websiteRole.forEach(role => {
            if (role.menuIds) {
                role.menuIds = role.menuIds.filter(id => id !== menuId)
            }
        })

        DB.websiteMenu.splice(menuIndex, 1)

        const webListPath = path.join(BaseUrl, "IDE", "server", "DataBase", "systemData.json")
        fs.writeFileSync(webListPath, JSON.stringify(DB, null, 4))

        return { code: 200, message: "删除成功" }
    }

    async function getWebsiteRoleList(websiteId) {
        const DB = await getDB()

        const role = DB.websiteRole.filter(r => r.websiteId === websiteId && r.status === true)

        return { code: 200, data: role }
    }

    async function getUserWebsiteRoles(userId, websiteId) {
        const DB = await getDB()
        const websiteRoleIds = DB.websiteRole.filter(r => r.websiteId === websiteId && r.status === true).map(r => r.id)

        const roles = DB.websiteUserRole.filter(r => r.userId === userId && websiteRoleIds.includes(r.roleId))

        return { code: 200, data: roles || [] }
    }

    async function saveUserWebsiteRoles(userId, websiteId, roleIds) {
        const DB = await getDB()
        const websiteRoleIds = DB.websiteRole.filter(r => r.websiteId == websiteId && r.status == true).map(r => r.id)
        const websiteUserRole = DB.websiteUserRole.filter(item => !(item.userId == userId && websiteRoleIds.includes(item.roleId)))
        roleIds.forEach(item => {
            websiteUserRole.push({ userId: userId, roleId: item })
        })

        DB.websiteUserRole = websiteUserRole

        const webListPath = path.join(BaseUrl, "IDE", "server", "DataBase", "systemData.json")
        fs.writeFileSync(webListPath, JSON.stringify(DB, null, 4))

        return { code: 200, message: "已保存" }
    }




    async function getWebsiteMenuTree() {
        const DB = await getDB()
        let menus = DB.websiteMenu || []

        // 构建树形结构
        const rootMenus = menus.filter(item => !item.parentId)
        const childrenMenus = menus.filter(item => item.parentId)

        rootMenus.forEach(item => {
            item.children = childrenMenus.filter(menu => menu.parentId == item.id)
            if (item.children.length === 0) {
                delete item.children
            }
        })

        return rootMenus
    }

    return {
        getUserMenuData,
        getUserByName,
        getUserList,
        createUser,
        updateUser,
        deleteUser,
        changePassword,
        getSystemMenuList,
        createSystemMenu,
        updateSystemMenu,
        deleteSystemMenu,
        getRoleList,
        createRole,
        updateRole,
        deleteRole,
        getRoleMenu,
        saveRoleMenu,
        getRoleUsers,
        saveRoleUsers,
        getUserRoles,
        saveUserRoles,
        getWebsiteList,
        getWebsiteMenuList,
        createWebsiteMenu,
        updateWebsiteMenu,
        deleteWebsiteMenu,
        getWebsiteMenuTree,
        registerToken,
        verifyToken,
        getDB,
        generateWebsiteId,
        updateWebsiteRole,
        createWebsiteRole,
        deleteWebsiteRole,
        saveWebsiteRoleMenu,
        getWebsiteRoleList,
        getUserWebsiteRoles,
        saveUserWebsiteRoles
    }
}

export default SystemController()
