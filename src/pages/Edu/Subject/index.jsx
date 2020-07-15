import React, { Component } from "react";

import { Button, Table, Input, Tooltip } from 'antd';

import { PlusOutlined, FormOutlined, DeleteOutlined } from '@ant-design/icons'


import './index.less'

// import { reqGetSubjectList } from '@api/edu/subject'

import { getSubjectList, getSecSubjectList } from './redux'

// 导入connect
import { connect } from 'react-redux'

const data = [
  {
    key: 1,
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park',
    description: 'My name is John Brown, I am 32 years old, living in New York No. 1 Lake Park.',
  },
  {
    key: 2,
    name: 'Jim Green',
    age: 42,
    address: 'London No. 1 Lake Park',
    description: 'My name is Jim Green, I am 42 years old, living in London No. 1 Lake Park.',
  },
  {
    key: 3,
    name: 'Not Expandable',
    age: 29,
    address: 'Jiangsu No. 1 Lake Park',
    description: 'This not expandable',
  },
  {
    key: 4,
    name: 'Joe Black',
    age: 32,
    address: 'Sidney No. 1 Lake Park',
    description: 'My name is Joe Black, I am 32 years old, living in Sidney No. 1 Lake Park.',
  },
];

@connect(state => ({ subjectList: state.subjectList }),
  {
    getSubjectList, getSecSubjectList
  }
)
class Subject extends Component {

  // state = {
  //   subject: ''
  // }

  state = {
    // subjectId的作用：
    // 1.如果subjectId没有表示表格每一行直接展示课程分类的title，
    //                            如果有值（应该就是要修改数据的id）
    // 2.修改数据需要subjectId

    subjectId: '',
    subjectTitle: ''  // 用于设置受控组价
  }

  current = 2
  // async 
  componentDidMount () {
    // const res = await reqGetSubjectList(1, 10)
    // console.log(res)
    // this.setState({
    //   subject: res
    // })
    // console.log(this.state.subject)
    // this.getSubjectList(1, 10)
    this.props.getSubjectList(1, 10)
  }

  // getSubjectList = async (page, size) => {
  //   const res = await reqGetSubjectList(page, size)
  //   console.log(res)
  //   this.setState({
  //     subject: res
  //   })

  // }

  handleChange = (page, pageSize) => {
    // this.getSubjectList(page, pageSize)

    this.props.getSubjectList(page, pageSize)
    this.currentPage = page
  }

  handleSizeChange = (current, size) => {
    // this.getSubjectList(current, size)

    this.props.getSubjectList(current, size)
    this.currentPage = current
  }

  handleClickExpand = (expanded, record) => {
    // console.log(expanded, record)
    // 判断如果是展开就请求二级菜单数据，关闭就什么都不做
    if (expanded) {
      // 请求二级菜单数据
      // 需要传入parentId
      this.props.getSecSubjectList(record._id)
    }
  }

  // 跳转到添加页面
  handleGoAddSubject = () => {
    this.props.history.push('/edu/subject/add')
  }

  // 点击更新按钮的事件处理函数
  handleUpdateClick = value => () => {
    this.setState({
      subjectId: value._id,
      subjectTitle: value.title
    })
  }
  // 修改数据时，受控组件input的change回调函数
  handleTitleChange = (e) => {
    this.setState({
      subjectTitle: e.target.value
    })
  }
  render () {
    // 注意：这个columns必须写到render中，因为state变化，render会调用，这个columns才会重新执行
    const columns = [
      // columns  定义表格的列
      // title属性：表示列的名称
      // dataIndex决定：这一列展示的data中哪一项的数据
      {
        title: '分类名称',
        // dataIndex: 'title',
        key: 'title',
        render: (value) => {
          // 如果state里面存储的id和这一条数据的id相同，就展示input
          // 、由于第一页数据有10条，所以这个render的回调会执行10次
          // 接收value是每一行数据
          console.log(value)
          if (this.state.subjectId === value._id) {
            return (
              <Input
                value={this.state.subjectTitle}
                className='subject-input'
                onChange={this.handleTitleChange}
              />
            )
          }
          return <span>{value.title}</span>
        }
      },

      {
        title: '操作',
        dataIndex: '',// 标识这一列不渲染data里的数据
        key: 'x',
        // 自定义这一列要渲染的内容
        render: (value) => {
          // 判断当前数据的id是否和state里面的subjectId的值是相同的
          // 如果相同，展示确认呢和取消按钮，否则展示修改和删除按钮
          if (this.state.subjectId === value._id) {
            return (
              <>
                <Button type='primary' className='update-btn'>确认</Button>
                <Button type='danger'>取消</Button>

              </>
            )
          }
          return (
            <>
              <Tooltip title='更新课程分类'>
                <Button type="primary" className='update-btn'
                  onClick={this.handleUpdateClick(value)}>
                  <FormOutlined />
                </Button>
              </Tooltip>
              <Tooltip title='删除课程分类'>
                <Button type="danger"><DeleteOutlined /></Button>
              </Tooltip>
            </>
          )

        },

        width: 199
      }
    ];

    return <div className='subject'>
      <Button type="primary" className='subject-btn' onClick={this.handleGoAddSubject}>
        <PlusOutlined />新建</Button>
      <Table
        columns={columns}
        expandable={{
          // expandedRowRender: record => (<p style={{ margin: 0 }}>{record.description}</p>),
          // rowExpandable: record => record.name !== 'Not Expandable',
          onExpand: this.handleClickExpand

        }}
        dataSource={this.props.subjectList.items}
        rowKey='_id'
        pagination={{
          // total: this.state.subject.total, //total表示数据总数
          total: this.props.subjectList.total, //total表示数据总数

          showQuickJumper: true, //是否显示快速跳转
          showSizeChanger: true, // 是否显示修改每页显示数据数量
          pageSizeOptions: ['5', '10', '15', '20'], //设置每天显示数据数量的配置项
          // defaultPageSize: 5, //每页默认显示数据条数 默认是10,
          onChange: this.handleChange,
          onShowSizeChange: this.handleSizeChange,
          current: this.currentPage

        }}
      />,
      </div >

  }
}
export default Subject