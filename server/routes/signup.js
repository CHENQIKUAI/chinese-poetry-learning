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

    try {
        let year_first_grade = undefined;

        const username = req.body.username;
        const password = req.body.password;
        const grade = req.body.grade;

        const date = new Date();
        const year = date.getFullYear();
        const month = date.getMonth() + 1;


        if (month > 9) {
            year_first_grade = year - grade + 1;
        } else {
            year_first_grade = year - grade;
        }

        const user = {
            username,
            password,
            year_first_grade,
            type: 1,
        }

        const theUser = await userModel.findOne({ username: user.username });

        if (theUser === null) {//如果用户不存在，则将数据存入数据库，并且生成token
            //1. 则将数据存入数据库
            const createdUser = await userModel.create(user);

            //2. 并且生成token
            const payload = {
                username: user.username,
                type: 1,
                _id: createdUser._id,
            };

            jwt.sign(payload, SECRETKEY, { expiresIn: EXPIRESIN }, (err, token) => {
                //3. 返回token
                res.json({
                    ...SUCCESS_MSG,
                    token,
                    type: 1,
                    username: user.username,
                });
            });

        } else {//如果用户名存在，则返回错误信息
            res.send({
                ...FAIL_MSG,
                message: '用户名已被使用',
            });
        }
    } catch (e) {
        console.error(e);

        res.json({
            ...FAIL_MSG,
            message: "后端错误!!!!!!!!!!!!"
        })
    }

});



router.post('/checkUsername', (req, res, next) => {
    const username = req.body.username;
    userModel.findOne({ username }).then((result) => {
        if (result !== null) {
            res.json({
                ...SUCCESS_MSG,
                result: true,
            })
        } else {
            res.json({
                ...FAIL_MSG,
                result: false,
            })
        }
    })

});


module.exports = router;
