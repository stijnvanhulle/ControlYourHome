var md5 = require('md5');
var connect = require('../data/connectDB');
var User = require('../data/models/user');
var User_type = require('../data/models/user_type');
var Data = require('../data/models/data');
var Photo = require('../data/models/photo');
var Schedule = require('../data/models/schedule');
var moment = require('moment');

var async           = require('async');
var schedule       = require("./schedule");

Array.prototype.contains = function (obj) {
    var i = this.length;
    while (i--) {
        if (this[i] === obj) {
            return true;
        }
    }
    return false;
};

var addBasic = function () {
    //types
    var admin = new User_type({id: 1, name: "Administrator"});
    var user = new User_type({id: 2, name: "Gebruiker"});

    /*admin.save(function (err) {
        if (err) console.log(err.message);
    });
    user.save(function (err) {
        if (err) console.log(err.message);

    });*/


    //users
    var stijn = new User({
        lastname: "Van Hulle",
        firstname: "Stijn",
        email: "stijn.vanhulle@outlook.com",
        password: md5("test"),
        type: user
    });
    var administrator = new User({
        lastname: "Administrator",
        firstname: "",
        email: "admin",
        password: md5("test"),
        type: admin
    });
    var temp= new Data({
        name: "temp",
        value: 20,
        status: true,
        active:true,
        createdOn: new Date(2016, 1, 19, 22, 0, 0, 0)
    });
    var temp2= new Data({
        name: "hum",
        value: 33,
        status: true,
        active:true,
        createdOn: new Date(2016, 1, 19, 22, 0, 0, 0)
    });

    temp.save();
    temp2.save();

    //stijn.save();
    //administrator.save();


    var scheduele1 = new Schedule({
        ruleID:1,
        name: "S'avonds uit op woensdag",
        sensor: 1,
        day: 2,
        hour:22,
        status: false,
        byUser: null,
        active: true
    });
    var scheduele2 = new Schedule({
        ruleID:2,
        name: "thuis op vrijdag",
        sensor: 1,
        day: 4,
        hour: 14,
        status: true,
        byUser: null,
        active: true
    });
    var scheduele3 = new Schedule({
        ruleID:3,
        name: "Thuis op woensdag",
        sensor: 2,
        day: 3,
        hour: 11,
        status: false,
        byUser: null,
        active: true
    });

    //scheduele1.save();
    //scheduele2.save();
    //scheduele3.save();
};

connect(function (result) {
    if (result == true) {
        addBasic();
        console.log('Data reset');
    }
});


var addData = function (name, value, cb) {

    var item = new Data({
        name: name,
        value: value
    });

    item.save(function (err, result) {
        if (err) {
            cb(err, null);
        } else {
            cb(null, true);
        }
    });

};

var getData = function (obj, cb) {
    var to = moment(obj.to);
    var from = moment(obj.from);

    var filter={createdOn:{$lte: obj.to, $gte: obj.from}};

    if(obj.to==obj.from){
        filter={};
    }
    Data.find(filter).sort({createdOn: 'ascending'}).exec(function (err, docs) {
        if (err) {
            cb(err, null);
        } else {
            var results = [];
            results.push(docs[0]);
            if(docs.length>2){
                results.push(docs[1]);
            }

            for (var i = 0; i < docs.length; i++) {
                var hour = moment(docs[i].createdOn).get('hour');


                if (hour != moment(results[results.length - 1].createdOn).get('hour')){
                    //moment(docs[i].createdOn).isAfter(moment(results[results.length - 1].createdOn)) {

                    if(results[results.length - 1].name !=docs[i].name){
                        results.push(docs[i]);
                    }

                }



            }

            console.log(results);
            cb(null, results);
        }

    });
};
var getUsers = function (cb) {
    User.find({}, {password: 0}).populate('type').exec(function (err, docs) {
        if (err) {
            cb(err, null);
        } else {
            cb(null, docs);
        }

    });
};
var getUserTypes = function (cb) {
    User_type.find({}).exec(function (err, docs) {
        if (err) {
            cb(err, null);
        } else {
            cb(null, docs);
        }

    });
};

var putUser = function (query, newValue, cb) {

    User.update(query, newValue, function (err, raw) {
        if (err) {
            cb(null, false);
        } else {
            cb(null, true);
        }

    });
};

