var express = require('express');
const verifyToken = require("../middlewares/verifyToken")
const { FAIL_MSG, SUCCESS_MSG } = require('../constants');
var router = express.Router();



//验证是否有token，token是否正确
router.post('/', verifyToken, (req, res, next) => {
    res.json({
        ...SUCCESS_MSG,
        message: "成功进入"
    })
});


module.exports = router;
