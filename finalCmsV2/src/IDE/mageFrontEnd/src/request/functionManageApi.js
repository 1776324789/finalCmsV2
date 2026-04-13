import { instance } from '@/request/request.js'

// 获取系统菜单列表
export function getSystemMenuList() {
    return instance({
        url: '/getSystemMenuList',
        method: 'post'
    })
}

// 创建系统菜单
export function createSystemMenu(data) {
    return instance({
        url: '/createSystemMenu',
        method: 'post',
        data
    })
}

// 更新系统菜单
export function updateSystemMenu(data) {
    return instance({
        url: '/updateSystemMenu',
        method: 'post',
        data
    })
}

// 删除系统菜单
export function deleteSystemMenu(data) {
    return instance({
        url: '/deleteSystemMenu',
        method: 'post',
        data
    })
}
