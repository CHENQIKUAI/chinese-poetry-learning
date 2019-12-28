var express = require('express');
const config = require('config-lite')(__dirname);//读取配置
const jwt = require("jsonwebtoken");
const verifyToken = require("../middlewares/verifyToken")
const { userModel } = require("../models/User")
const { FAIL_MSG, SUCCESS_MSG } = require('../constants');
var router = express.Router();

//jwt secretKey 
const SECRETKEY = config.SECRETKEY;

//验证是否有token，token是否正确
router.post('/', verifyToken, (req, res, next) => {
    res.json({
        ...SUCCESS_MSG,
        message: "成功进入"
    })
});

module.exports = router;
