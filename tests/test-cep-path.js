'use strict';
var assert=require('assert'),fs=require('fs'),path=require('path'),vm=require('vm');
var script=fs.readFileSync(path.join(__dirname,'../lib/CSInterface.js'),'utf8');
[['file:///Users/test/Jaiafa%20Tools','/Users/test/Jaiafa Tools'],['file:///C:/Adobe/Jaiafa%20Tools','C:/Adobe/Jaiafa Tools'],['/Users/test/100%fonts','/Users/test/100%fonts']].forEach(function(pair){var window={__adobe_cep__:{getSystemPath:function(type){assert.strictEqual(type,'extension');return pair[0];}}};vm.runInNewContext(script,{window:window});assert.strictEqual(new window.CSInterface().getSystemPath('extension'),pair[1]);});
console.log('CEP extension path normalization tests passed');
