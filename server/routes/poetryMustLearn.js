var express = require('express');
const verifyToken = require("../middlewares/verifyToken")
const verifyAdmin = require("../middlewares/verifyAdmin")
const { MustLearnPoetryModel } = require("../models/MustLearn")
const { PoetryModel } = require("../models/Poetry")
const { FAIL_MSG, SUCCESS_MSG } = require('../constants');
var router = express.Router();

/**
 * poetry_id, grade_semester
 */

router.post('/add', verifyToken, verifyAdmin, async (req, res, next) => {
    const { poetry_id, grade_semester } = req.body;
    MustLearnPoetryModel.create({ poetry_id, grade_semester }).then((doc) => {
        res.json({
            ...SUCCESS_MSG,
            message: "创建成功",
        })
    }).catch((err) => {
        res.json({
            ...FAIL_MSG,
            error: err,
        })
    })
});


/**
 * must_learn_poetry_id
 */

router.post('/remove', verifyToken, verifyAdmin, async (req, res, next) => {
    const { must_learn_poetry_id } = req.body;
    MustLearnPoetryModel.findByIdAndRemove(must_learn_poetry_id).then((doc) => {
        res.json({
            ...SUCCESS_MSG,
            message: "成功删除",
        })
    }).catch((error) => {
        res.json({
            ...FAIL_MSG,
            error,
        })
    })
});

/**
 * grade_semester
 */

router.post('/getMustLearnPoetryList', verifyToken, verifyAdmin, async (req, res, next) => {
    const { grade_semester } = req.body;

    let findObj;

    if (typeof grade_semester === "string") {
        const arr = grade_semester.split(',');
        if (arr && arr.length === 2) {

            const v1 = parseInt(arr[0]);
            const v2 = parseInt(arr[1]);

            if (v1 === 0 && v2 === 0) {
                findObj = {};
            } else {
                findObj = {
                    grade_semester
                }
            }

            MustLearnPoetryModel.find(findObj).then((docs) => {
                const requestArr = [];
                for (let i = 0; i < docs.length; ++i) {
                    const poetry_id = docs[i].poetry_id;
                    requestArr.push(
                        PoetryModel.findById(
                            poetry_id,
                            {
                                writer: 1,
                                dynasty: 1,
                                title: 1,
                                content: 1
                            })
                    );
                }
                Promise.all(requestArr).then((poetry_docs) => {
                    const arr = poetry_docs.map((item, index) => {
                        const str = docs[index]._doc.grade_semester;
                        return {
                            ...item._doc,
                            grade: parseInt(str.split(',')[0]),
                            semester: parseInt(str.split(",")[1]),
                            _id: docs[index]._doc._id,
                        }
                    })
                    arr.sort((pa, pb) => {
                        const aGrade = pa.grade;
                        const aSemester = pa.semester
                        const bGrade = pb.grade;
                        const bSemester = pb.semester;
                        if (aGrade < bGrade) {
                            return -1;
                        } else if (aGrade === bGrade) {
                            if (aSemester < bSemester) {
                                return -1;
                            } else if (aSemester == bSemester) {
                                return -1;
                            } else {
                                return 1;
                            }
                        } else {
                            return 1;
                        }
                    })
                    res.json({
                        ...SUCCESS_MSG,
                        result: arr,
                    })
                }).catch((error) => {
                    res.json({
                        ...FAIL_MSG,
                        message: "第2层查询错误",
                        error,
                    })
                })
            }).catch((error) => {
                res.json({
                    ...FAIL_MSG,
                    message: "第1层查询错误",
                    error,
                })
            })
        }
    }
});


router.post('/getGradeSemester', verifyToken, verifyAdmin, async (req, res, next) => {
    const gradeSemesterArr = [
        {
            label: "小学",
            value: "小学",
            children: [],
        },
        {
            label: "初中",
            value: "初中",
            children: [],
        },
        {
            label: "高中",
            value: "高中",
            children: [],
        }
    ];
    const gradeName = [
        '一年级', '二年级', '三年级', '四年级', '五年级', '六年级',
        '初一', '初二', '初三',
        '高一', '高二', '高三',
    ];
    const semesterName = [
        '上册', '下册'
    ]
    for (let grade = 1; grade <= 12; ++grade) {
        let tempArr;
        if (grade <= 6) {
            tempArr = gradeSemesterArr[0].children;
        } else if (grade <= 9) {
            tempArr = gradeSemesterArr[1].children;
        } else {
            tempArr = gradeSemesterArr[2].children;
        }
        tempArr.push({
            value: `${grade}`,
            label: `${gradeName[grade - 1]}`,
            children: [
                {
                    value: 1,
                    label: semesterName[1 - 1],
                },
                {
                    value: 2,
                    label: semesterName[2 - 1],
                }
            ]
        });
    }
    res.json({
        ...SUCCESS_MSG,
        result: gradeSemesterArr
    })
})



/**
 * searchText
 */
router.post('/findByTitle', verifyToken, (req, res, next) => {
    const { searchText } = req.body;
    const text = (searchText + "").trim();
    PoetryModel.find(
        {
            title: new RegExp(text, "g")
        },
        {
            title: 1,
            _id: 1,
            writer: 1,
            dynasty: 1,
            content: 1,
        })
        .then((docs) => {
            res.json({
                ...SUCCESS_MSG,
                result: docs,
            })
        })
        .catch((error) => {
            res.json({
                ...FAIL_MSG,
                error,
            })
        })
})

module.exports = router;