//连接数据库
//引入mongoose第三方模块
//数据库模块
const mongoose = require('mongoose')



//连接数据库

mongoose.set('useCreateIndex', true)
mongoose.connect('mongodb://zhouyu:123456@localhost:27017/hotel', { useNewUrlParser: true, useUnifiedTopology: true })




.then(() => console.log('数据库连接成功'))
    .catch(err => console.log(err, '数据库连接失败'))