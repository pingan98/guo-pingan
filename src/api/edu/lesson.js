import request from '@utils/request'

const BASE_URL = '/admin/edu/lesson'

// 获取所有章节课时数据
export function reqGetLessonList (chapterId) {
    return request({
        url: `${BASE_URL}/get/${chapterId}`,
        methos: 'GET',

    })
}

// 新增课时，上传视频，获取七牛云token方法
export function reqGetQiniuToken () {
    return request({
        url: `/uploadtoken`,
        methos: 'GET',

    })
}
// 新增课时
export function reqAddLesson ({ chapterId, title, free, video }) {
    return request({
        url: `${BASE_URL}/save`,
        method: 'POST',
        data: {
            chapterId,
            title,
            free,
            video
        }
    })
}