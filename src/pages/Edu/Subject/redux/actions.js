import {
  reqGetSubjectList,
  reqGetSecSubjectList
} from "@api/edu/subject";

import {
  GET_SUBJECT_LIST,
  GET_SECSUBJECT_LIST
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

export const getSecSubjectList = (parentId) => {
  return dispatch => {
    return reqGetSecSubjectList(parentId).then((res) => {
      dispatch(getSecSubjectListSync(res))
      return res
    })

  }
}

