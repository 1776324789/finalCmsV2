import { instance } from '@/request/request.js'

export function uploadImage(data) {
    return instance.post(
        '/upload/image',
        data
    )
}
