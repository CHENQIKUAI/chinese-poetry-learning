var express = require('express');
const verifyToken = require("../middlewares/verifyToken")
const verifyAdmin = require("../middlewares/verifyAdmin")
const { PoetryModel } = require("../models/Poetry")
const { MustLearnPoetryModel } = require("../models/MustLearn")
const { FavoritePoetryModel } = require("../models/FavoritePoetry")
const { CollectedPoetryModel } = require("../models/CollectedPoetry")

const { FAIL_MSG, SUCCESS_MSG } = require('../constants');
const { getFuzzyMatchingFilterObj } = require("../utils/filter")
var router = express.Router();

function deletePoetryRef(_id) {
    const promise_arr = [
        MustLearnPoetryModel.remove({ poetry_id: _id }),
        FavoritePoetryModel.remove({ poetry_id: _id }),
        CollectedPoetryModel.remove({ poetry_id: _id })
    ];
    return Promise.all(promise_arr)
}

router.post('/getPoetries', verifyToken, async (req, res, next) => {
    const { current, pageSize, filterObj } = req.body;
    const findObj = getFuzzyMatchingFilterObj(filterObj);
    console.info(findObj);
    const total = await PoetryModel.find(findObj).countDocuments()
    if (total === 0) {
        res.json({
            ...SUCCESS_MSG,
            current: 1,
            result: [],
            total: 0,
        })
    }
    if (total - (current - 1) * pageSize > 0) {
        PoetryModel.find(findObj).skip((current - 1) * pageSize).limit(pageSize).then((docs) => {
            res.json({
                ...SUCCESS_MSG,
                current,
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
        const total = await PoetryModel.find().countDocuments()
        await deletePoetryRef(_id);

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