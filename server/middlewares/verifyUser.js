const jwt = require("jsonwebtoken");
const config = require('config-lite')(__dirname);//读取配置
const { FAIL_MSG } = require('../constants');
const User = require("../models/User").userModel;

const SECRETKEY = config.SECRETKEY;

const verifyUser = (req, res, next) => {
    //Get auth header value
    const user = req.body.user;

    const { type } = user;
    if (type !== 1) {
        res.json({
            ...FAIL_MSG,
            message: "权限错误，不是用户"
        })
    } else {
        next();
    }
}

module.exports = verifyUser;