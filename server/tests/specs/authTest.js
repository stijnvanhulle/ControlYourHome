var assert   = require("chai").assert;
var http     = require("http");
var Chance   = require('chance');
var md5      = require('md5');
var login    = require('./../libs/login');

var chance   = new Chance();

var test= function(server,options) {
    describe('Local login', function () {
        it('should be logged in', login(server,options.email,options.password));
    });
};

module.exports=function(server,options) {
    return test(server,options);
};


