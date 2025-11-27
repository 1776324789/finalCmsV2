import { instance } from '@/request/request.js'
export function aiIntroduce(data) {
    return instance.post(
        '/verify/aiIntroduce',
        data
    )
}
export function saveIntroduce(data) {
    return instance.post(
        '/verify/saveIntroduce',
        data
    )
}

export function getVerifyIntroduce(data) {
    return instance.post(
        '/verify/getVerifyIntroduce',
        data
    )
}
export function getVerifyById(data) {
    return instance.post(
        '/verify/getVerifyById',
        data
    )
}

export function verifyApply(data) {
    return instance.post(
        '/verify/apply',
        data
    )
}
export function updateVerifyApply(data) {
    return instance.post(
        '/verify/updateVerifyApply',
        data
    )
}

export function getCanApplyChildVerify(data) {
    return instance.post(
        '/verify/getCanApplyChildVerify',
        data
    )
}

export function applyChildVerify(data) {
    return instance.post(
        '/verify/applyChildVerify',
        data
    )
}

export function getChildVerify(data) {
    return instance.post(
        '/verify/getChildVerify',
        data
    )
}

export function agreeChildVerify(data) {
    return instance.post(
        '/verify/agreeChildVerify',
        data
    )
}
export function removeChildVerify(data) {
    return instance.post(
        '/verify/removeChildVerify',
        data
    )
}
export function cancelVerify(data) {
    return instance.post(
        '/verify/cancelVerify',
        data
    )
}
export function followVerify(data) {
    return instance.post(
        '/verify/followVerify',
        data
    )
}
export function cancelFollowVerify(data) {
    return instance.post(
        '/verify/cancelFollowVerify',
        data
    )
}
export function getFollowVerifyPost(data) {
    return instance.post(
        '/verify/getFollowVerifyPost',
        data
    )
}

export function getFollowVerifyList(data) {
    return instance.post(
        '/verify/getFollowVerifyList',
        data
    )
}
export function searchVerify(data) {
    return instance.post(
        '/verify/searchVerify',
        data
    )
}

export function cancelReply(data) {
    return instance.post(
        '/verify/cancelReply',
        data
    )
}

export function getUserFollowVerify(data) {
    return instance.post(
        '/verify/getUserFollowVerify',
        data
    )
}

export function saveEditVerify(data) {
    return instance.post(
        '/verify/saveEditVerify',
        data
    )
}
export function getUserVerifyTemp(data) {
    return instance.post(
        '/verify/getUserVerifyTemp',
        data
    )
}

export function cancelEditVerify(data) {
    return instance.post(
        '/verify/cancelEditVerify',
        data
    )
}
export function rejectChildVerifyApply(data) {
    return instance.post(
        '/verify/rejectChildVerifyApply',
        data
    )
}
export function getActivityVerify(data) {
    return instance.post(
        '/verify/getActivityVerify', data

    )
}
