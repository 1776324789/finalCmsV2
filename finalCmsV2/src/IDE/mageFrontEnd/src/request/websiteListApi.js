import { instance } from '@/request/request.js'

export function updateWebsiteList(data) {
    return instance.post(
        '/updateWebsiteList',
        data
    )
}

export function createWebsiteList(data) {
    return instance.post(
        '/createWebsiteList',
        data
    )
}

export function getWebsiteList(data) {
    return instance.post(
        '/getWebsiteListById',
        data
    )
}

export function deleteWebsiteList(data) {
    return instance.post(
        '/deleteWebsiteList',
        data
    )
}
