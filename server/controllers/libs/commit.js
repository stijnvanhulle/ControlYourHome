module.exports=function(connection, err, res) {
        if(err){
            return connection.rollback(function() {
                res.json({success:false,error:err.message});
            });
        }else{
            connection.commit(function(err) {
                if (err) {
                    return connection.rollback(function() {
                        connection.release();
                        console.log('unsuccessfull!');
                        res.json({success:false,error:err.message});
                    });
                }else{
                    connection.release();
                    console.log('success!');
                    res.json({success:true});
                }

            });
        }
};