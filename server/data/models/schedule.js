var mongoose = require("mongoose");
var schema   = require('../schemas/schedule');

var model = mongoose.model('schedule', schema, "schedules");  //model,schema,collection

module.exports=model;