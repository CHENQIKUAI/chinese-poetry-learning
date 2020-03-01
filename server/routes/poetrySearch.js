var express = require('express');
const verifyToken = require("../middlewares/verifyToken")
const verifyUser = require("../middlewares/verifyUser");
const { PoetryModel } = require("../models/Poetry")
const { FavoritePoetryModel } = require("../models/FavoritePoetry")
const { FAIL_MSG, SUCCESS_MSG } = require('../constants');
const { getPoetrySearchFilterObj } = require("../utils/filter")
var router = express.Router();


router.post('/getPoetries', verifyToken, async (req, res, next) => {
    const { current, pageSize, value } = req.body;
    const { _id: user_id } = req.body.user;

    const findObj = getPoetrySearchFilterObj(value);

    const total = await PoetryModel.find(findObj).countDocuments();
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
            const poetry_like_arr = [];
            for (let i = 0; i < docs.length; ++i) {
                const poetry_like = {
                    poetry_id: docs[i]._doc._id,
                    user_id,
                }
                poetry_like_arr.push(
                    FavoritePoetryModel.findOne(poetry_like)
                );
            }

            Promise.all(poetry_like_arr).then((like_docs) => {
                for (let i = 0; i < like_docs.length; ++i) {
                    if (like_docs[i]) {
                        docs[i]._doc.like = true;
                    }
                }
                res.json({
                    ...SUCCESS_MSG,
                    current,
                    result: docs,
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
});



// 用户收藏诗词
router.post('/like', verifyToken, verifyUser, async (req, res, next) => {
    const { _id: user_id } = req.body.user; //用户id
    const { poetry_id } = req.body; // 前端发送来的诗词id

    FavoritePoetryModel.create({ user_id, poetry_id }).then((doc) => {
        res.json({
            ...SUCCESS_MSG,
            message: "收藏成功",
        })
    })

});



// 用户取消收藏诗词
router.post('/dislike', verifyToken, verifyUser, async (req, res, next) => {
    const { _id: user_id } = req.body.user; //用户id
    const { poetry_id } = req.body; // 前端发送来的诗词id

    FavoritePoetryModel.remove({ user_id, poetry_id }).then((doc) => {
        res.json({
            ...SUCCESS_MSG,
            message: "取消收藏成功",
        })
    })

});




module.exports = router;