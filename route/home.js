//引用express框架
const express = require('express')
    //创建博客展示页面路由
const home = express.Router()
    //导入bcrypt
const bcrypt = require('bcryptjs')

const { List } = require('../model/list')
const { Comment } = require('../model/comment')
const { Preview } = require('../model/preview')
const { User } = require('../model/user')

//导入mongoose-sex-page模块
const pagination = require('mongoose-sex-page')

//酒店前台展示页面
home.get('/', async(req, res) => {
    // 获取页码值
    const page = req.query.page;

    // 从数据库中查询数据
    let result = await pagination(List).page(page).size(5).display(5).find().exec();

    // res.send('欢迎来到博客首页')
    // 渲染模板并传递数据
    //查询评论信息
    let comment = await Comment.find().populate('uid')

    res.render('home/default.html', {
        result: result,
        comment: comment,
        user: req.session.user
    });
})

//房间详情渲染
home.get('/article', async(req, res) => {

    //即将要修改的用户id
    const page = req.query.page
    const id = req.query.id
    let result = await List.findOne({ _id: id })
    let previews = await pagination(Preview).find({ uid: id }).page(page).size(8).display(5).populate({ path: 'uid', select: 'content price' }).exec()

    if (previews.total >= 3) {
        await List.updateOne({ _id: id }, {

            state: 'man'

        })
    } else if (previews.total < 3) {
        await List.updateOne({ _id: id }, {

            state: 'yu'

        })
    }


    res.render('home/preview.html', {
        result: result,
        previews: previews,
        user: req.session.user
    });

})


//我的订单渲染
home.get('/order', async(req, res) => {
    //即将要修改的用户id
    const id = req.query.id


    let previews = await Preview.find({ aid: id }).populate({ path: 'uid', select: 'content  cover' })
    let result = await pagination(Preview).find({ aid: id }).page(1).size(8).display(8).exec()
    res.render('home/order', {
        previews: previews,
        result: result,
        user: req.session.user

    });

})


//用户删除预订信息路由
home.get('/order-delete', async(req, res) => {
    //获取要删除的用户id

    const id = req.session.user._id

    //res.send(req.query)

    //根据用户id删除用户
    await Preview.findByIdAndDelete({ _id: req.query.id })
        //重定向到用户界面
    res.redirect('/home/order?id=' + id)


})




//评论路由
home.post('/comment', async(req, res) => {



    const { content, uid } = req.body

    //将评论信息存储在评论集合中
    await Comment.create({

        content: content,
        uid: uid,

        time: new Date()
    })
    res.redirect('/home')
})



//实现退出功能
home.get('/logout', (req, res) => {
    //删除session
    req.session.destroy(function() {
        //删除cookie
        res.clearCookie('connect.sid')

        //重定向到登录页面
        res.redirect('/admin/login')
    })

})




//预订信息
home.post('/preview', async(req, res) => {



    const { name, intime, outtime, tel, idcard, remark, aid, uid, price } = req.body


    //将评论信息存储在评论集合中
    await Preview.create({
        aid: aid,
        name: name,
        intime: intime,
        outtime: outtime,
        tel: tel,
        idcard: idcard,
        remark: remark,
        uid: uid,
        price: price,
        time: new Date()

    })
    res.redirect('/home')
})


//渲染修改密码页面
home.get('/password', (req, res) => {

    res.render('home/password', {
        user: req.session.user
    })


})

//修改密码功能路由
home.post('/modify-pwd', async(req, res) => {



    // 判断用户是否处于登录状态
    if (req.session.user) {
        // 原始正确密码
        const originPass = req.session.user.password;

        // 用户id
        const _id = req.session.user._id;
        // 获取新密码以及确认密码
        const { userPass, newPass, confirmPass } = req.body;

        // 如果用户输入的密码和原始密码一致
        if (await bcrypt.compare(userPass, originPass)) {

            //修改的新密码不能与原始密码一致
            if (userPass == newPass || userPass == confirmPass) {
                res.render('home/password', { message: '新密码不能与原始密码一样！' });
            }

            // 如果用户输入的两次密码相同
            if (newPass == confirmPass) {
                // 更新密码
                // 生成盐
                const salt = await bcrypt.genSalt(10);
                const finalPass = await bcrypt.hash(newPass, salt);
                await User.findByIdAndUpdate(_id, { password: finalPass })



                //清除模板中的用户信息
                req.session.destroy(function() {
                    //删除cookie
                    res.clearCookie('connect.sid')
                        //重定向到登录页面
                    res.redirect('/admin/login')
                        //清除模板中的用户信息
                    req.app.locals.userInfo = null
                })
            } else {
                res.render('home/password', { message: '两次新密码输入的不相同！' });
            }
        } else {
            res.render('home/password', { message: '原始密码输入错误！' })
        }
    } else {
        res.render('home/password', { message: '请先登录，您才能修改密码！' });
    }



})


//将模块路由导出
module.exports = home