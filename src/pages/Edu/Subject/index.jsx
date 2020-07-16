import React, { Component } from "react";

import { Button, Table, Input, Tooltip, message, Modal } from 'antd';

import {
  PlusOutlined, FormOutlined,
  DeleteOutlined, ExclamationCircleOutlined
} from '@ant-design/icons'


import './index.less'

// import { reqGetSubjectList } from '@api/edu/subject'

import {
  getSubjectList, getSecSubjectList,
  updateSubject
} from './redux'

// 导入connect
import { connect } from 'react-redux'
import { reqDelSubject } from '@api/edu/subject'
const { confirm } = Modal
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
    getSubjectList, getSecSubjectList, updateSubject
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

  currentPage = 1
  pageSize = 10
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

  // 点击页码,获取对应页的数据
  handleChange = (page, pageSize) => {
    // this.getSubjectList(page, pageSize)
    // 发送请求
    this.props.getSubjectList(page, pageSize)
    // 动态给currentPage赋值，保证当前高亮的页码和实际获取的页面保持一致
    this.currentPage = page
  }
  // 一页展示几条数据变化时触发的回调函数
  handleSizeChange = (current, size) => {
    // this.getSubjectList(current, size)

    this.props.getSubjectList(current, size)
    this.currentPage = current
  }
  // 点击可展开按钮触发
  // expanded: true表示展开了, false表示关闭了
  // record: 就是对应的这一行的数据
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
    // 存储一下老的subjectTitle
    this.oldSubjectTitle = value.title
  }
  // 修改数据时，受控组件input的change回调函数
  handleTitleChange = (e) => {
    this.setState({
      subjectTitle: e.target.value.trim()
    })
  }
  // 取消按钮
  handleCancel = () => {
    this.setState({
      subjectId: '',
      subjectTitle: ''
    })
  }
  // 更新确认按钮的时间回调函数
  handleUpdate = async () => {
    let { subjectId, subjectTitle } = this.state

    // 优化
    // 1.如果用户输入的是空字符串，就不执行后面操作
    if (subjectTitle.length === 0) {
      message.error('课程分类名称不能为空')
      return
    }
    // 2.如果用户输入的内容和原来的内容相同，则不执行后面的操作
    // 思路：点击更新按钮的时候，把旧的课程分类名称存起来
    // 点击确认的时候，用新数据（subjectTitle）和老数据进行比较
    if (this.oldSubjectTitle === subjectTitle) {
      message.error('课程分类名称不能和之前的相同')
      return
    }

    // 在异步操作之前加一个await  就可以让异步执行完毕之后，再执行后面的代码
    await this.props.updateSubject(subjectTitle, subjectId)

    message.success('更改成功')

    // 手动调用取消按钮的事件处理函数，让表格行展示内容
    this.handleCancel()

  }

  // 删除课程分类
  handleDel = value => () => {
    confirm({
      title: (
        <>
          <div>
            确定要删除
              <span style={{ color: 'red', fontSize: 29 }}>{value.title}</span>
            吗？
          </div>
        </>
      ),
      icon: <ExclamationCircleOutlined />,
      onOk: async () => {
        // 真正去删除这条数据
        await reqDelSubject(value._id)
        message.success('删除成功')

        // 重新请求获取最新的数据
        // 如果当前页是最后一页，并且最后一页只有一条数据
        // 并且当前不是第一页，那么请求数据的时候，应该请求的是上一页数据

        // 1.如何判断当前是否是第一页  this.currentPage!==1
        // 2.如何判断当前页只剩一条数据
        // 说明：由于没有修改redux，所以redux中如果items.length为1，证明只有一条数据
        // 3.如果判断是最后一页
        // subjectList.total  表示所有的数据
        // currentPage  表示当前页
        // pageSize  表示一页多少条

        const totalPage = Math.ceil(this.props.subjectList.total / this.pageSize)

        // 如果totalPage===currentPage  表示最后一页
        // console.log('currentPage', this.currentPage)
        // console.log('当前数据长度', this.props.subjectList.items.length)
        // console.log('totalpage', totalPage)
        if (this.currentPage !== 1 && this.props.subjectList.items.length === 1
          && totalPage === this.currentPage
        ) {
          // console.log('请求上一页数据')
          this.props.getSubjectList(--this.currentPage, this.pageSize)
          return
        }
        this.props.getSubjectList(this.currentPage, this.pageSize)


      }
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
                <Button type='primary' className='update-btn'
                  onClick={this.handleUpdate}
                >确认</Button>
                <Button type='danger' onClick={this.handleCancel}>取消</Button>

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
                <Button type="danger" onClick={this.handleDel(value)}><DeleteOutlined /></Button>
              </Tooltip>
            </>
          )

        },

        width: 199
      }
    ];

    return <div className='subject'>
      <Button type="primary"
        className='subject-btn'
        onClick={this.handleGoAddSubject}
      >
        <PlusOutlined />
        新建
        </Button>
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