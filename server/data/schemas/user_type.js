var mongoose    = require("mongoose");
var Schema         = mongoose.Schema;

var schema = new Schema({
    id: {type: Number, unique:true},
    name: {type:String, unique:true}
});

schema.pre('save', function (next) {
    next();
});

module.exports=schema;