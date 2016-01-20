var mongoose = require("mongoose");
var schema   = require('../schemas/user');

var model = mongoose.model('user', schema, "users");  //model,schema,collection

module.exports=model;