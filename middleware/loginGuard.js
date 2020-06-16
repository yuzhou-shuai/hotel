module.exports = (req, res, next) => {
    //判断用户访问的是否是登录页面
    //判断用户的的登录状态
    //判断是否生成session下的username

    if (req.url != '/login' && !req.session.username) {
        if (req.url == '/register') {
            return next()
        }
        //如果用户不是登录的，重定向到登录页面
        res.redirect('/admin/login')
    } else {

        next()




    }
}