var mongoose       = require("mongoose");
var Schema         = mongoose.Schema;
var user           = require("./user");

var schema = new Schema({
    photo: {type:String},
    byUser:{type: Schema.ObjectId, ref:'user'},
    createdOn: {type:Date, default:Date.now }
});

schema.pre('save', function (next) {
    next();
});


module.exports=schema;