import { instance } from '@/request/request.js'

export function getWebsiteRoleApi(data) {
    return instance.post(
        '/getWebsiteRole',
        data
    )
}

export function updateWebsiteRoleApi(data) {
    return instance.post(
        '/updateWebsiteRole',
        data
    )
}

export function createWebsiteRoleApi(data) {
    return instance.post(
        '/createWebsiteRole',
        data
    )
}

export function deleteWebsiteRoleApi(data) {
    return instance.post(
        '/deleteWebsiteRole',
        data
    )
}

export function updateWebsiteRoleMenuApi(data) {
    return instance.post(
        '/updateWebsiteRoleMenu',
        data
    )
}

export function getWebsiteRoleListApi(data) {
    return instance.post(
        '/getWebsiteRoleList',
        data
    )
}


export function getUserWebsiteRolesApi(data) {
    return instance.post(
        '/getUserWebsiteRoles',
        data
    )
}

export function saveUserWebsiteRolesApi(data) {
    return instance.post(
        '/saveUserWebsiteRoles',
        data
    )
}
