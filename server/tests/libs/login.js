var md5      = require('md5');

module.exports=function(server,email,pass) {
    return function(done) {
        server
            .post('/api/auth/local')
            .send({ Email: email, Password: pass })
            .end(function(err, res){
                if (err) return done(err);
                done()
            });
    }
};