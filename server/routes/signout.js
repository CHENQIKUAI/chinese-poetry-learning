var express = require('express');
const config = require('config-lite')(__dirname);//读取配置
const jwt = require("jsonwebtoken");
var router = express.Router();

//jwt secretKey 
const SECRETKEY = config.SECRETKEY;
const EXPIRESIN = config.EXPIRESIN;


router.post('/', (req, res, next) => {
    res.json({
        code: 1,
        status: 'success',
        message: "ok",
    })
});


module.exports = router;
