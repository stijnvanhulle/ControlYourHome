var mongoose = require("mongoose");
var schema   = require('../schemas/user_type');

var model = mongoose.model('usertype', schema, "usertypes");  //model,schema,collection

module.exports=model;