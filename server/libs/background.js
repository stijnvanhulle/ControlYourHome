var interval;
var request         = require('request');
var parser          = require('../controllers/libs/parser');

var start = function () {

    var minutes = 2, the_interval = minutes * 60 * 1000;

    interval = setInterval(function () {
        postPhoto();
    }, the_interval);

};

var postPhoto = function () {
    var url = "http://raspberrypi.local";
    var obj = {};

    if(global.online==true){
        request.get(url, function (err, res, body) {

            obj.photo = "data:image/png;base64," + parser(body).image;
            request.post({url: global.address + 'api/photo', form: obj}, function (err, res, body) {
                if (err) {

                    console.log(err);
                } else {
                    global.io.emit("newPicture",true);
                    console.log("Photo Uploaded");
                }

            });
        });
    }

};


module.exports = (function () {
    return {
        start: start,
        postPhoto:postPhoto
    };

})();
