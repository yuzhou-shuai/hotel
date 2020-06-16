//创建集合
//引入mongoose模块

const mongoose = require('mongoose')

//创建酒店集合规则
//1.集合名称
//2.集合规则


const listSchema = new mongoose.Schema({


        cover: {
            type: String,
            required: true,
            default: null
        },
        content: {
            type: String,
            required: true


        },
        people: {
            type: Number,
            required: true

        },
        bed: {
            type: Number,
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        state: {
            type: String,
            required: true,
            default: 'yu'
        },
        jianjie: {
            type: String,
            required: true,
            minlength: 5
        }


    })
    //使用规则创建学生文章集合
const List = mongoose.model('List', listSchema)


//将集合规则为模块成员进行导出
module.exports = {
    List
}