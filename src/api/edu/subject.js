import request from '@utils/request'

const BASE_URL = '/admin/edu/subject'

// 获取一级课程分类
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
// 添加课程分类
export function reqAddSubjectList (title, parentId) {
    return request({
        url: `${BASE_URL}/save`,
        method: 'POST',
        data: {
            title,
            parentId
        }
    })
}

//定义 更新课程分类title的方法
export function reqUpdateSubjectList (title, id) {
    return request({
        url: `${BASE_URL}/update`,
        method: 'PUT',
        data: {
            title,
            id
        }
    })
}
//定义删除课程分类title的方法
export function reqDelSubject (id) {
    return request({
        url: `${BASE_URL}/remove/${id}`,
        method: 'DELETE'
    })
}