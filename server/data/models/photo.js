var mongoose = require("mongoose");
var schema   = require('../schemas/photo');

var model = mongoose.model('photo', schema, "photos");  //model,schema,collection

module.exports=model;