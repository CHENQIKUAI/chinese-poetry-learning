var express = require('express');
const config = require('config-lite')(__dirname);//读取配置
const jwt = require("jsonwebtoken");
const sha1 = require("sha1")
const { userModel } = require("../models/User")
const { FAIL_MSG, SUCCESS_MSG } = require('../constants');
var router = express.Router();

//jwt secretKey 
const SECRETKEY = config.SECRETKEY;
const EXPIRESIN = config.EXPIRESIN;

//登录
router.post('/', async (req, res, next) => {
    try {
        const user = {
            username: req.body.username,
            password: req.body.password,
        }
        const theUser = await userModel.findOne({ username: user.username });
        if (theUser !== null) {
            const isEqual = sha1(user.password) === theUser.password;
            if (isEqual) {
                const payload = {
                    username: user.username,
                    type: theUser.type,
                    _id: theUser._id,
                };
                jwt.sign(payload, SECRETKEY, { expiresIn: EXPIRESIN }, (err, token) => {

                    res.json({
                        ...SUCCESS_MSG,
                        token,
                        type: theUser.type,
                        username: user.username,
                    });
                });
            } else {
                res.json({
                    ...FAIL_MSG,
                    message: '密码或账号错误'
                })
            }
        } else {
            res.send({
                ...FAIL_MSG,
                message: '用户名不存在'
            });
        }
    } catch (error) {
        res.json({
            message: "这里出错啦"
        })
    }
});


module.exports = router;
