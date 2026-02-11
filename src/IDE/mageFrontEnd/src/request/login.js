import { instance } from '@/request/request.js'

export function login(data) {
    return instance.post(
        '/login',
        data
    )
}

export function getverifyCode(data) {
    return instance.post(
        '/getverifyCode',
        data
    )
}