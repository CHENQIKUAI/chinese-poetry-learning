const mongoose = require("mongoose");
const sha1 = require("sha1")

// users
const userSchema = mongoose.Schema({
    _id: { type: String },
    username: { type: String, required: true, unique: true },
    password: {
        type: String, required: true,
        set(val) {
            return sha1(val);
        }
    },
    year_first_grade: { type: Number, required: false },
    type: { type: Number, required: true }
})
const userModel = mongoose.model("user", userSchema);

exports.userModel = userModel;