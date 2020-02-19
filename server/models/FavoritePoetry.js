const mongoose = require("mongoose");

const FavoritePoetrySchema = mongoose.Schema({
    user_id: { type: String, required: true },
    poetry_id: { type: String, required: true }
})

const FavoritePoetryModel = mongoose.model("favorite_poetry", FavoritePoetrySchema);

exports.FavoritePoetryModel = FavoritePoetryModel;