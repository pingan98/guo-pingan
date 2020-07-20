import React, { Component } from 'react'


import { Button, Upload, message } from 'antd';

import { UploadOutlined } from '@ant-design/icons'

import { reqGetQiniuToken } from '@api/edu/lesson'
// import * as qiniu from 'qiniu-js'
// import { nanoid } from 'nanoid'

// 限制视频大小
const MAX_VIDEO_SIZE = 20 * 1024 * 1024

export default class MyUpload extends Component {
    state = {
        uploadToken: '',
        expires: 0
    }
    // 上传视频之前调用
    handleBeforeUpload = (file, fileList) => {
        // file 就是我们要上传的文件
        // console.log(file, fileList)
        return new Promise(async (resole, reject) => {

            // 上传之前要做的两件事

            // 1.限制视频大小（例如：要限制视频大小为20M）
            // MAX_VIDEO_SIZE
            if (file.size > MAX_VIDEO_SIZE) {
                message.error('上传视频太大，不能大于20M')
                reject('上传视频太大，不能大于20M')
                // 如果视频过大，后面的代码不执行
                return
            }
            // 2.请求上传的token
            // const res = await reqGetQiniuToken()
            // console.log(res) 
            // 判断本地缓存中是否有token，如果有，判断是否过期，如果过期了，重新获取，
            // 如果没有过期，就不发送请求  

            // 从缓存中获取存储的数据
            const str = localStorage.getItem('upload_token')
            // 把json格式的字符串转为一个对象
            const uploadObj = JSON.parse(str)
            // this.saveUploadToken()
            // 判断token 是否过期，token有效期是7200
            // 注意：返回的expires  是秒数，需要变成毫秒数进行判断
            // 如何判断有没有超时  （1.拿到当前时间  2.拿到存储token的时间,3。进行比较）

            if (Date.now() > uploadObj.expires) {
                // 过期了重新发送请求
                this.saveUploadToken()
            }
            resole(file)

        })



        // 上传之前要拿到上传七牛云的token

    }
    // 真正上传视频的时候调用，这个函数会覆盖默认的上传方式
    handleCustomRequest = () => {
        console.log('上传了')
    }

    // 存储uploadToken和过期时间的方法
    saveUploadToken = async () => {
        // 1:发送请求获取数据
        const res = await reqGetQiniuToken()
        // 2.存储到本地缓存中
        // 注意：localStorage  里面不能直接存储对象，只能存字符串
        // 注意 ：expires是秒数  ，并且是过期时间的周期值，7200只表示两个小时
        // 所有需要使用expires  换算一个过期时间
        // 获取到token的时间  加上  时间周期   得到过期的目标时间

        const targetTime = Date.now() + res.expires * 1000
        res.expires = targetTime
        const upload_token = JSON.stringify(res)
        localStorage.setItem('upload_token', upload_token)
        // 3.存储到state里面
        this.setState({
            uploadToken: res.uploadToken,
            expires: res.expires
        })
    }

    render () {
        return (
            <div>
                <Upload
                    // 上传之前
                    beforeUpload={this.handleBeforeUpload}
                    // 上传之后
                    customRequest={this.handleCustomRequest}
                >
                    <Button>
                        <UploadOutlined /> 上传视频
                    </Button>
                </Upload>

            </div>
        )
    }
}
