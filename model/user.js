//创建集合
//引入mongoose模块

const mongoose = require('mongoose')

//引入joi模块
const Joi = require('joi')


//导入bcrypt
const bcrypt = require('bcryptjs')
    //创建集合规则
    //1.集合名称
    //2.集合规则
const userSchema = new mongoose.Schema({

        username: {
            type: String,
            required: true,
            minlength: 2,
            maxlength: 20

        },
        // 头像
        avatar: {
            type: String,
            default: null
        },
        email: {
            type: String,
            //保证邮箱插入不重复
            unique: true
        },
        password: {
            type: String,
            min: 6,
            max: 16,
            required: true
        },
        role: {
            type: String,
            default: 'normol'

        },
        //0启用状态
        //1禁止状态
        state: {
            type: Number,
            default: 0

        }
    })
    //使用规则创建学生集合
const User = mongoose.model('User', userSchema)

// async function createUser() {

//     //生成随机字符串
//     const salt = await bcrypt.genSalt(10)
//         //对密码进行加密
//         //1.要加密的明文
//         //2.随机字符串
//     const pass = await bcrypt.hash('123456', salt)

//     const user = await User.create({
//         username: 'iteheima',
//         email: 'iteheima@itcast.cn',
//         password: pass,
//         role: 'admin',
//         state: 0

//     })
// }
// createUser()

//验证用户信息
const validateUser = user => {

    //定义对象验证规则
    const schema = {
        username: Joi.string().min(2).max(10).required().error(new Error('username属性验证出现错误!')),
        email: Joi.string().email().required().error(new Error('邮箱验证出现错误!')),
        password: Joi.string().regex(/^[a-zA-Z0-9]{6,30}$/).required().error(new Error('密码格式出现错误!')),
        role: Joi.string().valid('normol', 'admin').required().error(new Error('角色值非法!')),
        state: Joi.number().required().error(new Error('状态值非法!'))


    }

    //事实验证
    return Joi.validate(user, schema)
}

//验证用户注册信息
const registerUser = user => {

    //定义对象验证规则
    const schema = {
        username: Joi.string().min(2).max(10).required().error(new Error('username属性验证出现错误!')),
        email: Joi.string().email().required().error(new Error('邮箱验证出现错误!')),
        password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).required().error(new Error('密码格式出现错误!'))


    }

    //事实验证
    return Joi.validate(user, schema)
}



//开放Student

module.exports = {
    User,
    validateUser,
    registerUser
}