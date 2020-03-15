const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const patientModuleSchema = new Schema(
    {
        moduleID: {
            type: Number,
            unique: true
        },
        navBarName:{
            type: String
        },
        homePageName: {
            type: String
        },
        urlLink:{
            type: String
        },
        moduleName: {
            type: String
        }

    }




);



let PatientModule = mongoose.model("PatientModule", patientModuleSchema )
module.exports = PatientModule;