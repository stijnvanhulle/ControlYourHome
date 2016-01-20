var mongoose       = require("mongoose");
var Schema         = mongoose.Schema;
var user           = require("./user");

var schema = new Schema({
    name: {type:String},
    value: {type:String},
    status: {type:Boolean, default:1},
    byUser:{type: Schema.ObjectId, ref:'user'},
    active: {type: Boolean, default:1},
    createdOn: {type:Date, default:Date.now }
});

schema.pre('save', function (next) {
    next();
});


module.exports=schema;