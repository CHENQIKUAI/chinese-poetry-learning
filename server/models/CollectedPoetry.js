const mongoose = require("mongoose");

const ObjectId = mongoose.SchemaTypes.ObjectId;

const CreatedPoetryListSchema = mongoose.Schema({
    title: { type: String, required: true },
    user_id: { type: Object, required: true },
    cron: { type: String, required: false },
    grade_semester: { type: String, required: false },
})


// 学习集表
const CreatedPoetryListModel = mongoose.model("created_poetry_list", CreatedPoetryListSchema);


const CollectedPoetrySchema = mongoose.Schema({
    created_poetry_list_id: { type: ObjectId, required: true },
    poetry_id: { type: ObjectId, required: true },
    check_in: { type: Boolean, require: false },
    check_in_date: { type: Date, required: false },
})

// 学习集诗词表
const CollectedPoetryModel = mongoose.model("collected_poertry", CollectedPoetrySchema);


exports.CreatedPoetryListModel = CreatedPoetryListModel;
exports.CollectedPoetryModel = CollectedPoetryModel;