var express = require('express');
const verifyToken = require("../middlewares/verifyToken")
const verifyUser = require("../middlewares/verifyUser")
const { PoetryModel } = require("../models/Poetry")
const { FavoritePoetryModel } = require("../models/FavoritePoetry")
const { WriterModel } = require("../models/Writer")
const { FAIL_MSG, SUCCESS_MSG } = require('../constants');
var router = express.Router();


router.post('/getPoetry', verifyToken, verifyUser, async (req, res, next) => {

    const { id } = req.body;
    const { user } = req.body;
    const { _id } = user;

    PoetryModel.findById(id).then(async (doc) => {
        const count = await FavoritePoetryModel.find({ user_id: _id, poetry_id: id }).countDocuments();
        const like = count ? true : false;

        const writer = doc._doc.writer;
        WriterModel.findOne({ name: writer }).then((writerDoc => {

            res.json({
                ...SUCCESS_MSG,
                result: {
                    ...doc._doc,
                    like,
                },
                writer: { ...writerDoc._doc, detailIntro: JSON.parse(writerDoc._doc.detailIntro) }
            })

        })).catch(error => {
            res.json({
                ...SUCCESS_MSG,
                result: {
                    ...doc._doc,
                    like,
                },
                writer: null,
            })
        })
    }).catch(error => {
        res.json({
            ...FAIL_MSG,
            error
        })
    })
});


router.post('/getWriter', verifyToken, verifyUser, async (req, res, next) => {
    const { writer } = req.body;

    const doc = await WriterModel.findOne({ name: writer });

    if (doc === null) {
        res.json({
            ...SUCCESS_MSG,
            result: null,
        })
    } else {
        res.json({
            ...SUCCESS_MSG,
            result: {
                ...doc._doc,
                detailIntro: JSON.parse(doc._doc.detailIntro),
            },
        })
    }
});


router.post('/compute', verifyToken, verifyUser, async (req, res, next) => {
    let { fstStr, secStr } = req.body;
    fstStr = fstStr.replace(/[，|。|？|\n]/g, "");
    secStr = secStr.replace(/[，|。|？|\n]/g, "");

    // 计算字符串长度
    const fstStrLen = fstStr.length;
    const secStrLen = secStr.length;

    // 初始化二维表
    let similaritys = [[]];

    // X方向
    for (let i = 0; i <= fstStrLen; i++) {
        if (similaritys[i] === undefined) {
            similaritys[i] = [];
        }
        similaritys[i][0] = i;
    }

    // Y方向
    for (let i = 0; i <= secStrLen; i++) {
        similaritys[0][i] = i;
    }

    for (let i = 1; i <= fstStrLen; i++) {
        let x = i - 1;
        let fstChar = fstStr.substr(x, 1);
        for (let j = 1; j <= secStrLen; j++) {
            let y = j - 1;
            let secChar = secStr.substr(y, 1);
            let left = similaritys[x][j] + 1;
            let top = similaritys[i][y] + 1;
            let leftTop = fstChar == secChar ? similaritys[x][y] : similaritys[x][y] + 1;
            similaritys[i][j] = left < top ? (left < leftTop ? left : leftTop) : (top < leftTop ? top : leftTop);
        }
    }

    let maxLen = fstStrLen > secStrLen ? fstStrLen : secStrLen;
    let similarity = ((1 - (similaritys[fstStrLen][secStrLen] / maxLen)) * 100).toFixed(2);
    res.json({
        ...SUCCESS_MSG,
        result: similarity
    })

});


module.exports = router;