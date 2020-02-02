const mongoose = require("mongoose");

// users
const AuthorSchema = mongoose.Schema({
    name: { type: String, required: true },
    headImageUrl: { type: String, required: false },
    simpleIntro: { type: String, required: false },
    detailIntro: { type: String, required: false },
})

const AuthorModel = mongoose.model("author", AuthorSchema);

exports.AuthorModel = AuthorModel;