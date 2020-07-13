import { GET_SUBJECT_LIST, GET_SECSUBJECT_LIST } from "./constants";

const initSubjectList = {
  total: 0, // 总数
  items: [], // 详细数据
};

export default function subjectList (prevState = initSubjectList, action) {
  switch (action.type) {
    case GET_SUBJECT_LIST:
      // 为了实现展示二级分类，需要给items中每一个数据添加children属性
      // 有了children属性，每一条数据就会有可展开按钮
      action.data.items.forEach(item => {
        item.children = []
      })
      return action.data;
    case GET_SECSUBJECT_LIST:

      if (action.data.items.length > 0) {
        const parentId = action.data.items[0].parentId

        prevState.items.forEach(item => {
          if (item._id === parentId) {
            item.children = action.data.items
          }
        })

      }
      return {
        ...prevState
      }
    default:
      return prevState;
  }
}
