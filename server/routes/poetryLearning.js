var express = require('express');
const verifyToken = require("../middlewares/verifyToken")
const verifyUser = require("../middlewares/verifyUser")
const { PoetryModel } = require("../models/Poetry")
const { FavoritePoetryModel } = require("../models/FavoritePoetry")
const { FAIL_MSG, SUCCESS_MSG } = require('../constants');
var router = express.Router();

router.post('/getPoetry', verifyToken, verifyUser, async (req, res, next) => {

    const { id } = req.body;
    const { user } = req.body;
    const { _id } = user;

    PoetryModel.findById(id).then(async (doc) => {

        const count = await FavoritePoetryModel.find({ user_id: _id, poetry_id: id }).countDocuments();
        if (count) {
            res.json({
                ...SUCCESS_MSG,
                result: {
                    ...doc._doc,
                    like: true,
                },
            })
        } else {
            res.json({
                ...SUCCESS_MSG,
                result: {
                    ...doc._doc,
                    like: false,
                },
            })
        }
    }).catch(error => {
        res.json({
            ...FAIL_MSG,
            error
        })
    })
});

module.exports = router;