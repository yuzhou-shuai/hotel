//引用express框架
const express = require('express')
    //创建网站服务器
const app = express()
    //导入dateformat第三方模块
const dataFormat = require('dateformat')

//引入body-parser模块，处理post请求参数
const bodyPaeser = require('body-parser')

//导入express-session模块
const session = require('express-session')


//导入config模块
const config = require('config')

//处理路径
const path = require('path')
    //数据库连接保存
require('./model/connect')






//处理post请求参数
app.use(bodyPaeser.urlencoded({ extended: false }))
    //配置session
app.use(session({
    secret: 'secret key',
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: 60 * 60 * 1000
    }
}))


//导入art-template 模块
const template = require('art-template')
    //向模板中导入dataformat变量
template.defaults.imports.dataFormat = dataFormat

//告诉express框架模板所在的位置
app.set('views', path.join(__dirname, 'views'))
    //告诉模板的文件默认后缀是什么
app.set('view engine', 'html')
    //当渲染后缀为html的模板时，所使用的的模板引擎是什么
app.engine('html', require('express-art-template'))

//开放静态资源文件
app.use(express.static(path.join(__dirname, 'public')))

//获取系统环境变量
if (process.env.NODE_ENV == 'development') {
    console.log('当前开发环境')
} else {
    console.log('当前生产环境')
}


//引入路由模块
const home = require('./route/home')
const admin = require('./route/admin')

//拦截所有请求，判断用户登录状态
app.use('/admin', require('./middleware/loginGuard'))


//为路由匹配请求路径
app.use('/home', home)
app.use('/admin', admin)









//监听80端口
app.listen(5000, () => {
    console.log('服务器启动成功');

})