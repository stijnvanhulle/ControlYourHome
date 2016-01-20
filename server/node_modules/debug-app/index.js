"use strict";

var debug = require('debug');
var stack = require('callsite');
var path = require('path');

function debugApp() {
  var appPath = path.resolve(__dirname + '/../../');
  var appName = require(appPath + '/package.json').name;

  return debug(appName + ':' + stack()[1].getFileName().replace(appPath, ''));
}

module.exports = debugApp;
