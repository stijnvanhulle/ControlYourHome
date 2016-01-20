var mongoose = require("mongoose");
var schema   = require('../schemas/data');

var model = mongoose.model('data', schema, "datas");  //model,schema,collection

module.exports=model;