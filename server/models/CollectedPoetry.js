const mongoose = require("mongoose");

const ObjectId = mongoose.SchemaTypes.ObjectId;



const CreatedPoetryListSchema = mongoose.Schema({
    title: { type: String, required: true },
    user_id: { type: Object, required: true }
})

const CreatedPoetryListModel = mongoose.model("created_poetry_list", CreatedPoetryListSchema);




const CollectedPoetrySchema = mongoose.Schema({
    created_poetry_list_id: { type: ObjectId, required: true },
    poetry_id: { type: ObjectId, required: true },
})

const CollectedPoetryModel = mongoose.model("collected_poertry", CollectedPoetrySchema);


exports.CreatedPoetryListModel = CreatedPoetryListModel;
exports.CollectedPoetryModel = CollectedPoetryModel;