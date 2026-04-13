import { instance } from '@/request/request.js'

export function getUserList() {
    return instance.post('/getUserList')
}

export function createUser(data) {
    return instance.post('/createUser', data)
}

export function updateUser(data) {
    return instance.post('/updateUser', data)
}

export function deleteUser(data) {
    return instance.post('/deleteUser', data)
}

export function changePassword(data) {
    return instance.post('/changePassword', data)
}
