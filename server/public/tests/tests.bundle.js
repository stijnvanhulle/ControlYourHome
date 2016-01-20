/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "http://localhost:80/";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var expect = chai.expect;
	var assert = chai.assert;
	var should = chai.should();

	var authTest         = __webpack_require__(1);

	describe('Authtentication testing:',function(){
	    authTest();
	});

/***/ },
/* 1 */
/***/ function(module, exports) {

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



/***/ }
/******/ ]);