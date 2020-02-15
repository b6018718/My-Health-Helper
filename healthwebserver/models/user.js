const  mongoose  = require("mongoose");
const  Schema  =  mongoose.Schema;

const userSchema  =  new Schema(
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
        idAssignedDoctor:{
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: false
        }
    },
    { timestamps: true }
);

let User = mongoose.model("User", userSchema)
module.exports = User;