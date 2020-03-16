var express = require('express');
const verifyToken = require("../middlewares/verifyToken")
const verifyUser = require("../middlewares/verifyUser");
const { PoetryModel } = require("../models/Poetry")
const { CollectedPoetryModel, CreatedPoetryListModel } = require("../models/CollectedPoetry")

const { FAIL_MSG, SUCCESS_MSG } = require('../constants');
var router = express.Router();


router.get('/cron', verifyToken, verifyUser, async (req, res, next) => {
    CreatedPoetryListModel.find({}, { cron: 1, _id: 1 }).then(ret => {
        let result = [];
        for (let i = 0; i < ret.length; ++i) {
            if (ret[i]._doc.cron) {
                result.push({ _id: ret[i]._id, cron: ret[i]._doc.cron })
            }
        }
        res.json({
            ...SUCCESS_MSG,
            result
        })
    }).catch(error => {
        res.json({
            ...FAIL_MSG,
            error
        })
    })
});


router.put('/cron', verifyToken, verifyUser, async (req, res, next) => {
    const { created_poetry_list_id, cron } = req.body;
    CreatedPoetryListModel.findByIdAndUpdate(created_poetry_list_id, { cron }).then(ret => {
        res.json({
            ...SUCCESS_MSG,
            message: "更新成功"
        })
    })
});


router.get('/poetryMsg', verifyToken, verifyUser, async (req, res, next) => {
    const { created_poetry_list_id } = req.body;
    CollectedPoetryModel.find({ created_poetry_list_id }).then(ret => {
        let listLen = ret.length;
        checkInNum = 0;
        for (let i = 0; i < listLen; ++i) {
            const poetry = ret[i]._doc;
            if (poetry.check_in) {
                checkInNum++;
            }
        }
        res.json({
            ...SUCCESS_MSG,
            result: {
                checkInNum,
                notCheckInNum: listLen - checkInNum,
                total: listLen
            }
        })
    }).catch(error => {
        res.json({
            ...FAIL_MSG,
            error
        })
    })
});


module.exports = router