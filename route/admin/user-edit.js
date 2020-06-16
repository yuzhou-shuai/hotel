//引入用户集合
const { User, validateUser } = require('../../model/user')

//导入bcrypt
const bcrypt = require('bcryptjs')




module.exports = async(req, res) => {


    try {
        await validateUser(req.body)
    } catch (e) {
        //验证没有通过
        //重定向到用户添加页面
        return res.redirect('/admin/user-edit?message=' + e.message)

    }

    //根据邮箱地址和用户名查询用户输入的邮箱和用户名是否存在
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
        //如果用户和邮箱已经存在
    if (user) {
        //重定向到用户添加页面
        return res.redirect('/admin/user-edit?message=' + '用户名或邮箱地址已经被占用，请重新输入')
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
    res.redirect('/admin/user')
}