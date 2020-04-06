var express = require('express');
const verifyToken = require("../middlewares/verifyToken")
const verifyUser = require("../middlewares/verifyUser");
const { userModel } = require("../models/User")
const { getFirstGradeYear, getGrade } = require("../utils/grade")
const { FAIL_MSG, SUCCESS_MSG } = require('../constants');
var router = express.Router();

router.post('/checkCurPwd', verifyToken, verifyUser, async (req, res, next) => {
    const { password } = req.body;
    const { _id } = req.body.user;
    userModel.findOne({ _id, password }).then((doc) => {
        if (!doc) {
            res.json({
                ...FAIL_MSG,
                message: "密码错误",
            })
        }
        res.json({
            ...SUCCESS_MSG,
            message: "密码正确",
        })
    }).catch(error => {
        res.json({
            ...FAIL_MSG,
            message: "密码查询错误",
            error
        })
    })
});

router.post('/updateUsername', verifyToken, verifyUser, async (req, res, next) => {
    const { username } = req.body;
    const { _id } = req.body.user;
    if (!username) {
        res.json({
            ...FAIL_MSG,
            message: "请传入username"
        })
    }
    userModel.findByIdAndUpdate(_id, { username }).then((doc) => {
        res.json({
            ...SUCCESS_MSG,
            message: "修改成功"
        })
    }).catch(error => {
        res.json({
            ...FAIL_MSG,
            message: "发生错误",
            error
        })
    })
});
router.post('/updatePwd', verifyToken, verifyUser, async (req, res, next) => {
    const { password } = req.body;
    const { _id } = req.body.user;
    userModel.findByIdAndUpdate(_id, { password }).then((doc) => {
        res.json({
            ...SUCCESS_MSG,
            message: "修改完成",
        })
    }).catch((error) => {
        res.json({
            ...FAIL_MSG,
            message: "密码修改出错"
        })
    })
});
router.post('/updateGrade', verifyToken, verifyUser, async (req, res, next) => {
    const { grade } = req.body;
    const { _id } = req.body.user;
    const year_first_grade = getFirstGradeYear(grade);
    userModel.findByIdAndUpdate(_id, { year_first_grade }).then((doc) => {
        res.json({
            ...SUCCESS_MSG,
            message: "年级修改成功",
        })
    }).catch((error) => {
        res.json({
            ...FAIL_MSG,
            message: "年级修改失败",
            error
        })
    })
});


router.post('/fetchGrade', verifyToken, verifyUser, (req, res, next) => {
    const { user } = req.body;
    const _id = user._id;
    userModel.findById(_id, { year_first_grade: 1 }).then((doc) => {
        const grade = getGrade(doc._doc.year_first_grade);
        res.json({
            ...SUCCESS_MSG,
            grade,
        })
    }).catch(err => ({
        ...FAIL_MSG,
        err
    }))
})

router.post('/fetchUsername', verifyToken, verifyUser, (req, res, next) => {
    const { user } = req.body;
    const _id = user._id;
    userModel.findById(_id, { username: 1 }).then((doc) => {
        const username = doc._doc.username;
        res.json({
            ...SUCCESS_MSG,
            username
        })
    }).catch(err => {
        res.json({
            ...FAIL_MSG,
            err
        })
    })

})


module.exports = router