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


module.exports = router;