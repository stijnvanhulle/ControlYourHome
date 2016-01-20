var schedule      = require('node-schedule');
var client        = require('./mqtt');
var Schedule      = require('../data/models/schedule');

//global.socket
var rules=[];


(function subscribe(){
    client.subscribe('led1');
    client.subscribe('led2');
    client.subscribe('led3');
    client.subscribe('led1_status');
    client.subscribe('led2_status');
    client.subscribe('led3_status');
    client.subscribe('temp');
    client.subscribe('hum');
    client.subscribe('range');
    client.subscribe("motion");
    client.subscribe("display");
})();



var addRule=function(newObj,f){
    var rule = new schedule.RecurrenceRule();
    //rule.dayOfWeek = [0, new schedule.Range(4, 6)];
    newObj.day=newObj.day+1;
    if(newObj.day>7){
        newObj.day=0;
    }
    rule.dayOfWeek = newObj.day;
    rule.hour = newObj.hour;
    rule.minute = 0;

    var job = schedule.scheduleJob(rule, f);
    rules.push({ruleID:newObj.ruleID, job:job});
};

var addOrUpdateRule=function(newObj, f){
    var done=false;
    for(var i=0;i<rules.length;i++){
        var rule= rules[i];
        if(rule.id==newObj._id || (rule.dayOfWeek==newObj.day && rule.hour==newObj.hour)){
            rule.job.cancel();

            var ruleNew = new schedule.RecurrenceRule();
            //rule.dayOfWeek = [0, new schedule.Range(4, 6)];
            newObj.day=newObj.day+1;
            if(newObj.day>7){
                newObj.day=0;
            }
            ruleNew.dayOfWeek = newObj.day;
            ruleNew.hour = newObj.hour;
            ruleNew.minute = 0;
            var jobNew = schedule.scheduleJob(ruleNew, f);


            rule.job=jobNew;
            done=true;
        }

    }


    if(done==false){
        var rule = new schedule.RecurrenceRule();
        //rule.dayOfWeek = [0, new schedule.Range(4, 6)];
        newObj.day=newObj.day+1;
        if(newObj.day>7){
            newObj.day=0;
        }
        rule.dayOfWeek = newObj.day;
        rule.hour = newObj.hour;
        rule.minute = 0;
        var job = schedule.scheduleJob(rule, f);
        rules.push({ruleID:newObj.ruleID, job:job});
    }


};

var deleteRule=function(ruleID){
    for(var i=0;i<rules.length;i++){
        var rule= rules[i];
        if(rule.ruleID==ruleID){
            rule.job.cancel();
            rules.splice(i,1);
        }

    }

};

var updateRule=function(ruleID, newObj, f){
    for(var i=0;i<rules.length;i++){
        var rule= rules[i];
        if(rule.ruleID==ruleID){
            rule.job.cancel();

            var ruleNew = new schedule.RecurrenceRule();
            //rule.dayOfWeek = [0, new schedule.Range(4, 6)];
            newObj.day=newObj.day+1;
            if(newObj.day>7){
                newObj.day=0;
            }
            ruleNew.dayOfWeek =newObj.day;
            ruleNew.hour = newObj.hour;
            ruleNew.minute = 0;
            var jobNew = schedule.scheduleJob(ruleNew, f);

            rule.job=jobNew;
        }

    }

};

var deleteAll=function(){
    for(var i=0;i<rules.length;i++){
        var rule= rules[i];
        rule.job.cancel();
    }
    rules=[];
};


var send =function(nr,msg){
    client.publish('led' + nr.toString(), msg.toString()); // moet string zijn
    var status='';
    if(msg==true){
        status="aan gegaan";
    }else{
        status ="uit gegaan";
    }
    global.io.emit('message', 'led' + nr.toString() + " is in de schedule " + status.toString()); // moet string zijn
};




module.exports=(function(){

    var publicAPI={
        addRule:addRule,
        addOrUpdateRule:addOrUpdateRule,
        deleteRule:deleteRule,
        deleteAll:deleteAll,
        updateRule:updateRule,
        send:send
    };

    return publicAPI;


})();