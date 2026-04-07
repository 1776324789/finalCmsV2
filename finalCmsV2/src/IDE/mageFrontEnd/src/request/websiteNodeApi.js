import { instance } from '@/request/request.js'

export function getNodeContent(data) {
    return instance.post(
        '/getNodeContent',
        data
    )
}

export function updateNode(data) {
    return instance.post(
        '/updateNode',
        data
    )
}

export function createNode(data) {
    return instance.post(
        '/createNode',
        data
    )
}


export function deleteNodeApi(data) {
    return instance.post(
        '/deleteNode',
        data
    )
}