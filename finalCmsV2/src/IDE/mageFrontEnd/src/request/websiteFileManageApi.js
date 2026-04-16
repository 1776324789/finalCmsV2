import { instance } from '@/request/request.js'
export function getWebsiteFileList(data) {
    return instance.post('/getWebsiteFileList', data)
}


export function getWebsiteFileEditContent(data) {
    return instance.post('/getWebsiteFileEditContent', data)
}

export function saveWebsiteFile(data) {
    return instance.post('/saveWebsiteFile', data)
}

export function createWebsiteFile(data) {
    return instance.post('/createWebsiteFile', data)
}
