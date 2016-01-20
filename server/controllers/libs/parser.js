module.exports=function(body) {
    var obj;
    try {
        obj = JSON.parse(body);
    } catch (e) {
        obj = body;
    }
    return obj;
};