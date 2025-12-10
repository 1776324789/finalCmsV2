import { instance } from '@/request/request.js'

export function getUserDataBySSOID(data) {
    return instance.post(
        '/user/getUserDataBySSOID',
        data
    )
}