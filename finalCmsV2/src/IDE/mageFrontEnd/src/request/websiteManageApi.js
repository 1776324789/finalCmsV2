import { instance } from '@/request/request.js'

// 获取站点列表
export function getWebsiteList() {
    return instance.post('/getWebsiteList')
}

// 创建站点
export function createWebsite(data) {
    return instance.post('/createWebsite', data)
}

// 更新站点
export function updateWebsite(data) {
    return instance.post('/updateWebsite', data)
}

// 删除站点
export function deleteWebsite(data) {
    return instance.post('/deleteWebsite', data)
}

// 获取站点详情
export function getWebsiteDetail(data) {
    return instance.post('/getWebsiteDetail', data)
}
