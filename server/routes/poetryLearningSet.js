var express = require('express');
const verifyToken = require("../middlewares/verifyToken")
const verifyUser = require("../middlewares/verifyUser")
const { CollectedPoetryModel, CreatedPoetryListModel } = require("../models/CollectedPoetry")
const { PoetryModel } = require("../models/Poetry")
const { userModel } = require("../models/User")
const { MustLearnPoetryModel } = require("../models/MustLearn")
const { getFirstGradeYear, getGrade, getGradeSemester } = require("../utils/grade")
const { FAIL_MSG, SUCCESS_MSG } = require('../constants');
var router = express.Router();

function DoSetsHaveMustLearnInThisGradeSemester(user_id, grade_semester) {
    return new Promise((resolve) => {
        CreatedPoetryListModel.findOne({ user_id, grade_semester }).then((doc) => {

            if (doc) {
                resolve(true);
            } else {
                resolve(false);
            }
        }).catch(error => {
            resolve(false)
        })
    })
}


function getUserGrade(user_id) {
    return new Promise((resolve) => {
        userModel.findOne({ _id: user_id }).then((doc) => {
            const year_first_grade = doc._doc.year_first_grade;
            let grade = getGrade(year_first_grade);
            resolve(grade);
        })
    });
}



function insertMustLearnPoetryList(user_id, grade_semester, title) {
    return new Promise((resolve) => {
        MustLearnPoetryModel.find({ grade_semester }).then(docsAboutMustLearn => {
            CreatedPoetryListModel.create({
                title,
                user_id,
                grade_semester
            }).then(doc => {
                const created_poetry_list_id = doc._id
                const poetryArr = [];
                for (let i = 0; i < docsAboutMustLearn.length; ++i) {
                    const poetry_id = docsAboutMustLearn[i]._doc.poetry_id;

                    poetryArr.push({
                        poetry_id,
                        created_poetry_list_id,
                    })
                }

                //将必学篇目的诗词id们插入到 学习集的诗词表中
                CollectedPoetryModel.insertMany(poetryArr).then(rets => {
                    if (rets.length !== 0) {
                        resolve(true);
                    }
                })
            })
        })
    }
    );
}

function getCreatedPoetryList(user_id) {
    return new Promise((resolve) => {
        CreatedPoetryListModel.find({ user_id }).then(async (docs) => {
            const list = [];

            for (let i = 0; i < docs.length; ++i) {
                const _id = docs[i]._id;
                const title = docs[i]._doc.title;
                const cron = docs[i]._doc.cron;
                const setDescription = await getSpecificSetDescription(_id)
                list.push({
                    ...setDescription,
                    title,
                    _id,
                    cron
                })
            }
            resolve(list);
        })
    })
}

function getMustLearnTitle(grade_semester) {
    const arr = grade_semester.split(',');
    const grade = arr[0];
    const semester = arr[1];
    const gradeName = [
        '一年级', '二年级', '三年级', '四年级', '五年级', '六年级',
        '初一', '初二', '初三',
        '高一', '高二', '高三',
    ];
    const semesterName = [
        '上册', '下册'
    ]
    return gradeName[grade - 1] + semesterName[semester - 1] + "必学诗词";
}

function getSetSpecificValue(created_poetry_list_id, { check_in = 0, check_in_date = 0, poetry_id = 0 }) {
    return new Promise((resolve) => {
        CollectedPoetryModel.find(
            { created_poetry_list_id },
            { check_in_date, check_in, poetry_id }).then(docs => {
                const rets = docs.map(doc => {
                    const check_in = doc._doc.check_in;
                    const check_in_date = doc._doc.check_in_date;
                    const poetry_id = doc._doc.poetry_id;
                    return {
                        check_in,
                        check_in_date,
                        poetry_id
                    }
                })
                resolve(rets);
            }).catch(error => {
                resolve(null);
            })
    })
}


