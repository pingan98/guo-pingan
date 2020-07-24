import request from '@utils/request'

const BASE_URL = '/admin/edu/chapter'

// 获取所有章节课程分页数据
export function reqGetChapterList ({ page, limit, courseId }) {
    return request({
        url: `${BASE_URL}/${page}/${limit}`,
        methos: 'GET',
        params: {
            courseId
        }
    })
}

// 批量删除多个章节
export function reqBatchDelChapter (chapterIds) {
    return request({
        url: `${BASE_URL}/batchRemove`,
        method: 'DELETE',
        data: {
            idList: chapterIds
        }
    })
}