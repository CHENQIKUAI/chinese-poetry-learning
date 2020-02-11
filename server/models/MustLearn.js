const mongoose = require("mongoose");

const ObjectId = mongoose.SchemaTypes.ObjectId;

const MustLearnPoetrySchema = mongoose.Schema({
    grade_semester: { type: String, required: true },
    poetry_id: { type: ObjectId, required: true },
})

const MustLearnPoetryModel = mongoose.model("must-learn-poetry", MustLearnPoetrySchema);

exports.MustLearnPoetryModel = MustLearnPoetryModel;