function getListDescription(list) {
    return new Promise(async (resolve) => {
        const specificValuesArrOfOneSetContainer = [];//包含各个集合的字段信息。
        for (let i = 0; i < list.length; ++i) {
            const created_poetry_list_id = list[i]._id;
            const specificValuesArrOfOneSet = await getSetSpecificValue(created_poetry_list_id, { check_in: 1, check_in_date: 1, poetry_id: 1 })
            specificValuesArrOfOneSetContainer.push(specificValuesArrOfOneSet);
        }
        // 计算已经打卡的诗词数目
        let poetryIdArr = [];
        // 计算连续几天学习了
        // 计算累计打卡天数
        let timeArr = [];
        specificValuesArrOfOneSetContainer.forEach(specificValuesArrOfOneSet => {
            specificValuesArrOfOneSet.map((specificValues) => {
                const poetry_id = specificValues.poetry_id;
                const check_in = specificValues.check_in;
                const check_in_date = specificValues.check_in_date;

                if (check_in && poetryIdArr.indexOf(poetry_id) === -1) {
                    poetryIdArr.push(poetry_id)
                }
                if (check_in)
                    timeArr.push(check_in_date);
            })
        })
        const timeContainer = {};
        for (let i = 0; i < timeArr.length; ++i) {
            const timeStr = `${timeArr[i].getFullYear()},${timeArr[i].getMonth() + 1},${timeArr[i].getDate()}`;
            timeContainer[timeStr] = 1;
        }
        timeArr.sort();
        timeArr.reverse();
        let count = 0;
        let day = new Date();
        let dayStr = `${day.getFullYear()},${day.getMonth() + 1},${day.getDate()}`;
        if (timeContainer[dayStr]) {
            count++;
        }
        while (1) {
            day = new Date(day.getTime() - 24 * 60 * 60 * 1000);
            dayStr = `${day.getFullYear()},${day.getMonth() + 1},${day.getDate()}`;
            if (timeContainer[dayStr]) {
                count++;
            } else {
                break;
            }
        }
        const description = {
            checkInNumber: poetryIdArr.length,
            consecutiveDays: count,
            cumulativeDays: Object.keys(timeContainer).length,
        }
        resolve(description);
    })
}

async function getSetTitle(created_poetry_list_id) {
    return new Promise((resolve) => {
        CreatedPoetryListModel.findById(created_poetry_list_id).then(doc => {
            resolve(doc._doc.title)
        })
    })
}

async function getSpecificSetDescription(created_poetry_list_id) {
    return new Promise(async (resolve) => {
        let description = {};
        const specificValuesArrOfThisSet = await getSetSpecificValue(created_poetry_list_id, { check_in: 1, poetry_id: 1, check_in_date: 1 })
        let timeContainer = {};
        let poetryIdContainer = {};
        for (let i = 0; i < specificValuesArrOfThisSet.length; ++i) {
            const check_in_date = specificValuesArrOfThisSet[i].check_in_date
            const check_in = specificValuesArrOfThisSet[i].check_in
            const poetry_id = specificValuesArrOfThisSet[i].poetry_id
            if (check_in) {
                poetryIdContainer[poetry_id] = 1;
                const date = new Date(check_in_date);
                const dateStr = `${date.getFullYear()},${date.getMonth() + 1},${date.getDate()}`
                timeContainer[dateStr] = 1;
            }
        }
        const learnedCount = Object.keys(poetryIdContainer).length
        const cumulativeDays = Object.keys(timeContainer).length
        const learningProgress = learnedCount / (specificValuesArrOfThisSet.length)

        const title = await getSetTitle(created_poetry_list_id);
        description = {
            learnedCount,
            cumulativeDays,
            learningProgress,
            title,
        }
        resolve(description);
    })
}



async function getPoetrySpecificValue(poetry_id,
    inclusionObj) {
    return new Promise((resolve) => {
        PoetryModel.findOne(poetry_id, inclusionObj).then(doc => {
            resolve(doc);
        })
    })
}


async function getSetPoetryList(created_poetry_list_id) {
    return new Promise((resolve) => {
        const poetryContainer = [];
        CollectedPoetryModel.find({ created_poetry_list_id }).then(async docs => {
            for (let i = 0; i < docs.length; ++i) {
                const { poetry_id, check_in, cron } = docs[i]._doc;
                const poetry = await getPoetrySpecificValue(poetry_id, { _id: 1, title: 1, content: 1 });
                poetryContainer.push({ ...poetry._doc, check_in, cron });
            }
            resolve(poetryContainer);
        })
    })
}


