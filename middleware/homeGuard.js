module.exports = (req, res, next) => {
    //判断用户访问的是否是登录页面
    //判断用户的的登录状态
    //判断是否生成session下的username
    if (!req.session.username) {
        if (req.url == '/password') {
            return next()
        } else if (req.url == '/article') {
            return next()
        }
        return res.redirect('/home')

    } else {


        next()

    }

}