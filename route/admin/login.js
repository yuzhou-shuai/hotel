//导入用户集合构造函数
const { User } = require('../../model/user')

//导入bcrypt
const bcrypt = require('bcryptjs')





module.exports = async(req, res, next) => {
    //接受请求参数
    const { email, password } = req.body
        //如果用户没有输入邮箱地址
    if (email.trim().length == 0 || password.trim().length == 0) {
        return res.status(400).render('admin/err', { msg: '邮件地址或者密码错误!' })
    }

    //根据邮箱地址查询用户信息
    //如果查询到了用户，user是对象类型
    //没有查询到user变量为空
    let user = await User.findOne({ email: email })
        //查询到了用户
    if (user) {

        //将客户端传递过来的密码和用户信息中的密码进行比对
        //true比对成功
        //false比对失败
        //isValue是布尔值
        let isValue = await bcrypt.compare(password, user.password)

        if (isValue) {
            //登陆成功
            //将用户名存储在请求对象session里
            req.session.username = user.username

            //将用户角色存储在session对象里
            req.session.role = user.role

            req.session.user = user


            //将用户信息存放在locals对象中的userInfor中,在模板中就能直接拿到
            //不用通过渲染手段
            //req.app 就是将app.js导入后里面的app



            //对用户权限进行判断
            if (user.state == '0') {
                //继续向下执行
                next()
            } else {
                //跳转到登录首页
                res.redirect('/admin/login/')

            }

            //对用户的角色进行判断
            if (user.role == 'admin') {
                //重定向到用户列表页
                res.redirect('/admin/user')
            } else {
                //跳转到博客首页
                res.redirect('/home/')
            }




        } else {
            //登陆失败
            res.status(400).render('admin/err', { msg: '邮件地址或者密码错误!' })
        }

    } else {
        //没有查询到用户
        res.status(400).render('admin/err', { msg: '邮件地址或者密码错误!' })
    }


}