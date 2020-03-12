const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
    {
        forename: {
            type: String,
            required: true
        },
        surname: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        doctor: {
            type: Boolean,
            required: true
        },
        sex: { type: String, default: null },
        DoB: { type: Date, default: null },
        mobile: { type: String, default: null },
        telephone: { type: String, default: null },
        address: { type: String, default: null },
        NHSnumber: { type: String, default: null },
        idAssignedDoctor: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: false
        },
        fingerPrick: [{
            time: { type: Date, default: Date.now },
            millimolesPerLitre: { type: Number }
        }],
        foodRecord: [{
            time: { type: Date, default: Date.now },
            foodname: { type: String },
            calories: { type: Number },
            foodgroup: { type: String }
        }],
        exercise: [{
            time: { type: Date, default: Date.now },
            exercisename: { type: String },
            exercisetype: { type: String },
            exercisedurationmins: { type: Number }
        }]
    },
    { timestamps: true }
);

let User = mongoose.model("User", userSchema)
module.exports = User;