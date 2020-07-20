import React, { Component } from 'react'

import { Form, Input, Button, Select, Card, message, Switch } from 'antd';

import { ArrowLeftOutlined } from '@ant-design/icons'

import { Link } from 'react-router-dom'

import MyUpload from '../MyUpload'

import './index.css'

const Option = Select.Option

const layout = {
    labelCol: { span: 2 },
    wrapperCol: { span: 5 },
};




// @connect(state => ({ subjectList: state.subjectList }),
//     { getSubjectList })



class AddLeeson extends Component {


    // 点击添加按钮，表单校验成功之后的回调函数
    onFinish = values => {
        console.log(values)

    };


    render () {
        return (
            <Card
                title={
                    <>

                        <Link to='/edu/chapter/list'>
                            <ArrowLeftOutlined />
                        </Link>
                        <span className='add-lesson'>新增课程</span>
                    </>
                }

            >
                <Form
                    {...layout}

                    // 当点击表单内的提交按钮，onDinish会触发
                    onFinish={this.onFinish}

                    initialValues={{
                        // 键就是表单项的name属性得值
                        free: true
                    }}

                >
                    <Form.Item
                        label="课时名称"
                        name="title"
                        rules={[{ required: true, message: '请输入课时名称!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="是否免费"
                        name="free"
                        rules={[{ required: true, message: '请选择是否免费!' }]}
                        valuePropName='checked'
                    >
                        <Switch checkedChildren="开启" unCheckedChildren="关闭" defaultChecked />
                    </Form.Item>

                    <Form.Item
                        label="上传视频"
                        name="video"
                        rules={[{ required: true, message: '请选择上传视频!' }]}
                    >
                        <MyUpload></MyUpload>

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
export default AddLeeson