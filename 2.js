const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken'); //用来生成token
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();
//允许跨域
app.use(cors());
// 只支持 application/x-www-form-urlencoded 文件结构
// app.use(bodyParser.urlencoded({ extended: false }))
let jsonParser = bodyParser.json();
let urlencoded = bodyParser.urlencoded({ extended: false });
let connection = mongoose.createConnection('mongodb://localhost/mongodb', { useNewUrlParser: true });
//设置变量类型
let schema = new mongoose.Schema({
    area: String,
    prov: String,
    city: String,
    dealer: String,
    name: String,
    address: String,
    phone: String,
    code: String
});
let user = new mongoose.Schema({
    name: String,
    pass: String,
});
let Todo = connection.model('dealers', schema);
let Bm = connection.model('users', user);
app.post('/getdata', jsonParser, (req, res) => {
    let currData = req.body.currData;
    let currentpage = req.body.currentpage;
    let pageStart = 0,
        pageEnd = 0,
        len = 0;
    pageEnd = currData * currentpage;
    pageStart = pageEnd - currData;
    //获取总数据
    Todo.find().estimatedDocumentCount().then((data) => {
        len = data;
    });
    Todo.find().skip(pageStart).limit(currData).exec((err, data) => {
        if (err) throw err;
        res.json({ data: data, len: len })
    });
});
//登录接口
app.post('/login', jsonParser, (req, res) => {
    let name = req.body.name;
    let pass = req.body.pass;
    Bm.find({ name: name }).exec((err, data) => {
        if (err) throw err;
        if (data.length != 0) {
            let content = { name: req.body.name }; // 要生成token的主题信息
            let secretOrPrivateKey = "jwt"; // 这是加密的key（密钥）
            let token = jwt.sign(content, secretOrPrivateKey, {
                expiresIn: 60 * 60 * 1 // 1小时过期
            });
            if (pass != data[0].pass) {
                res.json({ status: 2, mess: '密码错误' });
                return false;
            }
            res.json({ status: 1, mess: 'ok', token: token, user_name: req.body.name })
        } else {
            res.json({ status: 401, mess: '账户不存在' });
        }
    });
});
//每次切换都去调用此接口 用来判断token是否失效 或者过期
app.post('/checkUser', jsonParser, (req, res) => {
    let token = req.get("Authorization"); // 从Authorization中获取token
    let secretOrPrivateKey = "jwt"; // 这是加密的key（密钥）
    jwt.verify(token, secretOrPrivateKey, (err, decode) => {
        if (err) { //  时间失效的时候 || 伪造的token
            res.send({ 'status': 10010 });
        } else {
            res.send({ 'status': 10000 });
        }
    })
});
app.listen(3000, () => {
    console.log('Server run 3000')
});