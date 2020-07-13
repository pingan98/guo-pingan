import request from '@utils/request'

const BASE_URL = '/admin/edu/subject'

// 获取一级分类
export function reqGetSubjectList (page, limit) {
    return request({
        url: `${BASE_URL}/${page}/${limit}`,
        method: 'GET'
    })
}
// 获取二级课程分类
export function reqGetSecSubjectList (parentId) {
    return request({
        url: `${BASE_URL}/get/${parentId}`,
        method: 'GET'
    })
}