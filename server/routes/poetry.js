var express = require('express');
const config = require('config-lite')(__dirname);//读取配置
const verifyToken = require("../middlewares/verifyToken")
const verifyAdmin = require("../middlewares/verifyAdmin")
const { PoetryModel } = require("../models/Poetry")
const { FAIL_MSG, SUCCESS_MSG } = require('../constants');
var router = express.Router();


router.post('/getPoetries', verifyToken, verifyAdmin, async (req, res, next) => {

    const { currentPage, pageSize } = req.body;
    const total = await PoetryModel.find().count()

    if (total - (currentPage - 1) * pageSize > 0) {
        PoetryModel.find().skip((currentPage - 1) * pageSize).limit(pageSize).then((docs) => {
            res.json({
                ...SUCCESS_MSG,
                currentPage,
                pageSize,
                result: docs,
                total,
            })
        }).catch((e) => {
            res.json({
                ...FAIL_MSG,
                message: "数据库查询错误",
                err: e,
            })
        })
    } else {
        res.json({
            ...FAIL_MSG,
            message: "您的查询超出了诗词总量！"
        })
    }
});



// 增加
router.post('/createPoetry', verifyToken, verifyAdmin, async (req, res, next) => {
    const { poetry } = req.body;

    if (!poetry) {
        res.json({
            ...FAIL_MSG,
            message: "参数poetry错误",
        })
    }

    PoetryModel.create(poetry).then((result) => {
        res.json({
            ...SUCCESS_MSG,
            message: "新建成功"
        })
    }).catch((err) => {
        res.json({
            ...FAIL_MSG,
            message: "数据库操作错误",
            error: err
        })
    })
});



// 删除
router.post('/deletePoetry', verifyToken, verifyAdmin, (req, res, next) => {

    const { _id } = req.body;
    if (!_id)
        res.json({
            ...FAIL_MSG,
            message: "参数_id错误",
        })
    PoetryModel.remove({ _id }).then(async (result) => {
        const total = await PoetryModel.find().count()

        res.json({
            ...SUCCESS_MSG,
            total,
            message: "删除成功",
        })
    }).catch((err) => {
        res.json({
            ...FAIL_MSG,
            message: "数据库操作错误",
            error: err
        })
    });
});


// 修改
router.post('/modifyPoetry', verifyToken, verifyAdmin, async (req, res, next) => {
    const { poetry } = req.body;
    if (!poetry)
        res.json({
            ...FAIL_MSG,
            message: "参数poetry错误",
        })
    const { _id } = poetry;
    PoetryModel.findByIdAndUpdate({ _id }, poetry).then((result) => {
        res.json({
            ...SUCCESS_MSG,
            message: "修改成功"
        })
    }).catch((err) => {
        res.json({
            ...FAIL_MSG,
            message: "数据库操作错误",
            error: err
        })
    })
});



module.exports = router;