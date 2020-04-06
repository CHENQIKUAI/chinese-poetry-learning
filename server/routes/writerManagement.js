var express = require('express');
const verifyToken = require("../middlewares/verifyToken")
const verifyAdmin = require("../middlewares/verifyAdmin")
const { WriterModel } = require("../models/Writer")
const { FAIL_MSG, SUCCESS_MSG } = require('../constants');
const { getFuzzyMatchingFilterObj } = require("../utils/filter")
var router = express.Router();

router.post('/getWriters', verifyToken, verifyAdmin, async (req, res, next) => {
    const { current, pageSize, filterObj } = req.body;
    const findObj = getFuzzyMatchingFilterObj(filterObj);
    const total = await WriterModel.find(findObj).countDocuments()
    if (total === 0) {
        res.json({
            ...SUCCESS_MSG,
            current,
            pageSize,
            result: [],
            total: 0,
        })
    }
    if (total - (current - 1) * pageSize > 0) {
        WriterModel.find(findObj).skip((current - 1) * pageSize).limit(pageSize).then((docs) => {
            res.json({
                ...SUCCESS_MSG,
                current,
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
            message: "您查询的范围有误！",
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
    const total = await WriterModel.find().countDocuments();
    WriterModel.findByIdAndRemove(_id).then((doc) => {
        res.json({
            ...SUCCESS_MSG,
            message: "作者删除成功",
            total
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