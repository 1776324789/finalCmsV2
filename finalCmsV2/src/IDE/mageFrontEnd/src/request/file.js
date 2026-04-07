import { instance } from '@/request/request.js'

export function uploadImage(data, config) {
    return instance.post(
        '/upload/image',
        data,
        config
    )
}

// /request/file.js
export function uploadFile(data, config) {
    return instance.post(
        '/upload/file',
        data,
        config
    )
}