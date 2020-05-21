const jwt = require("jsonwebtoken");
const config = require('config-lite')(__dirname);//读取配置
const { FAIL_MSG } = require('../constants');
const User = require("../models/User").userModel;

const SECRETKEY = config.SECRETKEY;

const verifyToken = (req, res, next) => {
    const bearerHeader = req.headers['authorization'];
    if (typeof bearerHeader !== undefined) {
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];

        if (!bearerToken) { // 如果没有token
            res.json({
                ...FAIL_MSG,
                message: "没有token发送过来？",
            })
        } else {    // 如果有token
            jwt.verify(bearerToken, SECRETKEY, async (err, authData) => {
                if (err) {
                    res.json({
                        code: 0,
                        message: "token验证错误",
                        err
                    })
                } else {
                    // Token验证通过
                    const { username, type, _id } = authData
                    req.body.user = {
                        username,
                        type,
                        _id,
                    }
                    next();
                }
            })
        }
    } else {
        res.json({
            ...FAIL_MSG,
            message: "没有token发送过来？",
        })
    }
}

module.exports = verifyToken;