import request from '@utils/request'

const BASE_URL = '/admin/edu/lesson'

// 获取所有章节课时数据
export function reqGetLessonList (chapterId) {
    return request({
        url: `${BASE_URL}/get/${chapterId}`,
        methos: 'GET',

    })
}