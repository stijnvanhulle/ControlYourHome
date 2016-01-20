var assert      = require("chai").assert;
var http        = require("http");
var md5         = require('md5');
var request     = require('superagent');

var address     ='http://localhost:80';
var server      = request.agent(address);
//var server    = require("../server"); //on when not using a other process to run node

var options={
    email:"stijn.vanhulle@outlook.com",
    password:"test"
};
//tests
var authTest         = require('./specs/authTest');

describe('Access server:', function () {
    it("should return a 200 response", function (done) {
        http.get(address + "/api", function (res) {
            done();
        });
    });
});

describe('Authtentication testing:',function(){
    authTest(server,options);
});

