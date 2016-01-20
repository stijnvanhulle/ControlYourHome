/**
 * Created by stijnvanhulle on 26/11/15.
 */
var passport        = require('passport');
var parser          = require('./libs/parser');
var Data            = require('../data/models/data');
var mongo           = require('../libs/mongo');

var putUser=function(req, res, next) {
    var obj= parser(req.body);
    var user= req.user;

    if(user.type.id==1){

    }
    var item = {
        _id: obj._id
    };

    var newValue={
        active:obj.active
    };


    mongo.putUser(item,newValue,function(err, result){
        if(err){
            res.json({success:false});
        }else{
            res.json({success:true});
        }
    });

};

var postUser=function(req, res, next) {
    var obj= parser(req.body);

    mongo.postUser(obj,function(err, result){
        if(err){
            res.json({success:false});
        }else{
            res.json({success:true});
        }
    });

};
var removeUser=function(req, res, next) {
    var obj= parser(req.body);

    mongo.removeUser(obj.id,function(err, result){
        if(err){
            res.json({success:false});
        }else{
            res.json({success:true});
        }
    });

};

var getUsers=function(req, res, next) {

    mongo.getUsers(function(err,result){
        if(err){
            res.json({success:false});
        }else{
            res.json({success:true, data:result});
        }
    });
};

var getUserTypes=function(req, res, next) {

    mongo.getUserTypes(function(err,result){
        if(err){
            res.json({success:false});
        }else{
            res.json({success:true, data:result});
        }
    });



};


module.exports = (function(){
    //public api
    var publicAPI={
        getUsers:getUsers,
        putUser:putUser,
        postUser:postUser,
        removeUser:removeUser,
        getUserTypes:getUserTypes
    };

    return publicAPI;
})();