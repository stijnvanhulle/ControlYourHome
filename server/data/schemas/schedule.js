var mongoose       = require("mongoose");
var Schema         = mongoose.Schema;
var schedule       = require("../../libs/schedule");

//day0=> zondag
var schema = new Schema({
    ruleID:{type:Number},
    name: {type:String},
    sensor:{type:String},
    day: {type:Number},
    hour: {type:Number},
    status: {type:Boolean, default:1},
    byUser:{type: Schema.ObjectId, ref:'user'},
    active: {type: Boolean, default:1},
    createdOn: {type:Date, default:Date.now }
});

schema.pre('save', function (next) {

    next();
});

schema.post('save', function (doc) {
    schedule.addOrUpdateRule(doc,function(){
        //wanneer rule uitgevoerd word
        console.log("Rule voor sensor " +  doc.sensor + " word uitgevoerd");
        schedule.send(doc.sensor,doc.status);
    });

});



module.exports=schema;