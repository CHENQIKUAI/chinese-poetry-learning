const mongoose = require("mongoose");


// users
const PoetrySchema = mongoose.Schema({
    title: { type: String, required: false },
    dynasty: { type: String, required: false },
    writer: { type: String, required: false },
    content: { type: String, required: true },
    type: { type: Array, required: false },
    remark: { type: String, required: false },
    translation: { type: String, required: false },
    appreciation: { type: String, required: false },
    audioUrl: { type: String, required: false },
})

const PoetryModel = mongoose.model("poetry", PoetrySchema);

exports.PoetryModel = PoetryModel;