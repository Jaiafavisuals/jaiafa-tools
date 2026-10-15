'use strict';
var assert=require('assert'),fs=require('fs'),path=require('path'),vm=require('vm');
var root=path.join(__dirname,'..'),script=fs.readFileSync(path.join(root,'jsx/jaiafa-tools.jsx'),'utf8').replace(/^#target[^\n]*\n/,'');
function setup(failure,scriptPath){
  var files=new Set(['/source.ai',path.join(root,'presets/Jaiafa Production Print v1.joboptions')]);
  var saved=[],closed=false,activeIndex=0,opened=0,imported=false,folders=new Set(['/out']),reports={};
  function File(name){this.fsName=String(name);}
  Object.defineProperty(File.prototype,'parent',{get:function(){return new File(path.dirname(this.fsName));}});
  Object.defineProperty(File.prototype,'exists',{get:function(){return files.has(this.fsName);}});
  File.prototype.copy=function(target){if(failure==='copy')return false;files.add(target);return true;};
  File.prototype.remove=function(){files.delete(this.fsName);};
  File.prototype.open=function(mode){if(mode==='w')reports[this.fsName]='';return true;};
  File.prototype.write=function(text){reports[this.fsName]=(reports[this.fsName]||'')+text;};
  File.prototype.close=function(){};
  function Folder(name){this.fsName=name;}
  Object.defineProperty(Folder.prototype,'exists',{get:function(){return folders.has(this.fsName);}});
  Folder.prototype.create=function(){folders.add(this.fsName);return true;};
  Folder.temp={fsName:'/temp'};
  var boards=[{name:'First',artboardRect:[0,100,200,0]},{name:'Second',artboardRect:[300,100,500,0]},{name:'Third',artboardRect:[600,100,800,0]}];
  boards.getActiveArtboardIndex=function(){return activeIndex;};boards.setActiveArtboardIndex=function(i){activeIndex=i;};
  var source={name:'source.ai',textFrames:[],placedItems:[],layers:[],saved:true,fullName:new File('/source.ai'),artboards:boards,activate:function(){app.activeDocument=source;},saveAs:function(){throw new Error('The source must never be saved as PDF');}};
  var copy={layers:[],importPDFPreset:function(file){assert.ok(file.exists);imported=true;},saveAs:function(file,options){if(failure==='save')throw new Error('Disk full');saved.push({file:file.fsName,options:options});files.add(file.fsName);},close:function(){closed=true;}};
  var app={documents:[source],activeDocument:source,open:function(){opened++;app.activeDocument=copy;return copy;}};
  var context={File:File,Folder:Folder,app:app,PDFSaveOptions:function(){},SaveOptions:{DONOTSAVECHANGES:1},UserInteractionLevel:{DONTDISPLAYALERTS:1},$:{fileName:scriptPath===undefined?path.join(root,'jsx/jaiafa-tools.jsx'):scriptPath}};
  vm.createContext(context);vm.runInContext(script,context);
  if(failure==='preset')files.delete(path.join(root,'presets/Jaiafa Production Print v1.joboptions'));
  return {context:context,source:source,files:files,reports:reports,saved:saved,run:function(index){return JSON.parse(context.JT_Handoff_exportPDF('/out','Campaign_AW',index));},verifyRestored:function(){assert.strictEqual(app.activeDocument,source);assert.strictEqual(activeIndex,0);assert.ok(!Array.from(files).some(function(f){return f.indexOf('/temp/')===0;}));if(opened)assert.ok(closed);},imported:function(){return imported;},opened:function(){return opened;}};
}
var good=setup(),result=good.run(2);
assert.ok(result.success,result.message);
assert.strictEqual(good.saved.length,1);
assert.strictEqual(good.saved[0].file,'/out/Campaign_AW.pdf');
assert.strictEqual(good.saved[0].options.artboardRange,'3');
assert.strictEqual(good.saved[0].options.pDFPreset,'Jaiafa Production Print v1');
assert.ok(good.imported());good.verifyRestored();
['copy','save','preset'].forEach(function(failure){var test=setup(failure),r=test.run(1);assert.strictEqual(r.success,false);assert.strictEqual(test.saved.length,0);test.verifyRestored();});
var unsaved=setup();unsaved.source.saved=false;assert.strictEqual(unsaved.run(0).success,false);assert.strictEqual(unsaved.opened(),0);unsaved.verifyRestored();
[-1,3,NaN].forEach(function(index){var test=setup();assert.strictEqual(test.run(index).success,false);assert.strictEqual(test.opened(),0);test.verifyRestored();});
// Illustrator changes the source's saved flag during the mixed-format workflow.
// All PDFs must still use the source file validated before packaging started.
var mixed=setup();
mixed.context.JT_Handoff_buildAIFiles=function(){mixed.source.saved=false;return {success:true,editable:true,outlined:true,outlineCount:1,outlineFailed:0};};
mixed.context.JT_exportPNG=function(doc,file){mixed.source.saved=false;mixed.files.add(file+'.png');};
var packaged=JSON.parse(mixed.context.JT_Handoff_createProduction('/out','Mixed','png,pdf','{document}_{artboard}_AW',false,'all',true,true,true));
assert.ok(packaged.success,packaged.message);
assert.strictEqual(packaged.exportCount,6);
assert.strictEqual(packaged.pdfFailures,0);
assert.strictEqual(packaged.pdfCount,3);
assert.strictEqual(mixed.saved.length,3);
assert.deepStrictEqual(mixed.saved.map(function(s){return s.options.artboardRange;}),['1','2','3']);
assert.ok(mixed.saved.every(function(s){return /\/PDF\/.*\.pdf$/.test(s.file);}));
mixed.verifyRestored();
var fontRequest=JSON.parse(packaged.fontRequests)[0],fontReport=fontRequest.folder+'/Fonts/Fonts Report.txt';
assert.ok(mixed.reports[fontReport].includes('FONT COLLECTION PENDING'));
assert.ok(!mixed.reports[fontReport].includes('sharing was not enabled'));
assert.ok(JSON.parse(mixed.context.JT_Handoff_recordFontFailure(packaged.path,packaged.fontRequests,'Test runtime failure')).success);
assert.ok(mixed.reports[fontReport].includes('FONT COLLECTION FAILED\r\nTest runtime failure'));
assert.ok(mixed.reports[packaged.path+'/Package Report.txt'].includes('FONT COLLECTION FAILED'));
assert.strictEqual(JSON.parse(mixed.context.JT_Handoff_recordFontFailure(packaged.path,JSON.stringify([{folder:'/outside',fonts:[]}]),'error')).success,false);
// CEP can load ScriptPath without setting $.fileName. Initialization must
// complete, and the panel's explicit extension path must enable PDF export.
var cep=setup(null,'');
assert.strictEqual(cep.context.JT_HISTORY_LAYER,'Jaiafa History Data');
assert.strictEqual(cep.run(0).success,false);
cep.context.JT_setExtensionPath(root);
assert.ok(cep.run(0).success);
cep.verifyRestored();
var fontDocument={textFrames:[{geometricBounds:[0,100,100,0],characters:[{characterAttributes:{textFont:{name:'First-Regular'}}},{characterAttributes:{textFont:{name:'Second-Bold'}}}]},{geometricBounds:[300,100,400,0],characters:[{characterAttributes:{textFont:{name:'Outside-Regular'}}}]}]};
assert.strictEqual(JSON.stringify(cep.context.JT_Handoff_artboardFonts(fontDocument,[0,100,200,0])),JSON.stringify(['First-Regular','Second-Bold']));
console.log('production PDF source safety, selected artboard, and error recovery tests passed');
