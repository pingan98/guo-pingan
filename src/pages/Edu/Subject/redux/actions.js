import {
  reqGetSubjectList,
  reqGetSecSubjectList,
  reqUpdateSubjectList
} from "@api/edu/subject";

import {
  GET_SUBJECT_LIST,
  GET_SECSUBJECT_LIST,
  UPDATE_SUBJECT
} from "./constants";

// 一级分类信息----同步
const getSubjectListSync = (list) => ({
  type: GET_SUBJECT_LIST,
  data: list,
});

// 一级分类信息----异步
export const getSubjectList = (page, limit) => {
  return (dispatch) => {
    return reqGetSubjectList(page, limit).then((response) => {
      dispatch(getSubjectListSync(response));
      return response
    });
  };
};


// 二级分类信息---同步

const getSecSubjectListSync = (list) => ({
  type: GET_SECSUBJECT_LIST,
  data: list
})
// 二级分类信息---异步
export const getSecSubjectList = (parentId) => {
  return dispatch => {
    return reqGetSecSubjectList(parentId).then((res) => {
      dispatch(getSecSubjectListSync(res))
      return res
    })

  }
}


// 更新课程分类的同步actions

const updateSubjectSync = data => ({
  type: UPDATE_SUBJECT,
  data
})
//更新课程分类的异步---actions
export const updateSubject = (title, id) => {
  return dispatch => {

    // 这个return 是为了返回promise对象
    return reqUpdateSubjectList(title, id).then((res) => {
      // 将redux里面的数据修改完成
      dispatch(updateSubjectSync({ title, id }))
      // 这个return 是为了让promise拿到响应的值
      return res
    })
  }
}

