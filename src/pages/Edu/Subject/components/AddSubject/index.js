import React, { Component } from 'react'

import { Form, Input, Button, Select, Card, message } from 'antd';

import { ArrowLeftOutlined } from '@ant-design/icons'

import { Link } from 'react-router-dom'

import { connect } from 'react-redux'

// import { getSubjectList } from '../../redux'

import { reqGetSubjectList, reqAddSubjectList } from '@api/edu/subject'
import './index.css'
const Option = Select.Option
const layout = {
    labelCol: { span: 2 },
    wrapperCol: { span: 5 },
};




// @connect(state => ({ subjectList: state.subjectList }),
//     { getSubjectList })


class AddSubject extends Component {
    state = {
        subjectList: {
            total: 0,
            items: []
        }
    }



    page = 1
    async componentDidMount () {
        // console.log(this.props)
        // this.props.getSubjectList(this.page++, 10)

        const res = await reqGetSubjectList(this.page++, 10)
        console.log(res)
        this.setState(
            {
                subjectList: res
            }
        )

    }

    handleloadMore = async () => {
        // this.props.getSubjectList(this.page++, 10)

        const res = await reqGetSubjectList(this.page++, 10)

        const newItems = [...this.state.subjectList.items, ...res.items]
        this.setState({
            subjectList: {
                total: res.total,
                items: newItems
            }
        })

    }
    // 点击添加按钮，表单校验成功之后的回调函数
    onFinish = async values => {

        // console.log('Success:', values);
        try {
            // 发送请求新增课程分类
            await reqAddSubjectList(values.subjectname, values.parentid)
            // 提示一下
            message.success('课程分类添加成功')
            // 跳回到subjectlist页面
            this.props.history.push('/edu/subject/list')
        } catch  {
            message.error('课程分类添加失败')
        }
    };


    render () {
        return (
            <Card
                title={
                    <>

                        <Link to='/edu/subject/list'>
                            <ArrowLeftOutlined />
                        </Link>
                        <span className='add-subject'>新增课程</span>
                    </>
                }

            >
                <Form
                    {...layout}
                    name="basic"
                    initialValues={{ remember: true }}
                    onFinish={this.onFinish}

                >
                    <Form.Item
                        label="课程分类名称"
                        name="subjectname"
                        rules={[{ required: true, message: '请输入课程分类!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="父级分类id"
                        name="parentid"
                        rules={[{ required: true, message: '请选择分类id!' }]}
                    >

                        <Select
                            dropdownRender={menu => {
                                return (
                                    <>
                                        {menu}

                                        {this.state.subjectList.total > this.state.subjectList.items.length &&
                                            (< Button type='link'
                                                onClick={this.handleloadMore}
                                            >加载更多数据</Button>)}

                                    </>
                                )
                            }

                            }

                        >
                            {/* 一级课程分类，这一项不在获取的动态数据中，所以在这里写死 */}
                            <Option value={0} key={0}>{'一级课程分类'}</Option>
                            {/* 根据拿到的一级课程分类，动态渲染 */}
                            {this.state.subjectList.items.map(subject => {
                                return (<Option value={subject._id} key={subject._id}>
                                    {subject.title}
                                </Option>)
                            })}


                        </Select>

                    </Form.Item>


                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            添加
                        </Button>
                    </Form.Item>
                </Form >
            </Card >

        )
    }
}
export default AddSubject