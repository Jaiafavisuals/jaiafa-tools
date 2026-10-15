(function(root){
'use strict';
function dependencies(){var req=typeof require==='function'?require:null;if(root.cep_node&&root.cep_node.require)req=root.cep_node.require;if(!req)throw new Error('Font collection requires the panel Node runtime.');return {fs:req('fs'),path:req('path'),os:req('os'),Buffer:req('buffer').Buffer,env:req('process').env};}
function decodeName(bytes,unicode){var s='',i;if(unicode){for(i=0;i+1<bytes.length;i+=2)s+=String.fromCharCode(bytes.readUInt16BE(i));return s}return bytes.toString('latin1');}
function fontInfo(file,deps){
var fs=deps.fs,fd=fs.openSync(file,'r'),size=fs.fstatSync(fd).size,names=[],restricted=false;
function read(offset,length){if(offset<0||length<0||offset+length>size||length>1048576)throw new Error('Invalid font table');var b=deps.Buffer.alloc(length);if(fs.readSync(fd,b,0,length,offset)!==length)throw new Error('Truncated font');return b;}
try{
var header=read(0,12),offsets=[0],i,j;
if(header.toString('ascii',0,4)==='ttcf'){var faces=header.readUInt32BE(8);if(faces>256)throw new Error('Invalid font collection');var array=read(12,faces*4);offsets=[];for(i=0;i<faces;i++)offsets.push(array.readUInt32BE(i*4));}
for(i=0;i<offsets.length;i++){
header=read(offsets[i],12);var signature=header.toString('ascii',0,4);if(header.readUInt32BE(0)!==65536&&signature!=='OTTO'&&signature!=='true')continue;
var tables=header.readUInt16BE(4);if(tables>512)throw new Error('Invalid font directory');var directory=read(offsets[i]+12,tables*16),nameTable=null;
for(j=0;j<tables;j++){var at=j*16,tag=directory.toString('ascii',at,at+4),off=directory.readUInt32BE(at+8),len=directory.readUInt32BE(at+12);if(tag==='name')nameTable=read(off,len);if(tag==='OS/2'&&len>=10&&(read(off,10).readUInt16BE(8)&0x0202))restricted=true;}
if(!nameTable||nameTable.length<6)continue;
var count=nameTable.readUInt16BE(2),storage=nameTable.readUInt16BE(4);if(6+count*12>nameTable.length)throw new Error('Invalid font names');
for(j=0;j<count;j++){at=6+j*12;if(nameTable.readUInt16BE(at+6)!==6)continue;var platform=nameTable.readUInt16BE(at),length=nameTable.readUInt16BE(at+8),start=storage+nameTable.readUInt16BE(at+10);if(start+length>nameTable.length)continue;var name=decodeName(nameTable.slice(start,start+length),platform===0||platform===3);if(name&&names.indexOf(name)<0)names.push(name);}
}
return {names:names,restricted:restricted};
}finally{fs.closeSync(fd);}
}
function protectedPath(file){return /[\\/](?:CoreSync|\.r|\.w|Adobe Fonts)[\\/]/i.test(file)||/[\\/]livetype[\\/]/i.test(file);}
function localRoots(deps,custom){var p=deps.path,o=deps.os,roots=[];if(custom)roots.push(custom);if(o.platform()==='win32'){if(deps.env.WINDIR)roots.push(p.join(deps.env.WINDIR,'Fonts'));if(deps.env.LOCALAPPDATA)roots.push(p.join(deps.env.LOCALAPPDATA,'Microsoft','Windows','Fonts'));}else{roots.push(p.join(o.homedir(),'Library','Fonts'),'/Library/Fonts');}return roots;}
function listFonts(roots,deps){var fs=deps.fs,p=deps.path,seen={},files=[],errors=[];
function walk(dir,depth){if(depth>12||files.length>=20000||protectedPath(dir))return;var real;try{real=fs.realpathSync(dir);if(protectedPath(real)||seen[real])return;seen[real]=true;var entries=fs.readdirSync(dir);for(var i=0;i<entries.length;i++){if(entries[i].charAt(0)==='.')continue;var file=p.join(dir,entries[i]);try{var stat=fs.statSync(file);if(stat.isDirectory())walk(file,depth+1);else if(/\.(?:otf|ttf|ttc|otc)$/i.test(file)&&!protectedPath(fs.realpathSync(file)))files.push(file);}catch(ignore){}}}catch(e){if(fs.existsSync(dir))errors.push('Could not read font folder: '+dir);}}
for(var i=0;i<roots.length;i++)walk(roots[i],0);return {files:files,errors:errors};
}
function collect(packagePath,requests,custom,testDependencies){
return new Promise(function(resolve,reject){
var deps,fs,p,scan,needed={},index={},cursor=0;
try{deps=testDependencies||dependencies();fs=deps.fs;p=deps.path;for(var i=0;i<requests.length;i++)for(var j=0;j<requests[i].fonts.length;j++)needed[requests[i].fonts[j]]=true;scan=listFonts(deps.roots||localRoots(deps,custom),deps);}catch(e){reject(e);return;}
function next(){try{
var end=Math.min(cursor+64,scan.files.length);
for(;cursor<end;cursor++){var file=scan.files[cursor];try{var info=fontInfo(file,deps);for(var n=0;n<info.names.length;n++){var name=info.names[n];if(needed[name]&&(!index[name]||index[name].restricted&&!info.restricted))index[name]={file:file,restricted:info.restricted};}}catch(ignore){}}
if(cursor<scan.files.length){setTimeout(next,0);return;}
var report=['JAIAFA TOOLS FONT COLLECTION','Only locally accessible fonts are collected. Adobe Fonts activation caches are excluded.','Font files may be shared only as permitted by their licenses.',''],copied=0,skipped=0,base=p.resolve(packagePath);
for(var i=0;i<requests.length;i++){
var request=requests[i],folder=p.resolve(request.folder);if(folder.indexOf(base+p.sep)!==0)throw new Error('Font destination is outside the handoff package.');
var dest=p.join(folder,'Fonts');if(!fs.existsSync(dest))fs.mkdirSync(dest);var used={},folderReport=['JAIAFA TOOLS FONT COLLECTION','Font files may be shared only as permitted by their licenses.',''];report.push(p.basename(folder));
for(var j=0;j<request.fonts.length;j++){
var font=request.fonts[j],match=index[font],line;if(!match){skipped++;line='  UNAVAILABLE: '+font+' - not found in local font folders; the recipient may need to activate or license it.';report.push(line);folderReport.push(line);continue;}
if(match.restricted){skipped++;line='  SKIPPED: '+font+' - restricted embedding or bitmap-only flag.';report.push(line);folderReport.push(line);continue;}
try{var real=fs.realpathSync(match.file);if(!used[real]){var name=p.basename(match.file),target=p.join(dest,name),number=2;while(fs.existsSync(target)){target=p.join(dest,p.basename(name,p.extname(name))+'-'+number+p.extname(name));number++;}fs.copyFileSync(match.file,target,fs.constants.COPYFILE_EXCL);used[real]=p.basename(target);copied++;}line='  INCLUDED: '+font+' -> Fonts/'+used[real];report.push(line);folderReport.push(line);}catch(e){skipped++;line='  FAILED: '+font+' - '+e.message;report.push(line);folderReport.push(line);}
}
if(!request.fonts.length)folderReport.push('  No fonts detected on this artboard.');folderReport.push('');var fontReportFile=p.join(dest,'Fonts Report.txt');fs.writeFileSync(fontReportFile,folderReport.join('\r\n'),'utf8');report.push('');
}
report.push('Font files copied: '+copied,'Font references unavailable/skipped: '+skipped);report=report.concat(scan.errors);
fs.writeFileSync(p.join(base,'Fonts Report.txt'),report.join('\r\n'),'utf8');
fs.appendFileSync(p.join(base,'Package Report.txt'),'\r\nFONT COLLECTION\r\nFont files copied: '+copied+'\r\nFont references unavailable/skipped: '+skipped+'\r\nSee Fonts Report.txt for details.\r\n','utf8');
resolve({copied:copied,skipped:skipped});
}catch(e){reject(e);}}
next();
});
}
var api={collect:collect,fontInfo:fontInfo,protectedPath:protectedPath};
// CEP mixed-context exposes both window and CommonJS. The panel still needs
// the browser API even when module.exports is available.
root.JTHandoffFonts=api;
if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(typeof window!=='undefined'?window:this);
