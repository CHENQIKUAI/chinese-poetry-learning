const jwt = require("jsonwebtoken");
const config = require('config-lite')(__dirname);//读取配置
const { FAIL_MSG } = require('../constants');

const SECRETKEY = config.SECRETKEY;

const verifyToken = (req, res, next) => {
    //Get auth header value
    const token = req.body.token;

    if (!token) { // 如果没有token
        res.json({
            ...FAIL_MSG,
            message: "没有token发送过来？",
        })
    } else {    // 如果有token

        jwt.verify(token, SECRETKEY, async (err, authData) => {
            if (err) {
                res.json({
                    ...FAIL_MSG,
                    message: "token验证错误",
                    err
                })
            } else {
                // 通过验证
                next();
            }
        })
    }
}

module.exports = verifyToken;