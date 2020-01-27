var express = require('express');
const config = require('config-lite')(__dirname);//读取配置
const jwt = require("jsonwebtoken");
const sha1 = require("sha1")
const verifyToken = require("../middlewares/verifyToken")
const { userModel } = require("../models/User")
const { FAIL_MSG, SUCCESS_MSG } = require('../constants');
var router = express.Router();

//jwt secretKey 
const SECRETKEY = config.SECRETKEY;
const EXPIRESIN = config.EXPIRESIN;

//FORMAT OF TOKEN
// Authorization: Bearer <access_token>

//登录
router.post('/', async (req, res, next) => {
    const user = {
        username: req.body.username,
        password: req.body.password,
        type: req.body.type,
    }

    const theUser = await userModel.findById(user.username);

    if (theUser !== null) {
        const isEqual = sha1(user.password) === theUser.password;
        if (isEqual) {
            const payload = { username: user.username };
            jwt.sign(payload, SECRETKEY, { expiresIn: EXPIRESIN }, (err, token) => {
                res.json({
                    ...SUCCESS_MSG,
                    token
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
});


module.exports = router;
