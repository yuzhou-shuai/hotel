// 引入mongoose模块
const mongoose = require('mongoose');

// 创建评论集合规则
const previewSchema = new mongoose.Schema({
    // 链接酒店列表信息
    name: {
        type: String

    },
    price: {
        type: Number

    },
    aid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    uid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'List'
    },
    // 身份证号
    idcard: {
        type: Number

    },
    // 手机号
    tel: {
        type: Number
    },
    //入住时间
    intime: {
        type: Date,
        default: Date.now

    },
    //入住时间
    outtime: {
        type: Date,
        default: Date.now,

    },
    state: {
        type: String,
        default: '0'

    },
    //预定时间
    time: {
        type: Date
    },
    // 评论内容
    remark: {
        type: String



    }
});

// 创建评论集合
const Preview = mongoose.model('Preview', previewSchema);

// 将评论集合构造函数作为模块成员进行导出
module.exports = {
    Preview
}