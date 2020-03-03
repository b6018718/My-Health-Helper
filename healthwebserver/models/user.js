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
        },
        fingerPrick: [{
            time: {type: Date, default: Date.now},
            millimolesPerLitre: {type: Number}
        }],
        foodRecord: [{
            time: {type: Date, default: Date.now},
            foodname: {type: String},
            calories: {type: Number},
            foodgroup: {type: String}
        }],
        exercise: [{
            time: {type: Date, default: Date.now},
            exercisename: {type: String},
            exercisetype: {type: String},
            exercisedurationmins: {type: Number}
        }],
        DoB:{type:Date,required:false},
        Address:{type:String,required:false},
        MobileNo:{type:String,required:false},
        TelephoneNo:{type:String,required:false},
        NHSNumber:{type:String,required:false},
        Sex:{type:String,required:false}


    },
    { timestamps: true }
);

let User = mongoose.model("User", userSchema)
module.exports = User;