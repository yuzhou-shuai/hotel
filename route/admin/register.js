//引入用户集合
const { User, registerUser } = require('../../model/user')

//导入bcrypt
const bcrypt = require('bcryptjs')




module.exports = async(req, res) => {


    try {
        await registerUser(req.body)
    } catch (e) {
        //验证没有通过
        //重定向到用户添加页面
        return res.redirect('/admin/register')

    }

    // 根据邮箱地址查询用户输入的邮箱或者用户名是否存在
    // let user = await User.findOne({ email: req.body.email })
    let user = await User.findOne({
            $or: [

                {
                    email: req.body.email
                },
                {
                    username: req.body.username
                }
            ]
        })
        //如果用户已经存在
    if (user) {
        //重定向到用户添加页面
        return res.render('admin/success', { msg: '对不起，用户名或者邮箱已经被占用！请重新输入!' })
    }
    //对密码进行加密
    //生成随机字符串
    const salt = await bcrypt.genSalt(10)

    //加密
    const password = await bcrypt.hash(req.body.password, salt)
        //替换密码
    req.body.password = password
        //将用户信息添加到数据库中
    await User.create(req.body)
        //重定向到用户列表页面
    res.render('admin/suc', { msg: '恭喜您注册成功!3秒后返回登录页面' })
}