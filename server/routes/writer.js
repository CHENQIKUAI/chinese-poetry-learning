var express = require('express');
const config = require('config-lite')(__dirname);//读取配置
const verifyToken = require("../middlewares/verifyToken")
const verifyAdmin = require("../middlewares/verifyAdmin")
const { WriterModel } = require("../models/Writer")
const { FAIL_MSG, SUCCESS_MSG } = require('../constants');
var router = express.Router();


router.post('/getWriters', verifyToken, verifyAdmin, async (req, res, next) => {

    const { currentPage, pageSize } = req.body;
    const total = await WriterModel.find().count()

    if (total - (currentPage - 1) * pageSize > 0) {
        WriterModel.find().skip((currentPage - 1) * pageSize).limit(pageSize).then((docs) => {
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
            message: "您的查询超出了作者总量！"
        })
    }
});


//增加
router.post('/createWriter', verifyToken, verifyAdmin, async (req, res, next) => {
    const { writer } = req.body;

    WriterModel.create(writer).then((doc) => {
        res.json({
            ...SUCCESS_MSG,
            message: '作者创建成功',
        })
    }).catch((err) => {
        res.json({
            ...FAIL_MSG,
            message: "作者创建失败",
            error: err,
            writer,
        })
    })

});


//删除
router.post('/deleteWriter', verifyToken, verifyAdmin, async (req, res, next) => {
    const { _id } = req.body;
    WriterModel.findByIdAndRemove(_id).then((doc) => {
        res.json({
            ...SUCCESS_MSG,
            message: "作者删除成功",
        })
    }).catch((err) => {
        res.json({
            ...FAIL_MSG,
            message: "作者删除失败",
            error: err,
        })
    })
});


//修改
router.post('/modifyWriter', verifyToken, verifyAdmin, async (req, res, next) => {
    const { writer } = req.body;
    const _id = writer._id;

    WriterModel.findByIdAndUpdate(_id, writer).then((doc) => {
        res.json({
            ...SUCCESS_MSG,
            message: "修改成功",
        })
    }).catch((err) => {
        res.json({
            ...FAIL_MSG,
            message: "修改失败",
            error: err
        })
    })
});


module.exports = router;