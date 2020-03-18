var express = require('express');
const verifyToken = require("../middlewares/verifyToken")
const verifyUser = require("../middlewares/verifyUser");
const { PoetryModel } = require("../models/Poetry")
const { CollectedPoetryModel, CreatedPoetryListModel } = require("../models/CollectedPoetry")

const { FAIL_MSG, SUCCESS_MSG } = require('../constants');
var router = express.Router();


router.post('/getCron', verifyToken, verifyUser, async (req, res, next) => {
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


const getWeekValuesByCron = (cron) => {
    if (!cron) {
        return [];
    } else {
        const week = cron.split(' ')[5];
        if (week === '*') {
            return [0, 1, 2, 3, 4, 5, 6];
        } else {
            return week.split(',').map(str => Number(str));
        }
    }
}

async function getMsgOfSet(created_poetry_list_id) {
    return new Promise((resolve) => {
        CollectedPoetryModel.find({ created_poetry_list_id }).then(async ret => {
            const set = await CreatedPoetryListModel.findById(created_poetry_list_id);
            const title = set._doc.title;
            let listLen = ret.length;
            checkInNum = 0;
            for (let i = 0; i < listLen; ++i) {
                const poetry = ret[i]._doc;
                if (poetry.check_in) {
                    checkInNum++;
                }
            }

            const notCheckInNum = listLen - checkInNum;
            const total = listLen;
            const msg = {
                title,
                checkInNum,
                notCheckInNum,
                total,
            }
            resolve(msg);
        }
        )
    });
}


router.post('/getNotify', verifyToken, verifyUser, async (req, res, next) => {
    const { _id } = req.body.user
    CreatedPoetryListModel.find({ user_id: _id }, { cron: 1, _id: 1 }).then(async ret => {
        let result = [];
        const day = new Date().getDay();
        for (let i = 0; i < ret.length; ++i) {
            if (ret[i]._doc.cron) {
                const weekArr = getWeekValuesByCron(ret[i]._doc.cron);
                const isToday = weekArr.some(week => {
                    return week === day;
                })

                if (isToday) {
                    const _id = ret[i]._id;
                    const msg = await getMsgOfSet(_id);
                    result.push(msg);
                }
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



router.post('/getPoetryMsg', verifyToken, verifyUser, async (req, res, next) => {
    const { created_poetry_list_id } = req.body;
    CollectedPoetryModel.find({ created_poetry_list_id }).then(async ret => {
        const set = await CreatedPoetryListModel.findById(created_poetry_list_id);
        const title = set._doc.title;
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
                title,
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



router.post('/updateCron', verifyToken, verifyUser, async (req, res, next) => {
    const { created_poetry_list_id, cron } = req.body;
    CreatedPoetryListModel.findByIdAndUpdate(created_poetry_list_id, { cron }).then(ret => {
        res.json({
            ...SUCCESS_MSG,
            message: "更新成功"
        })
    })
});



module.exports = router