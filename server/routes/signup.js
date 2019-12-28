var express = require('express');
const config = require('config-lite')(__dirname);//读取配置
const jwt = require("jsonwebtoken");
const { userModel } = require("../models/User")
const { FAIL_MSG, SUCCESS_MSG } = require('../constants');

var router = express.Router();

//jwt secretKey 
const SECRETKEY = config.SECRETKEY;
const EXPIRESIN = config.EXPIRESIN;

//FORMAT OF TOKEN
// Authorization: Bearer <access_token>

//需要生成token， 在注册和登录业务中
router.post('/', async (req, res, next) => {

    const user = {
        _id: req.body.username,
        username: req.body.username,
        password: req.body.password,
        year_first_grade: req.body.year_first_grade,
        type: req.body.type,
    }

    const theUser = await userModel.findById(user._id);

    if (theUser === null) {//如果用户不存在，则将数据存入数据库，并且生成token
        //1. 则将数据存入数据库
        const createdUser = await userModel.create(user);

        //2. 并且生成token
        const payload = { username: user.username };
        jwt.sign(payload, SECRETKEY, { expiresIn: EXPIRESIN }, (err, token) => {
            //3. 返回token
            res.json({
                ...SUCCESS_MSG
                ,
                token
            });
        });

    } else {//如果用户名存在，则返回错误信息
        res.status(422).send({
            ...FAIL_MSG,
            message: '用户名已被使用',
        });
    }
});


module.exports = router;