var postUser = function (user, cb) {
    console.log(user);

    User_type.find({id: user.type}).exec(function (err, docs) {
        if(err) cb(err,null);
        var item = new User({
            lastname: user.lastname,
            firstname: user.firstname,
            email: user.email,
            password: md5(user.password),
            type:docs[0]
        });


        item.save(function (err, result) {
            if (err) {
                cb(err, null);
            } else {
                cb(null, true);
            }
        });

    });


};
var removeUser = function (id, cb) {
    User.remove({_id: id},function(err,removed) {
        if(err) cb(err,null);
        cb(null,removed);
    });


};


var getSchedules = function (cb) {
    Schedule.find({}).populate('user').populate('type').sort({day: 1}).exec(function (err, docs) {
        if (err) {
            cb(err, null);
        } else {
            var items = [];
            var canPush = true;
            for (var i = 0; i < docs.length; i++) {
                var item = {
                    _id: docs[i]._id,
                    ruleID:docs[i].ruleID,
                    name: docs[i].name,
                    sensor: docs[i].sensor,
                    hours: [docs[i].hour],
                    days: [docs[i].day],
                    status: docs[i].status,
                    byUser: docs[i].byUser,
                    active: docs[i].active,
                    createdOn: docs[i].createdOn
                };
                if (items.length != 0) {
                    canPush = true;
                    for (var i2 = 0; i2 < items.length; i2++) {

                        if (item.name == items[i2].name) {
                            if (!items[i2].days.contains(docs[i].day)) {
                                items[i2].days.push(docs[i].day);
                                canPush = false;
                            }
                            if (!items[i2].hours.contains(docs[i].hour)) {
                                items[i2].hours.push(docs[i].hour);
                                canPush = false;
                            }

                        }
                    }
                }
                if (canPush) {
                    items.push(item);
                }


            }

            cb(null, items);
        }

    });

};

var putSchedule = function (obj, cb) {
    removeSchedule(obj.ruleID,function(err,result){
        if(err) cb(err,null);
        postSchedule(obj,function(err, result){
            if(err){
                console.log(err);
                cb(err, false);
            }else{
                cb(null, true);
            }
        });
    });

};

var postSchedule = function (obj, cb) {
    Schedule.findOne().sort({ruleID: -1}).exec(function(err, post) {
        console.log(post);
        if(post==null){
            post.ruleID=0;
        }
        var ruleID=parseInt(post.ruleID) + 1;

        async.each(obj.days, function(item, callback) {
            async.each(obj.hours, function(item2, callback2) {

                var schedule1 = new Schedule({
                    ruleID:ruleID,
                    name: obj.name,
                    sensor: obj.sensor,
                    day: item,
                    hour: item2,
                    status: obj.status,
                    byUser: obj.byUser

                });
                console.log(schedule1);
                schedule1.save(function (err, result) {
                    if (err) {
                        callback2(err);
                    } else {
                        callback2();
                    }
                });



            }, function(err){
                if( err ) {
                    callback(err);
                } else {
                    callback();
                }
            });


        }, function(err){

            if( err ) {
                cb(err, null);
            } else {
                cb(null, true);
            }
        });
    });


};
var removeSchedule = function (ruleID, cb) {
    console.log(ruleID);
    schedule.deleteRule(ruleID);

    Schedule.find({ruleID:ruleID}).remove().exec(function(err, data) {
        if(err) cb(err,null);
        cb(null,true);
    });





};

var postPhoto = function (obj, cb) {

    var item = new Photo({
        photo: obj.photo,
        byUser: obj.byUser

    });

    item.save(function (err, result) {
        console.log(result);
        if (err) {
            cb(err, null);
        } else {
            cb(null, true);
        }
    });
};
var getPhotos = function (cb) {
    Photo.find({}).populate('user').limit(100).exec(function (err, docs) {
        if (err) {
            cb(err, null);
        } else {
            cb(null, docs);
        }
    });
};

module.exports = (function () {


    var publicAPI = {
        addData: addData,
        getData: getData,
        getUsers: getUsers,
        getUserTypes:getUserTypes,
        putUser: putUser,
        postUser: postUser,
        removeUser: removeUser,
        getSchedules: getSchedules,
        putSchedule: putSchedule,
        postSchedule: postSchedule,
        removeSchedule:removeSchedule,
        getPhotos: getPhotos,
        postPhoto: postPhoto
    };

    return publicAPI;
})();