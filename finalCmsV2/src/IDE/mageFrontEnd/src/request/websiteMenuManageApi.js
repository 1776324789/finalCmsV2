import { instance } from '@/request/request.js'

// 获取网站列表
export function getWebsiteList() {
    return instance.post('/getWebsiteList')
}

// 获取网站菜单列表
export function getWebsiteMenuList() {
    return instance.post('/getWebsiteMenuList')
}

// 获取网站菜单树
export function getWebsiteMenuTree(websiteId) {
    return instance.post('/getWebsiteMenuTree', { websiteId })
}

// 创建网站菜单
export function createWebsiteMenu(data) {
    return instance.post('/createWebsiteMenu', data)
}

// 更新网站菜单
export function updateWebsiteMenu(data) {
    return instance.post('/updateWebsiteMenu', data)
}

// 删除网站菜单
export function deleteWebsiteMenu(id) {
    return instance.post('/deleteWebsiteMenu', { id })
}
