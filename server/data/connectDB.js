var db              = 'soc-iot';
var mongoose        = require("mongoose");
var mongodbURL      = 'mongodb://localhost/'+ db;

module.exports = function (cb) {
    var db =mongoose.connect(mongodbURL); //connecteer de database
    mongoose.connection.on("open", function () {
        console.log("connection met mongo server " + mongodbURL);
        //mongoose.connection.db.dropDatabase(); //drop voor niewe data
        //cb(true);
    });
    mongoose.connection.on("error", function () {

    });
    mongoose.connection.on("close", function () {

    });

};