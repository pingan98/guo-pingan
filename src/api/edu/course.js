import request from '@utils/request'

const BASE_URL = '/admin/edu/course'

// 获取所有课程数据
export function reqGetCourseList () {
    return request({
        url: `${BASE_URL}`,
        methos: 'GET',

    })
}