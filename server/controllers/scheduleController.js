/**
 * Created by stijnvanhulle on 26/11/15.
 */
var passport        = require('passport');
var parser          = require('./libs/parser');
var Schedule            = require('../data/models/schedule');
var mongo           = require('../libs/mongo');

var putSchedule=function(req, res, next) {
    var obj= parser(req.body);
    var user= req.user;
    //administraotr
    if(user.type.id==1){

    }
    var item={
        ruleID:obj.ruleID,
        name: obj.name,
        sensor:obj.sensor,
        days: obj.days,
        hours: obj.hours,
        status: obj.status,
        byUser: user,
        active: obj.active,
        createdOn: obj.createdOn
    };

    mongo.putSchedule(item,function(err, result){
        console.log(result);
        if(err){
            res.json({success:false});
        }else{
            res.json({success:true});
        }
    });

};
var postSchedule=function(req, res, next) {

    var obj= parser(req.body);
    var user= req.user;
    if(user.type.id==1){

    }
    var item = obj;
    item.byUser=user;

    var newValue={
        active:obj.active
    };


    mongo.postSchedule(item,function(err, result){
        if(err){
            console.log(err);
            res.json({success:false});
        }else{
            res.json({success:true});
        }
    });

};

var getSchedules=function(req, res, next) {

    mongo.getSchedules(function(err,result){
        if(err){
            res.json({success:false});
        }else{
            res.json({success:true, data:result});
        }
    });



};
var removeSchedule=function(req, res, next) {
    var obj= parser(req.body);
    mongo.removeSchedule(obj.ruleID,function(err, result){
        if(err){
            res.json({success:false});
        }else{
            res.json({success:true});
        }
    });

};



module.exports = (function(){
    //public api
    var publicAPI={
        getSchedules:getSchedules,
        putSchedule:putSchedule,
        postSchedule:postSchedule,
        removeSchedule:removeSchedule
    };

    return publicAPI;
})();