var mysql       = require('mysql');
var pool        = mysql.createPool({
    host     : 'www.stijnvanhulle.be',
    user     : 'iot',
    password : 'A9QEe4CQG3Z3376e',
    database : 'iot',
    connectTimeout: 2000
});

module.exports=pool;
