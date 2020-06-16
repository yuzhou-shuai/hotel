//引用express框架
const express = require('express')
    //创建博客管理页面路由
const admin = express.Router()

//导入bcrypt
const bcrypt = require('bcryptjs')

const url = require('url')

//导入formidable模块
const formidable = require('formidable')

const path = require('path')

//导入mongoose-sex-page模块
const pagination = require('mongoose-sex-page')



//引入数据集合
const { User } = require('../model/user')
const { List } = require('../model/list')
const { Comment } = require('../model/comment')
const { Preview } = require('../model/preview')



//渲染登录页面
admin.get('/login', (req, res) => {
    res.render('admin/login')
})



//实现登录功能
admin.post('/login', require('./admin/login'))


//创建用户列表路由
admin.get('/user', require('./admin/user'))



//实现退出功能
admin.get('/logout', (req, res) => {
    //删除session
    req.session.destroy(function() {
        //删除cookie
        res.clearCookie('connect.sid')
            //重定向到登录页面
        res.redirect('/admin/login')

    })

})


//渲染注册页面
admin.get('/register', (req, res) => {
    res.render('admin/register')
})


//实现用户注册功能
admin.post('/register', require('./admin/register'))



//创建用户编辑页面
admin.get('/user-edit', async(req, res) => {
    //标识，当前访问的事用户管理页面
    req.app.locals.currentLink = 'user'


    //获取地址栏参数，解构message
    const { message, id } = req.query

    if (id) {
        //修改操作
        let users = await User.findOne({ _id: id })
            //渲染用户编辑页面
        res.render('admin/user-edit', {
            message: message,
            users: users,
            link: '/admin/user-modify?id=' + id,
            button: '修改',
            user: req.session.user
        })
    } else {
        //添加操作
        res.render('admin/user-edit', {
            message: message,
            link: '/admin/user-edit',
            button: '添加',
            user: req.session.user

        })
    }
})


//创建实现用户添加路由
admin.post('/user-edit', require('./admin/user-edit'))




//修改用户数据路由
admin.post('/user-modify', async(req, res, next) => {
    //接受客户端传递过来的请求参数
    const { username, email, role, state, password } = req.body


    //即将要修改的用户id
    const id = req.query.id

    //根据id查询用户信息，进行比对
    let user = await User.findOne({ _id: id })

    //密码比对
    const isValid = await bcrypt.compare(password, user.password)
        //密码比对成功
    if (isValid) {



        //将用户信息更新到数据库中
        await User.updateOne({ _id: id }, {
            username: username,
            email: email,
            role: role,
            state: state
        })
        res.redirect('/admin/user')


    } else {
        //密码比对失败
        //重定向到用户添加页面
        let obj = { path: '/admin/user-edit', message: '密码比对失败，不能进行用户信息的修改', id: id }
        next(JSON.stringify(obj))
    }
})



//删除用户功能路由
admin.get('/delete', async(req, res) => {
    //获取要删除的用户id
    //res.send(req.query)
    //根据用户id删除用户
    await User.findByIdAndDelete({ _id: req.query.id })
        //重定向到用户界面
    res.redirect('/admin/user')



})



//房间列表路由
admin.get('/article', async(req, res) => {
    //标识，当前访问的事文章管理页面
    req.app.locals.currentLink = 'article'
        //接受客户端传递过来的页码
    const page = req.query.page
        //查询所有文章数据
        //多集合查询populate()
        //page指定当前页
        //size每页显示数据条数
        //display指定客户端显示的页码数量
        //exec向数据库中发送查询请求
    let lists = await pagination(List).find().page(page).size(5).display(5).exec()
        //渲染文章列表模板
    res.render('admin/article', {
        lists: lists,
        user: req.session.user
    })

})


//房间编辑页面路由
admin.get('/article-edit', async(req, res) => {
    //标识，当前访问的是文章管理页面
    req.app.locals.currentLink = 'article'

    const { id } = req.query

    if (id) {

        //修改操作
        let list = await List.findOne({ _id: id })

        res.render('admin/article-edit.html', {
            list: list,
            user: req.session.user,
            button: '修改',
            link: '/admin/article-modify?id=' + id

        })

    } else {
        res.render('admin/article-edit.html', {
            button: '提交',
            link: '/admin/article-add',
            user: req.session.user
        })
    }



})

//实现文章添加功能路由
admin.post('/article-add', require('./admin/article-add'))



//删除用户功能路由
admin.get('/article-delete', async(req, res) => {
    //获取要删除的用户id
    //res.send(req.query)
    //根据用户id删除用户
    await List.findByIdAndDelete({ _id: req.query.id })
        //重定向到用户界面
    res.redirect('/admin/article')



})



