const mongoose = require("mongoose");

// users
const WriterSchema = mongoose.Schema({
    name: { type: String, required: true },
    headImageUrl: { type: String, required: false },
    simpleIntro: { type: String, required: false },
    detailIntro: { type: String, required: false },
})

const WriterModel = mongoose.model("writer", WriterSchema);

exports.WriterModel = WriterModel;