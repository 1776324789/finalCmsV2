import { instance } from '@/request/request.js'

export function updateWebsiteList(data) {
    return instance.post(
        '/updateWebsiteList',
        data
    )
}

export function getWebsiteList(data) {
    return instance.post(
        '/getWebsiteListById',
        data
    )
}