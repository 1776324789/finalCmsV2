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


export function verifyToken(data) {
    return instance.post(
        '/verifyToken',
        data
    )
}

export function getMenuData(data) {
    return instance.post(
        '/getMenuData',
        data
    )
}
