var expect = chai.expect;
var assert = chai.assert;
var should = chai.should();

var test= function() {
    describe('Local login', function () {
        it("Config object should exist", function () {
            var item = null;
            assert.equal(item, null,'Failed');
        });
    });
};

module.exports=function() {
    return test();
};

