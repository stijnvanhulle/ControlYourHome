/**
 * Created by stijnvanhulle on 26/11/15.
 */
var passport        = require('passport');
var parser          = require('./libs/parser');
var Photo        = require('../data/models/photo');
var mongo           = require('../libs/mongo');


var postPhoto=function(req, res, next) {

    var obj= parser(req.body);
    var user= req.user;
    var item = obj;
    item.byUser=user;



    mongo.postPhoto(item,function(err, result){
        if(err){
            res.json({success:false});
        }else{
            global.io.emit("newPicture",true);
            res.json({success:true});
        }
    });

};

var getPhotos=function(req, res, next) {

    mongo.getPhotos(function(err,result){
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
        getPhotos:getPhotos,
        postPhoto:postPhoto
    };

    return publicAPI;
})();