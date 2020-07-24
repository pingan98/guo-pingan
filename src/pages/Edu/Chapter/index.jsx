import React, { Component } from "react";
import { Button, message, Tooltip, Modal, Alert, Table } from "antd";
import {
  FullscreenOutlined,
  RedoOutlined,
  SettingOutlined,
  InfoCircleOutlined,
  PlusOutlined,
  FormOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";

import relativeTime from "dayjs/plugin/relativeTime";

import { connect } from "react-redux";
import SearchForm from "./SearchForm";
import { getLessonList } from './redux'
import "./index.less";

dayjs.extend(relativeTime);

@connect(
  (state) => ({
    // courseList: state.courseList
    // permissionValueList: filterPermissions(
    //   state.course.permissionValueList,
    //   "Course"
    // )
    chapterList: state.chapterList
  }),
  { getLessonList }
  // { getcourseList }
)
class Chapter extends Component {
  state = {
    searchLoading: false,
    previewVisible: false,
    previewImage: "",
    selectedRowKeys: [],
  };

  showImgModal = (img) => {
    return () => {
      this.setState({
        previewVisible: true,
        previewImage: img,
      });
    };
  };

  handleImgModal = () => {
    this.setState({
      previewVisible: false,
    });
  };

  componentDidMount () {
    // const { page, limit } = this.state;
    // this.handleTableChange(page, limit);
  }

  handleTableChange = (page, limit) => {
    this.setState({
      tableLoading: true,
    });

    this.getcourseList({ page, limit }).finally(() => {
      this.setState({
        tableLoading: false,
        page,
        limit,
      });
    });
  };

  getcourseList = ({ page, limit, Coursename, nickName }) => {
    return this.props
      .getcourseList({ page, limit, Coursename, nickName })
      .then((total) => {
        if (total === 0) {
          message.warning("暂无用户列表数据");
          return;
        }
        message.success("获取用户列表数据成功");
      });
  };

  onSelectChange = (selectedRowKeys) => {
    this.setState({
      selectedRowKeys,
    });
  };
  // 定义的点击展开按钮的时间处理函数
  handleClickExpand = (expand, record) => {
    console.log(expand, record)
    if (expand) {
      // 发送请求获取课时数据
      this.props.getLessonList(record._id)
    }
  }
  // 点击新增  添加章节
  handleGoAddLesson = data => () => {

    {/* 传入data  可以获取到chapterId */ }

    this.props.history.push('/edu/chapter/addlesson', data)

  }
  // 批量删除
  handleBatchDel = () => {
    Modal.confirm({
      title: '确定要批量删出吗？',
      onOk: () => {
        // selectedRowKeys  里面存储的是所有选中的课时和章节
        // 所以在批量删除之前，要先分清楚哪些是课时id，哪些是章节id
        let chapterIds = []  //存储选中章节的id
        let lessonIds = []   // 存储选中课时的id

        // 拿到所有选中的id
        let selectedRowKeys = this.state.selectedRowKeys
        // 从selectedRowKeys里面找到章节id，其他的就是课时id
        // 所有的章节数据，都存储在redux里面，拿到章节数据，然后遍历章节数据，
        // 判断selectedRowKeys里面哪些是章节id，把这些id取出来，其它就是课时id

        let chapterList = this.props.chapterList.items
        // 遍历查找章节id
        // 遍历chapterList，拿到每一个章节id，去selectedRowKeys 里面查找是否存在
        chapterList.forEach(chapter => {
          // 找到每一条章节id
          let chapterId = chapter._id

          // 拿这条章节id，去selectedRowKeys里面找，看看是否存储，如果存在就取出来
          // 如果selectedRowKeys 里面有chapterId，就返回这个id对应的下标，否则返回-1

          const index = selectedRowKeys.indexOf(chapterId)
          if (index > -1) {
            // 证明找到了，就从selectedRowKeys把这条数据切出来
            // selectedRowKeys。splice（开始的下标，切几条）
            // splice 会修改原来的数据，并且返回切割的新数组
            let newArr = selectedRowKeys.splice(index, 1)
            chapterIds.push(newArr[0])
          }

        })
        // 剩余的就是课时id
        lessonIds = [...selectedRowKeys]
      }
    })

  }
  render () {
    const { previewVisible, previewImage, selectedRowKeys } = this.state;

    const columns = [
      {
        title: "章节名称",
        dataIndex: "title",
      },
      {
        title: "是否免费",
        dataIndex: "free",
        render: (isFree) => {
          return isFree === true ? "是" : isFree === false ? "否" : "";
        },
      },
      {
        title: "操作",
        width: 300,
        fixed: "right",
        render: (data) => {
          // if ("free" in data) {
          console.log(data)
          return (
            <div>
              <Tooltip title="新增章节">
                {/* 传入data  可以获取到chapterId */}
                <Button type='primary' onClick={this.handleGoAddLesson(data)}>
                  <PlusOutlined />
                </Button>
              </Tooltip>
              <Tooltip title="更新章节">
                <Button type="primary" style={{ margin: "0 10px" }}>
                  <FormOutlined />
                </Button>
              </Tooltip>
              <Tooltip title="删除章节">
                <Button type="danger">
                  <DeleteOutlined />
                </Button>
              </Tooltip>
            </div>
          );
          // }
        },
      },
    ];

    const data = [
      {
        id: "111",
        title: "第一章节",
        children: [
          {
            id: "1",
            title: "第一课时",
            free: false,
            videoSourceId: "756cf06db9cb4f30be85a9758b19c645",
          },
          {
            id: "2",
            title: "第二课时",
            free: true,
            videoSourceId: "2a02d726622f4c7089d44cb993c531e1",
          },
          {
            id: "3",
            title: "第三课时",
            free: true,
            videoSourceId: "4e560c892fdf4fa2b42e0671aa42fa9d",
          },
        ],
      },
      {
        id: "222",
        title: "第二章节",
        children: [
          {
            id: "4",
            title: "第一课时",
            free: false,
            videoSourceId: "756cf06db9cb4f30be85a9758b19c645",
          },
          {
            id: "5",
            title: "第二课时",
            free: true,
            videoSourceId: "2a02d726622f4c7089d44cb993c531e1",
          },
          {
            id: "6",
            title: "第三课时",
            free: true,
            videoSourceId: "4e560c892fdf4fa2b42e0671aa42fa9d",
          },
        ],
      },
      {
        id: "333",
        title: "第三章节",
        children: [
          {
            id: "1192252824606289921",
            title: "第一课时",
            free: false,
            videoSourceId: "756cf06db9cb4f30be85a9758b19c645",
          },
          {
            id: "1192628092797730818",
            title: "第二课时",
            free: true,
            videoSourceId: "2a02d726622f4c7089d44cb993c531e1",
          },
          {
            id: "1192632495013380097",
            title: "第三课时",
            free: true,
            videoSourceId: "4e560c892fdf4fa2b42e0671aa42fa9d",
          },
        ],
      },
    ];

    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
      // hideDefaultSelections: true,
      // selections: [
      //   Table.SELECTION_ALL,
      //   Table.SELECTION_INVERT,
      //   {
      //     key: "odd",
      //     text: "Select Odd Row",
      //     onSelect: changableRowKeys => {
      //       let newSelectedRowKeys = [];
      //       newSelectedRowKeys = changableRowKeys.filter((key, index) => {
      //         if (index % 2 !== 0) {
      //           return false;
      //         }
      //         return true;
      //       });
      //       this.setState({ selectedRowKeys: newSelectedRowKeys });
      //     }
      //   },
      //   {
      //     key: "even",
      //     text: "Select Even Row",
      //     onSelect: changableRowKeys => {
      //       let newSelectedRowKeys = [];
      //       newSelectedRowKeys = changableRowKeys.filter((key, index) => {
      //         if (index % 2 !== 0) {
      //           return true;
      //         }
      //         return false;
      //       });
      //       this.setState({ selectedRowKeys: newSelectedRowKeys });
      //     }
      //   }
      // ]
    };

    return (
      <div>
        <div className="course-search">
          <SearchForm />
        </div>
        <div className="course-table">
          <div className="course-table-header">
            <h3>课程章节列表</h3>
            <div>
              <Button type="primary" style={{ marginRight: 10 }}>
                <PlusOutlined />
                <span>新增</span>
              </Button>
              <Button type="danger" style={{ marginRight: 10 }}
                onClick={this.handleBatchDel}
              >
                <span>批量删除</span>
              </Button>
              <Tooltip title="全屏" className="course-table-btn">
                <FullscreenOutlined />
              </Tooltip>
              <Tooltip title="刷新" className="course-table-btn">
                <RedoOutlined />
              </Tooltip>
              <Tooltip title="设置" className="course-table-btn">
                <SettingOutlined />
              </Tooltip>
            </div>
          </div>
          <Alert
            message={
              <span>
                <InfoCircleOutlined
                  style={{ marginRight: 10, color: "#1890ff" }}
                />
                {`已选择 ${selectedRowKeys.length} 项`}
              </span>
            }
            type="info"
            style={{ marginBottom: 20 }}
          />
          <Table
            rowSelection={rowSelection}
            columns={columns}
            dataSource={this.props.chapterList.items}
            rowKey="_id"
            expandable={{
              onExpand: this.handleClickExpand
            }}
          />
        </div>

        <Modal
          visible={previewVisible}
          footer={null}
          onCancel={this.handleImgModal}
        >
          <img alt="example" style={{ width: "100%" }} src={previewImage} />
        </Modal>
      </div>
    );
  }
}

export default Chapter;
