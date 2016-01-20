/**
 * Created by stijnvanhulle on 26/11/15.
 */
var passport        = require('passport');
var pool            = require('../libs/mysql');
var Twitter         = require('twitter-node-client').Twitter;

var config = {
    "consumerKey": "8ucc9ObKkAYpXzrTZpfqcL3yE",
    "consumerSecret": "WS8kWOjIy4NJVIgM3zetVE3YpkTYRjfAVVbTLY3VPwNwZKYk6w",
    "accessToken": "55532687-XSLshrfdGxszgJrYfnTxNNPSs6GYdsUK472RS87md",
    "accessTokenSecret": "Qesth64fdVaNHLLkSxJEGZwO39V3AugwlKt0qLtJ7NFwZ",
    "callBackUrl": ""
};
var twitter = new Twitter(config);


var timeline=function(req, res, next) {
    twitter.getHomeTimeline({ count: '10'}, function (err, response, body) {
        res.json({success:false,error:err});
    }, function (data) {
        res.json(JSON.parse(data));
    });
};



module.exports = (function(){
    //public api
    var publicAPI={
        timeline:timeline
    };

    return publicAPI;
})();