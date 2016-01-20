/**
 * Created by stijnvanhulle on 26/11/15.
 */
var passport        = require('passport');
var parser          = require('./libs/parser');
var Data            = require('../data/models/data');
var mongo           = require('../libs/mongo');

var postData=function(req, res, next) {
    var obj= parser(req.body);
    var user= req.user[0];



    var item = new Data({
        name: obj.Name,
        value: obj.Value,
        status: obj.Status,
        byUser: user
    });

    item.save(function(err, result){
        if(err){
            res.json({success:false});
        }else{
            res.json({success:true});
        }
    });

};

var getData=function(req, res, next) {
    var obj = parser(req.body);
    var user = req.user[0];


    mongo.getData(obj,function(err,result){
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
        postData:postData,
        getData:getData
    };

    return publicAPI;
})();