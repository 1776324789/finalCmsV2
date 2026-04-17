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

export function createWebsiteFileHistory(data) {
    return instance.post('/createWebsiteFileHistory', data)
}

export function getWebsiteFileHistoryList(data) {
    return instance.post('/getWebsiteFileHistoryList', data)
}

export function getWebsiteFileHistoryContent(data) {
    return instance.post('/getWebsiteFileHistoryContent', data)
}


export function deleteWebsiteFile(data) {
    return instance.post('/deleteWebsiteFile', data)
}
