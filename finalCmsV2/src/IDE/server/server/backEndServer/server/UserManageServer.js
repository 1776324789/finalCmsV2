import SystemController from '../../../DataBase/SystemController.js'

const UserManageServer = (app) => {
    // 获取用户列表
    app.tokenPost("/getUserList", async (req, res, user) => {
        const userList = await SystemController.getUserList()
        return res.json({ code: 200, data: userList })
    })

    // 创建用户
    app.tokenPost("/createUser", async (req, res, user) => {
        const { username, password } = req.body

        if (!username || !password) {
            return res.json({ code: 400, message: "用户名和密码不能为空" })
        }

        const result = await SystemController.createUser(
            { username, password },
            user
        )
        return res.json(result)
    })

    // 更新用户
    app.tokenPost("/updateUser", async (req, res, user) => {
        const { id, username, password, status } = req.body

        if (!id) {
            return res.json({ code: 400, message: "用户 ID 不能为空" })
        }

        const result = await SystemController.updateUser(
            { id, username, password, status },
            user
        )
        return res.json(result)
    })

    // 删除用户
    app.tokenPost("/deleteUser", async (req, res, user) => {
        const { id } = req.body

        if (!id) {
            return res.json({ code: 400, message: "用户 ID 不能为空" })
        }

        const result = await SystemController.deleteUser(id)
        return res.json(result)
    })

    // 修改密码
    app.tokenPost("/changePassword", async (req, res, user) => {
        const { userId, oldPassword, newPassword } = req.body

        if (!userId || !oldPassword || !newPassword) {
            return res.json({ code: 400, message: "参数不能为空" })
        }

        const result = await SystemController.changePassword(
            userId,
            oldPassword,
            newPassword,
            user
        )
        return res.json(result)
    })

    // 获取系统菜单列表
    app.tokenPost("/getSystemMenuList", async (req, res, user) => {
        const menuList = await SystemController.getSystemMenuList()
        return res.json({ code: 200, data: menuList })
    })

    // 创建系统菜单
    app.tokenPost("/createSystemMenu", async (req, res, user) => {
        const { name, icon, target, status } = req.body

        if (!name || !icon || !target) {
            return res.json({ code: 400, message: "名称、图标和目标路由不能为空" })
        }

        const result = await SystemController.createSystemMenu(
            { name, icon, target, status },
            user
        )
        return res.json(result)
    })

    // 更新系统菜单
    app.tokenPost("/updateSystemMenu", async (req, res, user) => {
        const { id, name, icon, target, status } = req.body

        if (!id) {
            return res.json({ code: 400, message: "菜单 ID 不能为空" })
        }

        const result = await SystemController.updateSystemMenu(
            { id, name, icon, target, status },
            user
        )
        return res.json(result)
    })

    // 删除系统菜单
    app.tokenPost("/deleteSystemMenu", async (req, res, user) => {
        const { id } = req.body

        if (!id) {
            return res.json({ code: 400, message: "菜单 ID 不能为空" })
        }

        const result = await SystemController.deleteSystemMenu(id)
        return res.json(result)
    })

    // ==================== 角色管理 ====================

    // 获取角色列表
    app.tokenPost("/getRoleList", async (req, res, user) => {
        const roleList = await SystemController.getRoleList()
        return res.json({ code: 200, data: roleList })
    })

    // 创建角色
    app.tokenPost("/createRole", async (req, res, user) => {
        const { name, description, status } = req.body

        if (!name) {
            return res.json({ code: 400, message: "角色名称不能为空" })
        }

        const result = await SystemController.createRole(
            { name, description, status },
            user
        )
        return res.json(result)
    })

    // 更新角色
    app.tokenPost("/updateRole", async (req, res, user) => {
        const { id, name, description, status } = req.body

        if (!id) {
            return res.json({ code: 400, message: "角色 ID 不能为空" })
        }

        const result = await SystemController.updateRole(
            { id, name, description, status },
            user
        )
        return res.json(result)
    })

    // 删除角色
    app.tokenPost("/deleteRole", async (req, res, user) => {
        const { id } = req.body

        if (!id) {
            return res.json({ code: 400, message: "角色 ID 不能为空" })
        }

        const result = await SystemController.deleteRole(id)
        return res.json(result)
    })

    // 获取角色菜单权限
    app.tokenPost("/getRoleMenu", async (req, res, user) => {
        const { roleId } = req.body

        if (!roleId) {
            return res.json({ code: 400, message: "角色 ID 不能为空" })
        }

        const result = await SystemController.getRoleMenu(roleId)
        return res.json(result)
    })

    // 保存角色菜单权限
    app.tokenPost("/saveRoleMenu", async (req, res, user) => {
        const { roleId, menuIds } = req.body

        if (!roleId || !menuIds) {
            return res.json({ code: 400, message: "参数不能为空" })
        }

        const result = await SystemController.saveRoleMenu(roleId, menuIds, user)
        return res.json(result)
    })

    // 获取角色下的用户
    app.tokenPost("/getRoleUsers", async (req, res, user) => {
        const { roleId } = req.body

        if (!roleId) {
            return res.json({ code: 400, message: "角色 ID 不能为空" })
        }

        const result = await SystemController.getRoleUsers(roleId)
        return res.json(result)
    })

    // 保存角色用户关系
    app.tokenPost("/saveRoleUsers", async (req, res, user) => {
        const { roleId, userIds } = req.body

        if (!roleId || !userIds) {
            return res.json({ code: 400, message: "参数不能为空" })
        }

        const result = await SystemController.saveRoleUsers(roleId, userIds, user)
        return res.json(result)
    })

    // 获取用户的角色
    app.tokenPost("/getUserRoles", async (req, res, user) => {
        const { userId } = req.body

        if (!userId) {
            return res.json({ code: 400, message: "用户 ID 不能为空" })
        }

        const result = await SystemController.getUserRoles(userId)
        return res.json(result)
    })

    // 保存用户的角色关系
    app.tokenPost("/saveUserRoles", async (req, res, user) => {
        const { userId, roleIds } = req.body

        if (!userId || !roleIds) {
            return res.json({ code: 400, message: "参数不能为空" })
        }

        const result = await SystemController.saveUserRoles(userId, roleIds, user)
        return res.json(result)
    })

    // ==================== 网站菜单管理 ====================

    // 获取网站列表
    app.tokenPost("/getWebsiteList", async (req, res, user) => {
        const websiteList = await SystemController.getWebsiteList()
        return res.json({ code: 200, data: websiteList })
    })

    // 获取网站菜单列表
    app.tokenPost("/getWebsiteMenuList", async (req, res, user) => {
        const menuList = await SystemController.getWebsiteMenuList()
        return res.json({ code: 200, data: menuList })
    })

    // 获取网站菜单树
    app.tokenPost("/getWebsiteMenuTree", async (req, res, user) => {
        const menuTree = await SystemController.getWebsiteMenuTree()
        return res.json({ code: 200, data: menuTree })
    })

    // 创建网站菜单
    app.tokenPost("/createWebsiteMenu", async (req, res, user) => {
        const { name, icon, target, parentId, status } = req.body

        if (!name) {
            return res.json({ code: 400, message: "菜单名称不能为空" })
        }

        const result = await SystemController.createWebsiteMenu(
            { name, icon, target, parentId, status },
            user
        )
        return res.json(result)
    })

    // 更新网站菜单
    app.tokenPost("/updateWebsiteMenu", async (req, res, user) => {
        const { id, name, icon, target, parentId, status } = req.body

        if (!id) {
            return res.json({ code: 400, message: "菜单 ID 不能为空" })
        }

        const result = await SystemController.updateWebsiteMenu(
            { id, name, icon, target, parentId, status },
            user
        )
        return res.json(result)
    })

    // 删除网站菜单
    app.tokenPost("/deleteWebsiteMenu", async (req, res, user) => {
        const { id } = req.body

        if (!id) {
            return res.json({ code: 400, message: "菜单 ID 不能为空" })
        }

        const result = await SystemController.deleteWebsiteMenu(id)
        return res.json(result)
    })
}

export default UserManageServer
