var mongoose       = require("mongoose");
var Schema         = mongoose.Schema;
var user_type      = require("./user_type");


var schema = new Schema({
    lastname: {type:String, unique:true},
    firstname: {type:String, index:true},
    email: {type:String},
    password: {type:String},
    type: {type: Schema.ObjectId, ref:'usertype'},
    active: {type: Boolean, default:1},
    createdOn: {type:Date, default:Date.now }
});

schema.pre('save', function (next) {
    next();
});


module.exports=schema;