const  mongoose  = require("mongoose");
const  Schema  =  mongoose.Schema;

const userSchema  =  new Schema(
    {
        forename: {
            type: String
        },
        surname: {
            type: String
        },
        email: {
            type: String
        },
        password: {
            type: String
        },
        doctor: {
            type: Boolean
        }
    },
    { timestamps: true }
);

let User = mongoose.model("User", userSchema)
module.exports = User;