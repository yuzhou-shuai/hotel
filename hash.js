//导入bcrypt
const bcrypt = require('bcryptjs')




async function run() {

    const salt = await bcrypt.genSalt(10)
        //对密码进行加密
        //1.要加密的明文
        //2.随机字符串
    const result = await bcrypt.hash('123456', salt)
    console.log(result)
}
run()