router.post('/getSetPoetryList', verifyToken, verifyUser, async (req, res, next) => {
    const { user, created_poetry_list_id } = req.body;
    const description = await getSpecificSetDescription(created_poetry_list_id);
    const list = await getSetPoetryList(created_poetry_list_id)

    res.json({
        ...SUCCESS_MSG,
        result: {
            list,
            description
        },

    })
})


// 关于学习集中诗词的操作
router.post('/poetryCheckIn', verifyToken, verifyUser, async (req, res, next) => {
    const { created_poetry_list_id, poetry_id } = req.body;
    CollectedPoetryModel.findOneAndUpdate({ created_poetry_list_id, poetry_id }, { check_in: true, check_in_date: new Date() }).then(ret => {
        res.json({
            ...SUCCESS_MSG,
            message: "打卡成功"
        })
    })
})


router.post('/getLearningSets', verifyToken, verifyUser, async (req, res, next) => {
    const { _id } = req.body.user;
    const grade = await getUserGrade(_id);
    if (grade) {
        const grade_semester = getGradeSemester(grade);
        const judge = await DoSetsHaveMustLearnInThisGradeSemester(_id, grade_semester);
        if (!judge) {
            // 先插入再返回集合
            const title = getMustLearnTitle(grade_semester);
            await insertMustLearnPoetryList(_id, grade_semester, title);
        }
    }
    const list = await getCreatedPoetryList(_id);
    const description = await getListDescription(list);
    res.json({
        ...SUCCESS_MSG,
        grade,
        result: {
            list,
            description
        },
    })
});


router.post('/addNewPoetry', verifyToken, verifyUser, async (req, res, next) => {
    const { created_poetry_list_id, poetry_id } = req.body;
    CollectedPoetryModel.findOne({ created_poetry_list_id, poetry_id }).then(doc => {
        if (!doc) {
            CollectedPoetryModel.create({ created_poetry_list_id, poetry_id }).then(ret => {
                res.json({
                    ...SUCCESS_MSG,
                    message: "新增成功"
                })
            }).catch(error => {
                res.json({
                    ...FAIL_MSG,
                    error
                })
            })
        } else {
            res.json({
                ...FAIL_MSG,
                message: "诗词已存在学习集中"
            })
        }
    }).catch(error => {
        res.json({
            ...FAIL_MSG,
            error,
        })
    })

});


router.post('/deletePoetryFromCollection', verifyToken, verifyUser, async (req, res, next) => {
    const { created_poetry_list_id, poetry_id } = req.body;
    CollectedPoetryModel.remove({ created_poetry_list_id, poetry_id }).then(ret => {
        res.json({
            ...SUCCESS_MSG,
            message: "删除成功"
        })
    }).catch(error => {
        res.json({
            ...FAIL_MSG,
            error
        })
    })
});



/**
 * 
 * 关于学习集的操作
 * 
 */

router.post('/updateSet', verifyToken, verifyUser, async (req, res, next) => {
    const { created_poetry_list_id, title, cron } = req.body;
    CreatedPoetryListModel.findByIdAndUpdate(created_poetry_list_id, { title, cron }).then(ret => {
        res.json({
            ...SUCCESS_MSG,
            message: "名字修改"
        })
    }).catch(error => {
        res.json({
            ...FAIL_MSG,
            error
        })
    })
});


router.post('/deleteSet', verifyToken, verifyUser, async (req, res, next) => {
    const { created_poetry_list_id } = req.body;
    CreatedPoetryListModel.findByIdAndRemove(created_poetry_list_id).then(ret => {
        CollectedPoetryModel.remove({ created_poetry_list_id }).then(ret => {
            res.json({
                ...SUCCESS_MSG,
                message: "删除成功"
            })
        })
    }).catch(error => {
        res.json({
            ...FAIL_MSG,
            error
        })
    })
});

router.post('/createSet', verifyToken, verifyUser, async (req, res, next) => {
    const { title, user, cron } = req.body;
    const user_id = user._id;

    CreatedPoetryListModel.create({ title, user_id, cron }).then(doc => {
        res.json({
            ...SUCCESS_MSG,
            result: doc
        })
    }).catch(error => {
        res.json({
            ...FAIL_MSG,
            error
        })
    })
});




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






module.exports = router;