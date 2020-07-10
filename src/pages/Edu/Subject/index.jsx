import React, { Component } from "react";

import { Button, Table } from 'antd';

import { PlusOutlined, FormOutlined, DeleteOutlined } from '@ant-design/icons'


import './index.less'

import { reqGetSubjectList } from '@api/edu/subject'

import { getSubjectList } from './redux'

import { connect } from 'react-redux'
const columns = [
  { title: '分类名称', dataIndex: 'title', key: 'title' },

  {
    title: '操作',
    dataIndex: '',
    key: 'x',
    render: () => (
      <>
        <Button type="primary" className='update-btn'><FormOutlined /></Button>,
        <Button type="danger"><DeleteOutlined /></Button>
      </>
    ),
    width: 199
  },
];

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
    getSubjectList
  }
)
class Subject extends Component {

  // state = {
  //   subject: ''
  // }
  current = 2
  async componentDidMount () {
    // const res = await reqGetSubjectList(1, 10)
    // console.log(res)
    // this.setState({
    //   subject: res
    // })
    // console.log(this.state.subject)
    // this.getSubjectList(1, 10)
    this.props.getSubjectList(1, 10)
  }

  getSubjectList = async (page, size) => {
    const res = await reqGetSubjectList(page, size)
    console.log(res)
    this.setState({
      subject: res
    })

  }

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
  render () {
    return <div className='subject'>
      <Button type="primary" className='subject-btn'><PlusOutlined />添加</Button>
      <Table
        columns={columns}
        expandable={{
          expandedRowRender: record => <p style={{ margin: 0 }}>{record.description}</p>,
          rowExpandable: record => record.name !== 'Not Expandable',
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
      </div>

  }
}
export default Subject