import { instance } from '@/request/request.js'

// 获取角色列表
export function getRoleList() {
    return instance({
        url: '/getRoleList',
        method: 'post'
    })
}

// 创建角色
export function createRole(data) {
    return instance({
        url: '/createRole',
        method: 'post',
        data
    })
}

// 更新角色
export function updateRole(data) {
    return instance({
        url: '/updateRole',
        method: 'post',
        data
    })
}

// 删除角色
export function deleteRole(data) {
    return instance({
        url: '/deleteRole',
        method: 'post',
        data
    })
}

// 获取角色菜单权限
export function getRoleMenu(data) {
    return instance({
        url: '/getRoleMenu',
        method: 'post',
        data
    })
}

// 保存角色菜单权限
export function saveRoleMenu(data) {
    return instance({
        url: '/saveRoleMenu',
        method: 'post',
        data
    })
}

// 获取角色下的用户
export function getRoleUsers(data) {
    return instance({
        url: '/getRoleUsers',
        method: 'post',
        data
    })
}

// 保存角色用户关系
export function saveRoleUsers(data) {
    return instance({
        url: '/saveRoleUsers',
        method: 'post',
        data
    })
}

// 获取用户的角色
export function getUserRoles(data) {
    return instance({
        url: '/getUserRoles',
        method: 'post',
        data
    })
}

// 保存用户的角色关系
export function saveUserRoles(data) {
    return instance({
        url: '/saveUserRoles',
        method: 'post',
        data
    })
}
