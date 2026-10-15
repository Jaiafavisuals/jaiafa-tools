'use strict';
var assert=require('assert'),fs=require('fs'),path=require('path'),os=require('os'),vm=require('vm'),fonts=require('../js/handoff-fonts');
// Illustrator's mixed-context has BOTH a browser window and CommonJS globals.
var panelWindow={},panelModule={exports:{}};
vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../js/handoff-fonts.js'),'utf8'),{window:panelWindow,module:panelModule,require:require,Promise:Promise,setTimeout:setTimeout});
assert.strictEqual(typeof panelWindow.JTHandoffFonts.collect,'function');
assert.strictEqual(panelWindow.JTHandoffFonts,panelModule.exports);
function fixture(name,restricted){
  var text=Buffer.from(name,'utf16le');text.swap16();var naming=Buffer.alloc(18+text.length);
  naming.writeUInt16BE(1,2);naming.writeUInt16BE(18,4);naming.writeUInt16BE(3,6);naming.writeUInt16BE(1,8);naming.writeUInt16BE(1033,10);naming.writeUInt16BE(6,12);naming.writeUInt16BE(text.length,14);text.copy(naming,18);
  var b=Buffer.alloc(54+naming.length);b.writeUInt32BE(65536,0);b.writeUInt16BE(2,4);
  b.write('name',12);b.writeUInt32BE(54,20);b.writeUInt32BE(naming.length,24);
  b.write('OS/2',28);b.writeUInt32BE(44,36);b.writeUInt32BE(10,40);b.writeUInt16BE(restricted?2:0,52);naming.copy(b,54);return b;
}
(async function(){
var temp=fs.mkdtempSync(path.join(os.tmpdir(),'jaiafa-font-test-')),source=path.join(temp,'fonts'),output=path.join(temp,'handoff');
try{
fs.mkdirSync(source);fs.mkdirSync(output);var size=path.join(output,'Size_AW');fs.mkdirSync(size);
// Filenames deliberately differ from the font's internal PostScript name.
var good=path.join(source,'renamed.ttf');fs.writeFileSync(good,fixture('Used-Regular',false));
fs.writeFileSync(path.join(source,'locked.otf'),fixture('Locked-Regular',true));
fs.writeFileSync(path.join(source,'unused.ttf'),fixture('Unused-Regular',false));
fs.writeFileSync(path.join(source,'broken.ttf'),Buffer.from('bad'));
var deps={fs:fs,path:path,os:os,Buffer:Buffer,env:{},roots:[source]};
assert.deepStrictEqual(fonts.fontInfo(good,deps).names,['Used-Regular']);
assert.ok(fonts.protectedPath('/Users/test/Library/Application Support/Adobe/CoreSync/plugins/livetype/.r/font.otf'));
var result=await fonts.collect(output,[{folder:size,fonts:['Used-Regular','Locked-Regular','Missing-Regular']}],'',deps);
assert.strictEqual(result.copied,1);assert.strictEqual(result.skipped,2);
assert.deepStrictEqual(fs.readdirSync(path.join(size,'Fonts')).sort(),['Fonts Report.txt','renamed.ttf']);
assert.ok(fs.readFileSync(path.join(output,'Fonts Report.txt'),'utf8').includes('UNAVAILABLE: Missing-Regular'));
assert.ok(fs.readFileSync(path.join(output,'Fonts Report.txt'),'utf8').includes('SKIPPED: Locked-Regular'));
assert.ok(fs.readFileSync(path.join(output,'Package Report.txt'),'utf8').includes('Font files copied: 1'));
await assert.rejects(fonts.collect(output,[{folder:path.join(temp,'outside'),fonts:[]}],'',deps),/outside the handoff/);
console.log('font matching, permission flags, missing fonts, and destination checks passed');
}finally{fs.rmSync(temp,{recursive:true,force:true});}
})().catch(function(e){console.error(e);process.exitCode=1;});