//修改文章功能路由
admin.post('/article-modify', async(req, res) => {


    //即将要修改的用户id
    const { id } = req.query


    res.redirect('/admin/article')

    //1.创建表单解析对象
    const form = new formidable.IncomingForm()
        //2.配置上传文件的存放位置
    form.uploadDir = path.join(__dirname, '../', 'public', 'uploads')
        //3.保留上传文件的后缀
    form.keepExtensions = true
        //4.解析表单
    form.parse(req, async(err, fields, files) => {
        //1.err错误对象，如果表单解析失败，err里面存储错误信息，如果表单解析成功将会是null
        //2.fields对象类型，保存普通表单数据
        //3.files对象类型，保存与上传文件相关的数据

        await List.updateOne({ _id: id }, {
            cover: files.cover.path.split('public')[1],
            content: fields.content,
            people: fields.people,
            bed: fields.bed,
            price: fields.price,
            state: fields.state,
            jianjie: fields.jianjie
        })
        res.redirect('/admin/article')
    })


})





//评论列表路由
admin.get('/comment', async(req, res) => {

    //标识，当前访问的事文章管理页面
    req.app.locals.currentLink = 'comment'
        //接受客户端传递过来的页码
    const page = req.query.page
        //查询所有文章数据
        //多集合查询populate()
        //page指定当前页
        //size每页显示数据条数
        //display指定客户端显示的页码数量
        //exec向数据库中发送查询请求
    let comments = await pagination(Comment).find().page(page).size(7).display(5).populate('uid').exec()
    res.render('admin/comment', {
        comments: comments,
        user: req.session.user
    })

})


//预订信息列表路由
admin.get('/preview', async(req, res) => {
    //标识，当前访问的事文章管理页面
    req.app.locals.currentLink = 'preview'
        //接受客户端传递过来的页码
    const page = req.query.page
        //查询所有文章数据
        //多集合查询populate()
        //page指定当前页
        //size每页显示数据条数
        //display指定客户端显示的页码数量
        //exec向数据库中发送查询请求
    let previews = await pagination(Preview).find().page(page).size(7).display(5).populate([{ path: 'uid', select: 'content price' }, { path: 'aid', select: 'username' }]).exec()
    res.render('admin/preview', {
        previews: previews,
        user: req.session.user
    })

})



//删除评论功能路由
admin.get('/comment-delete', async(req, res) => {
    //获取要删除的用户id
    //res.send(req.query)

    //根据用户id删除用户
    await Comment.findByIdAndDelete({ _id: req.query.id })
        //重定向到用户界面
    res.redirect('/admin/comment')


})


//删除预订信息路由
admin.get('/preview-delete', async(req, res) => {
    //获取要删除的用户id
    //res.send(req.query)

    //根据用户id删除用户
    await Preview.findByIdAndDelete({ _id: req.query.id })
        //重定向到用户界面
    res.redirect('/admin/preview')


})

//修改密码功能路由
admin.get('/password', (req, res) => {

    res.render('admin/password', {
        user: req.session.user
    })


})

//上传页面功能路由
admin.get('/pic', (req, res) => {

    res.render('admin/picture', {
        user: req.session.user
    })


})

//修改密码功能路由
admin.post('/modify-pwd', async(req, res) => {



    // 判断用户是否处于登录状态

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
            res.render('admin/password', { message: '新密码不能与原始密码一样！' });
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
            res.render('admin/password', { message: '两次新密码输入的不相同' });
        }
    } else {
        res.render('admin/password', { message: '原始密码输入错误' })
    }




})


//上传头像功能路由
admin.post('/load', async(req, res) => {

    // 用户id
    const id = req.session.user._id;

    //1.创建表单解析对象
    const form = new formidable.IncomingForm()
        //2.配置上传文件的存放位置
    form.uploadDir = path.join(__dirname, '../', 'public', 'uploads')
        //3.保留上传文件的后缀
    form.keepExtensions = true
        //4.解析表单
    form.parse(req, async(err, fields, files) => {
        //1.err错误对象，如果表单解析失败，err里面存储错误信息，如果表单解析成功将会是null
        //2.fields对象类型，保存普通表单数据
        //3.files对象类型，保存与上传文件相关的数据

        await User.updateOne({ _id: id }, {
            avatar: files.avatar.path.split('public')[1]

        })
        res.redirect('/admin/user')
    })


})



admin.get('/bian', async(req, res) => {


    const { id } = req.query
    const result = await Preview.findOne({ _id: id })


    if (result.state == 0) {
        result.state = 1
    } else if (result.state == 1) {
        result.state = 0
    }

    await Preview.updateOne({ _id: id }, { state: result.state })
    res.redirect('/admin/preview')

})



//将模块路由导出
module.exports = admin