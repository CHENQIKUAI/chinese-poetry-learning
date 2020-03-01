var express = require('express');
const verifyToken = require("../middlewares/verifyToken")
const verifyUser = require("../middlewares/verifyUser");
const { PoetryModel } = require("../models/Poetry")
const { FavoritePoetryModel } = require("../models/FavoritePoetry")
const { FAIL_MSG, SUCCESS_MSG } = require('../constants');
var router = express.Router();

router.post('/getPoetries', verifyToken, verifyUser, async (req, res, next) => {
    const { _id } = req.body.user;
    const { current, pageSize } = req.body;
    const findObj = { user_id: _id };
    const total = await FavoritePoetryModel.find(findObj).countDocuments();

    if (total === 0) {
        res.json({
            ...SUCCESS_MSG,
            current: 1,
            result: [],
            total: 0,
        })
    }

    if (total - (current - 1) * pageSize > 0) {
        FavoritePoetryModel.find(findObj).skip((current - 1) * pageSize).limit(pageSize).then((docs) => {
            const promises = [];
            for (let i = 0; i < docs.length; ++i) {
                const poetry_id = docs[i]._doc.poetry_id;
                promises.push(PoetryModel.findById(poetry_id));
            }

            Promise.all(promises).then((rets) => {
                for (let i = 0; i < rets.length; ++i) {
                    if (rets[i]) {
                        rets[i]._doc.like = true;
                    }
                }
                res.json({
                    ...SUCCESS_MSG,
                    current,
                    result: rets,
                    total,
                })
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
})


module.exports = router