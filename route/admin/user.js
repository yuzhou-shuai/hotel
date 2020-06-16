//导入mongoose-sex-page模块
const pagination = require('mongoose-sex-page')

//引入用户集合
const { User } = require('../../model/user')

module.exports = async(req, res) => {
    //标识，当前访问的事用户管理页面
    req.app.locals.currentLink = 'user'



    //接受客户端传递过来的当前页参数
    let page = req.query.page
        //设置每页数据条数
        // let pagesize = 7
        //查询用户数据总条数
        //let count = await User.countDocuments({})
        //总页数
        //  let total = Math.ceil(count / pagesize)

    //页码对应开始位置
    // let start = (page - 1) * pagesize
    //将用户信息从数据库中查询出来
    //limit限制查询结果条数
    //skip页码对应的开始位置
    //let users = await User.find({}).limit(pagesize).skip(start)

    let users = await pagination(User).find({}).page(page).size(6).display(4).exec()


    res.render('admin/user', {
        users: users,
        user: req.session.user

    })

}