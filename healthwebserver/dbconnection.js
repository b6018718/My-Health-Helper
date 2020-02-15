const  mongoose  = require("mongoose");
mongoose.Promise  = require("bluebird");
const  url  =  "mongodb://localhost:27017/healthappdb";
const  connect  =  mongoose.connect(url, { useCreateIndex: true, useFindAndModify: false, useNewUrlParser: true });
module.exports  =  connect;