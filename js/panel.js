(function(){
'use strict';
var cs=new CSInterface();
var currentPreset='thirds',exportFolder='',reviewFolder='',lastReviewIndex=-1,hostHasDocument=false,scaleValues=[],currentPalette=[],selectedColorIndex=0;
var socialPreset={w:1080,h:1080,label:'Instagram Post'},mockupKind='phone',dpMode='analyze',dpContext=null,dpResult=null,dpImageDataUrl='',dpImageDiagnostics=null,dpBeforeDataUrl='',dpAfterDataUrl='',dpBeforePreviewPath='',dpAfterPreviewPath='',dpCompareMode='before',dpHistoryCount=0,dpBusy=false,dpReferenceDataUrl='',dpReferenceName='';
function $(id){return document.getElementById(id)}
function q(sel){return document.querySelector(sel)}
function qa(sel){return document.querySelectorAll(sel)}
function status(message,kind){var el=$('globalStatus');el.textContent=message||'';el.className='global-status'+(kind?' '+kind:'')}
function esc(v){return String(v).replace(/\\/g,'\\\\').replace(/'/g,"\\'").replace(/\r/g,'\\r').replace(/\n/g,'\\n')}
function enc(v){if(typeof v==='number')return isFinite(v)?String(v):'0';if(typeof v==='boolean')return v?'true':'false';return "'"+esc(v)+"'"}
function parseHostResponse(raw){var text=String(raw==null?'':raw).replace(/^\uFEFF/,'').trim(),value;if(!text)return{success:false,message:'Illustrator returned an empty response.'};try{value=JSON.parse(text);if(typeof value==='string'){try{value=JSON.parse(value)}catch(ignore){}}if(value&&typeof value==='object')return value}catch(e){}return{success:false,message:'Illustrator returned an unreadable response. Reopen Jaiafa Tools and try again.'}}
function callHost(name,args,cb){var a=[],i;for(i=0;i<(args||[]).length;i++)a.push(enc(args[i]));cs.evalScript(name+'('+a.join(',')+')',function(raw){if(raw==='EvalScript error.'||raw==='EvalScript error. CEP bridge unavailable.'){cb({success:false,message:'Could not communicate with Illustrator.'});return}cb(parseHostResponse(raw))})}
function num(id,fallback){var n=Number($(id).value);return isFinite(n)?n:fallback}
function selectedApplyTo(){var el=q('input[name="applyTo"]:checked');return el?el.value:'artboard'}
function updateReviewButtons(){if($('buildReviewBtn'))$('buildReviewBtn').disabled=!hostHasDocument;if($('exportReviewPdfBtn'))$('exportReviewPdfBtn').disabled=!hostHasDocument||lastReviewIndex<0||!reviewFolder}
function setDocumentState(state){var has=!!state.hasDocument;hostHasDocument=has;$('hostDot').className='status-dot '+(has?'online':'offline');var ids=['createGuidesBtn','applyTypeBtn','outlineBtn','exportBtn','addSwatchesBtn','applyColorBtn','extractColorsBtn','createSocialBtn','createMockupBtn','refreshAIContext'];for(var i=0;i<ids.length;i++)if($(ids[i]))$(ids[i]).disabled=!has;if($('runAIBtn'))$('runAIBtn').disabled=!has||dpBusy;updateReviewButtons();$('hostDot').title=has?'Illustrator document detected':'No document open';var guides=!!state.hasLayer&&!!state.guideCount;$('visibilityBtn').disabled=!guides;$('lockBtn').disabled=!guides;$('clearBtn').disabled=!guides;$('visibilityBtn').textContent=state.visible===false?'Show':'Hide';$('lockBtn').textContent=state.locked?'Unlock':'Lock'}
function refreshState(silent){callHost('JT_getState',[],function(r){setDocumentState(r);if(!silent)status(r.message||'Ready.',r.success===false?'error':'')})}

// Navigation
Array.prototype.forEach.call(qa('.module-tab'),function(btn){btn.addEventListener('click',function(){Array.prototype.forEach.call(qa('.module-tab'),function(x){x.classList.remove('active')});Array.prototype.forEach.call(qa('.module'),function(x){x.classList.remove('active')});btn.classList.add('active');$('module-'+btn.getAttribute('data-module')).classList.add('active');var m=btn.getAttribute('data-module');if(m==='type')refreshTypeSelection();if(m==='ai'&&!dpContext)refreshAIContext();if(window.JTRoadmap&&window.JTRoadmap.moduleOpened)window.JTRoadmap.moduleOpened(m)})});

// GridMate
$('presetGrid').addEventListener('click',function(e){var card=e.target.closest('.preset-card');if(!card)return;Array.prototype.forEach.call(qa('.preset-card'),function(x){x.classList.remove('active')});card.classList.add('active');currentPreset=card.getAttribute('data-preset');$('customSection').classList.toggle('hidden',currentPreset!=='custom')});
$('createGuidesBtn').addEventListener('click',function(){var columns=Math.round(num('columnsInput',5)),rows=Math.round(num('rowsInput',3)),margin=Math.max(0,num('marginInput',0));if(currentPreset==='custom'&&(columns<1||columns>24||rows<1||rows>24)){status('Columns and rows must be between 1 and 24.','error');return}status('Creating guides…');callHost('JT_Grid_create',[currentPreset,selectedApplyTo(),margin,$('safeAreaInput').checked,columns,rows],function(r){status(r.message,r.success?'success':'error');refreshState(true)})});
$('visibilityBtn').addEventListener('click',function(){callHost('JT_Grid_toggleVisibility',[],function(r){status(r.message,r.success?'success':'error');refreshState(true)})});
$('lockBtn').addEventListener('click',function(){callHost('JT_Grid_toggleLock',[],function(r){status(r.message,r.success?'success':'error');refreshState(true)})});
$('clearBtn').addEventListener('click',function(){callHost('JT_Grid_clear',[],function(r){status(r.message,r.success?'success':'error');refreshState(true)})});

// TypeMate
function renderScale(){var base=Math.max(1,num('baseSizeInput',16)),ratio=Math.max(1.01,num('scaleSelect',1.25));scaleValues=[];var names=['Body','H4','H3','H2','H1','Display'],i,html='';for(i=0;i<6;i++){var value=base*Math.pow(ratio,i);scaleValues.push(value);var w=Math.min(100,28+i*14);html+='<div class="scale-row"><span>'+names[i]+'</span><span class="scale-bar"><i style="width:'+w+'%"></i></span><span class="scale-value">'+value.toFixed(2)+' pt</span></div>';var quick=$('scale'+i);if(quick)quick.textContent=value.toFixed(2)+' pt'}$('scalePreview').innerHTML=html}
$('baseSizeInput').addEventListener('input',renderScale);$('scaleSelect').addEventListener('change',renderScale);
function refreshTypeSelection(){callHost('JT_Type_getSelection',[],function(r){if(!r.success){$('typeSelectionStatus').textContent=r.message;return}$('typeSelectionStatus').textContent=r.count+' text object'+(r.count===1?'':'s')+' selected'+(r.size?(' · '+Number(r.size).toFixed(1)+' pt'):'');if(r.size)$('typeSizeInput').value=Number(r.size).toFixed(1);if(r.leading&&Number(r.leading)>0)$('leadingInput').value=Number(r.leading).toFixed(1);if(typeof r.tracking!=='undefined')$('trackingInput').value=r.tracking})}
$('refreshTypeBtn').addEventListener('click',refreshTypeSelection);
$('applyTypeBtn').addEventListener('click',function(){status('Applying typography…');callHost('JT_Type_apply',[Math.max(1,num('typeSizeInput',16)),Math.max(1,num('leadingInput',20)),Math.round(num('trackingInput',0))],function(r){status(r.message,r.success?'success':'error');refreshTypeSelection()})});
Array.prototype.forEach.call(qa('[data-scale-step]'),function(btn){btn.addEventListener('click',function(){var step=Number(btn.getAttribute('data-scale-step')),size=scaleValues[step]||16,leading=size*1.2;$('typeSizeInput').value=size.toFixed(2);$('leadingInput').value=leading.toFixed(2);callHost('JT_Type_apply',[size,leading,Math.round(num('trackingInput',0))],function(r){status(r.message,r.success?'success':'error');refreshTypeSelection()})})});
$('outlineBtn').addEventListener('click',function(){callHost('JT_Type_outline',[],function(r){status(r.message,r.success?'success':'error');refreshTypeSelection()})});

// ColorMate
function cleanHex(v){v=String(v||'').trim().toUpperCase();if(v.charAt(0)!=='#')v='#'+v;return /^#[0-9A-F]{6}$/.test(v)?v:null}
function hexRgb(hex){hex=cleanHex(hex)||'#FF6A22';return{r:parseInt(hex.substr(1,2),16),g:parseInt(hex.substr(3,2),16),b:parseInt(hex.substr(5,2),16)}}
function rgbHex(r,g,b){function h(n){n=Math.max(0,Math.min(255,Math.round(n)));var s=n.toString(16).toUpperCase();return s.length<2?'0'+s:s}return'#'+h(r)+h(g)+h(b)}
function rgbHsl(rgb){var r=rgb.r/255,g=rgb.g/255,b=rgb.b/255,max=Math.max(r,g,b),min=Math.min(r,g,b),h=0,s=0,l=(max+min)/2,d=max-min;if(d){s=l>.5?d/(2-max-min):d/(max+min);if(max===r)h=(g-b)/d+(g<b?6:0);else if(max===g)h=(b-r)/d+2;else h=(r-g)/d+4;h*=60}return{h:h,s:s,l:l}}
function hslRgb(h,s,l){h=((h%360)+360)%360/360;function hue(p,q,t){if(t<0)t+=1;if(t>1)t-=1;if(t<1/6)return p+(q-p)*6*t;if(t<1/2)return q;if(t<2/3)return p+(q-p)*(2/3-t)*6;return p}var r,g,b;if(s===0)r=g=b=l;else{var q=l<.5?l*(1+s):l+s-l*s,p=2*l-q;r=hue(p,q,h+1/3);g=hue(p,q,h);b=hue(p,q,h-1/3)}return{r:r*255,g:g*255,b:b*255}}
function hslHex(h,s,l){var rgb=hslRgb(h,Math.max(0,Math.min(1,s)),Math.max(0,Math.min(1,l)));return rgbHex(rgb.r,rgb.g,rgb.b)}
function generatePalette(){var base=cleanHex($('baseColorHex').value)||'#FF6A22',hsl=rgbHsl(hexRgb(base)),mode=$('harmonySelect').value,p=[];if(mode==='complementary')p=[hslHex(hsl.h,hsl.s,Math.min(.9,hsl.l+.22)),base,hslHex(hsl.h+180,hsl.s,hsl.l),hslHex(hsl.h+180,hsl.s,Math.min(.85,hsl.l+.18)),hslHex(hsl.h,hsl.s,Math.max(.16,hsl.l-.22))];else if(mode==='analogous')p=[-60,-30,0,30,60].map(function(d){return hslHex(hsl.h+d,hsl.s,hsl.l)});else if(mode==='triadic')p=[base,hslHex(hsl.h+120,hsl.s,hsl.l),hslHex(hsl.h+240,hsl.s,hsl.l),hslHex(hsl.h,hsl.s,Math.min(.86,hsl.l+.2)),hslHex(hsl.h,hsl.s,Math.max(.18,hsl.l-.2))];else if(mode==='split')p=[base,hslHex(hsl.h+150,hsl.s,hsl.l),hslHex(hsl.h+210,hsl.s,hsl.l),hslHex(hsl.h,hsl.s,Math.min(.86,hsl.l+.2)),hslHex(hsl.h,hsl.s,Math.max(.18,hsl.l-.2))];else if(mode==='monochrome')p=[-.28,-.14,0,.14,.28].map(function(d){return hslHex(hsl.h,hsl.s,Math.max(.08,Math.min(.94,hsl.l+d)))});else p=[hslHex(hsl.h,hsl.s,Math.max(.08,hsl.l-.3)),hslHex(hsl.h,hsl.s,Math.max(.08,hsl.l-.15)),base,hslHex(hsl.h,hsl.s,Math.min(.94,hsl.l+.15)),hslHex(hsl.h,hsl.s,Math.min(.97,hsl.l+.3))];currentPalette=p;selectedColorIndex=Math.min(selectedColorIndex,p.length-1);renderPalette('palettePreview',p,true)}
function renderPalette(id,colors,selectable){var el=$(id),html='';for(var i=0;i<colors.length;i++)html+='<button class="color-chip'+(selectable&&i===selectedColorIndex?' selected':'')+'" data-color-index="'+i+'" data-color="'+colors[i]+'" title="'+colors[i]+'"><i style="background:'+colors[i]+'"></i><span>'+colors[i]+'</span></button>';el.innerHTML=html;if(selectable)Array.prototype.forEach.call(el.querySelectorAll('.color-chip'),function(btn){btn.addEventListener('click',function(){selectedColorIndex=Number(btn.getAttribute('data-color-index'));renderPalette(id,currentPalette,true)})})}
function syncBaseFromPicker(){$('baseColorHex').value=$('baseColorPicker').value.toUpperCase();generatePalette()}
$('baseColorPicker').addEventListener('input',syncBaseFromPicker);$('baseColorHex').addEventListener('change',function(){var h=cleanHex(this.value);if(!h){this.value=$('baseColorPicker').value.toUpperCase();status('Enter a valid 6-digit HEX color.','error');return}$('baseColorPicker').value=h;this.value=h;generatePalette()});$('harmonySelect').addEventListener('change',generatePalette);
$('applyColorBtn').addEventListener('click',function(){if(!currentPalette.length)return;callHost('JT_Color_apply',[currentPalette[selectedColorIndex]],function(r){status(r.message,r.success?'success':'error')})});
$('addSwatchesBtn').addEventListener('click',function(){if(!currentPalette.length)return;var rows=[],mode=$('harmonySelect').options[$('harmonySelect').selectedIndex].text;for(var i=0;i<currentPalette.length;i++)rows.push('ColorMate '+mode+' '+(i+1)+'|'+currentPalette[i]);callHost('JT_Color_addSwatches',[rows.join(';')],function(r){status(r.message,r.success?'success':'error')})});
$('extractColorsBtn').addEventListener('click',function(){callHost('JT_Color_extract',[],function(r){if(!r.success){status(r.message,'error');return}var c=String(r.hexes||'').split(',').filter(function(x){return!!x});renderPalette('extractedColors',c,false);status(r.message,'success');if(c.length){currentPalette=c;selectedColorIndex=0;renderPalette('palettePreview',currentPalette,true)}})});

// SocialMate
$('socialPresets').addEventListener('click',function(e){var card=e.target.closest('.social-card');if(!card)return;Array.prototype.forEach.call(qa('.social-card'),function(x){x.classList.remove('active')});card.classList.add('active');socialPreset={w:Number(card.getAttribute('data-w')),h:Number(card.getAttribute('data-h')),label:card.getAttribute('data-label')}});
$('createSocialBtn').addEventListener('click',function(){status('Creating social artboard…');callHost('JT_Social_create',[socialPreset.w,socialPreset.h,socialPreset.label,Math.max(0,Math.min(40,num('socialSafeInput',5))),$('socialCopySelection').checked],function(r){status(r.message,r.success?'success':'error');refreshState(true)})});
$('clearSocialGuidesBtn').addEventListener('click',function(){callHost('JT_Social_clearGuides',[],function(r){status(r.message,r.success?'success':'error')})});

// MockupMate
$('mockupPresets').addEventListener('click',function(e){var card=e.target.closest('.mockup-card');if(!card)return;Array.prototype.forEach.call(qa('.mockup-card'),function(x){x.classList.remove('active')});card.classList.add('active');mockupKind=card.getAttribute('data-kind')});
$('createMockupBtn').addEventListener('click',function(){var fit=q('input[name="mockFit"]:checked');status('Building presentation mockup…');callHost('JT_Mockup_create',[mockupKind,fit?fit.value:'fill'],function(r){status(r.message,r.success?'success':'error');refreshState(true)})});

// ExportMate
function updateNamePreview(){var prefix=$('prefixInput').value.trim(),ext=$('formatSelect').value,base=(prefix?prefix+'-':'')+'Artboard-1';$('namePreview').textContent=base+'.'+ext;$('transparentRow').style.display=$('formatSelect').value==='jpg'?'none':'flex'}
$('formatSelect').addEventListener('change',updateNamePreview);$('prefixInput').addEventListener('input',updateNamePreview);
$('chooseFolderBtn').addEventListener('click',function(){callHost('JT_Export_chooseFolder',[],function(r){if(r.success){exportFolder=r.path;$('exportPath').textContent=r.path;$('exportPath').title=r.path;status('Export folder selected.','success')}else status(r.message,'error')})});
$('exportBtn').addEventListener('click',function(){if(!exportFolder){status('Choose an export folder first.','error');return}var format=$('formatSelect').value,scale=Math.max(1,num('exportScaleSelect',100)),scope=$('exportScopeSelect').value,prefix=$('prefixInput').value.trim(),transparent=$('transparentInput').checked;status('Exporting artwork…');callHost('JT_Export_run',[exportFolder,format,scale,scope,prefix,transparent],function(r){status(r.message,r.success?'success':'error')})});

// Client Review
function updateReviewComparison(){var ready=!!(dpBeforePreviewPath&&dpAfterPreviewPath),box=$('reviewComparison');box.disabled=!ready;if(!ready)box.checked=false;$('reviewComparisonStatus').textContent=ready?'DesignPilot comparison ready · Before and After will be presented side by side.':'Capture and apply a DesignPilot result to enable comparison.'}
function reviewValue(id,fallback){var v=$(id).value.trim();return v||fallback}
$('buildReviewBtn').addEventListener('click',function(){var compare=$('reviewComparison').checked&&!!(dpBeforePreviewPath&&dpAfterPreviewPath),args=[reviewValue('reviewClient','Client'),reviewValue('reviewProject','Untitled Project'),reviewValue('reviewTitle','Design Direction'),reviewValue('reviewRound','Round 01'),$('reviewRationale').value.trim(),$('reviewNotes').value.trim(),$('reviewTheme').value,$('reviewPalette').checked,compare,compare?dpBeforePreviewPath:'',compare?dpAfterPreviewPath:''];status('Building client review board…');callHost('JT_Review_build',args,function(r){status(r.message,r.success?'success':'error');if(r.success){lastReviewIndex=Number(r.artboardIndex);updateReviewButtons();refreshState(true)}})});
$('chooseReviewFolderBtn').addEventListener('click',function(){callHost('JT_Export_chooseFolder',[],function(r){if(r.success){reviewFolder=r.path;$('reviewExportPath').textContent=r.path;$('reviewExportPath').title=r.path;updateReviewButtons();status('Client PDF folder selected.','success')}else status(r.message,'error')})});
$('exportReviewPdfBtn').addEventListener('click',function(){if(!reviewFolder||lastReviewIndex<0){status('Build a review board and choose a PDF folder first.','error');return}var name=reviewValue('reviewProject','Client Review')+' - '+reviewValue('reviewTitle','Design Direction')+' - '+reviewValue('reviewRound','Round 01');status('Exporting client review PDF…');callHost('JT_Review_exportPDF',[reviewFolder,name,lastReviewIndex],function(r){status(r.message,r.success?'success':'error');if(r.success&&r.path){$('reviewExportPath').textContent=r.path;$('reviewExportPath').title=r.path}})});

// DesignPilot AI
function htmlEsc(v){return String(v==null?'':v).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;')}
function clamp(v,min,max,fallback){if(v===null||typeof v==='undefined'||v==='')v=fallback;v=Number(v);if(!isFinite(v))v=fallback;return Math.max(min,Math.min(max,v))}
function cepNodeRequire(){try{if(window.cep_node&&window.cep_node.require)return window.cep_node.require}catch(ignore){}return null}
function nodeBuffer(){var req=cepNodeRequire();try{return req?req('buffer').Buffer:null}catch(ignore){return null}}
function readPreviewBase64(path){
  if(!window.JTImageDataUrl)return{ok:false,message:'DesignPilot image validation is unavailable. Reinstall Jaiafa Tools.'};
  var req=cepNodeRequire(),fs=null,BufferCtor=null,buffer,result;
  if(req){
    try{fs=req('fs');BufferCtor=req('buffer').Buffer}catch(ignore){}
  }
  if(fs){
    try{
      buffer=fs.readFileSync(path);
      result=window.JTImageDataUrl.fromBuffer(buffer,BufferCtor);
      if(!result.ok)return result;
      return{ok:true,data:result.dataUrl,diagnostics:result.diagnostics};
    }catch(e){return{ok:false,message:'Could not read the DesignPilot preview file: '+e.message}}
  }
  try{
    if(!window.cep||!window.cep.fs||typeof cep==='undefined')return{ok:false,message:'CEP file access is unavailable in this host.'};
    var r=window.cep.fs.readFile(path,cep.encoding.Base64);
    if(!r||r.err!==0)return{ok:false,message:'Could not read the temporary artboard preview'+(r&&typeof r.err!=='undefined'?' (CEP error '+r.err+')':'')+'.'};
    result=window.JTImageDataUrl.fromBase64(String(r.data||'').replace(/\s+/g,''),BufferCtor);
    if(!result.ok)return result;
    return{ok:true,data:result.dataUrl,diagnostics:result.diagnostics};
  }catch(e2){return{ok:false,message:'Could not read the DesignPilot preview: '+e2.message}}
}
function compactBytes(n){n=Number(n)||0;return n>=1048576?(n/1048576).toFixed(1)+' MB':Math.max(1,Math.round(n/1024))+' KB'}
function updateHistoryUI(){var has=dpHistoryCount>0;$('dpHistoryActions').classList.toggle('hidden',!has);$('dpHistoryStatus').textContent=dpHistoryCount+' restore point'+(dpHistoryCount===1?'':'s');$('dpRestoreLast').disabled=!has;$('dpRestoreOriginal').disabled=!has}
function showCompare(mode){
  if(!dpBeforeDataUrl)return;
  if(!dpAfterDataUrl)mode='before';
  dpCompareMode=mode;
  Array.prototype.forEach.call(qa('#dpCompareControls button'),function(b){b.classList.toggle('active',b.getAttribute('data-compare')===mode)});
  $('dpSplitPreview').classList.toggle('hidden',mode!=='split');
  $('dpPreview').classList.toggle('hidden',mode==='split');
  if(mode==='split'){
    $('dpBeforePreview').src=dpBeforeDataUrl;$('dpAfterPreview').src=dpAfterDataUrl;
  }else $('dpPreview').src=mode==='after'?dpAfterDataUrl:dpBeforeDataUrl;
}
function updateCompareUI(preferred){var hasAfter=!!(dpBeforeDataUrl&&dpAfterDataUrl);$('dpCompareControls').classList.toggle('hidden',!hasAfter);$('dpPreviewEmpty').classList.add('hidden');showCompare(hasAfter?(preferred||dpCompareMode||'after'):'before')}
function clearDesignPilotSession(){dpBeforeDataUrl='';dpAfterDataUrl='';dpBeforePreviewPath='';dpAfterPreviewPath='';dpHistoryCount=0;dpCompareMode='before';updateHistoryUI();updateReviewComparison();$('dpCompareControls').classList.add('hidden');$('dpSplitPreview').classList.add('hidden')}
function refreshAIContext(done,preserveSession){
  $('aiContextStatus').textContent='Capturing active artboard…';$('refreshAIContext').disabled=true;
  callHost('JT_DP_captureContext',[!!preserveSession],function(r){
    $('refreshAIContext').disabled=false;
    if(!r.success){dpContext=null;dpImageDataUrl='';dpImageDiagnostics=null;if(!preserveSession)clearDesignPilotSession();$('aiContextStatus').textContent=r.message;$('dpPreview').classList.add('hidden');$('dpSplitPreview').classList.add('hidden');$('dpPreviewEmpty').classList.remove('hidden');status(r.message,'error');if(done)done(false);return}
    var img=readPreviewBase64(r.previewPath);
    if(!img.ok){dpContext=null;dpImageDataUrl='';dpImageDiagnostics=null;$('aiContextStatus').textContent=img.message;status(img.message,'error');if(done)done(false);return}
    var objects=[];try{objects=JSON.parse(r.objects||'[]')}catch(e){}
    dpContext={artboardName:r.artboardName||'Artboard',width:Number(r.width)||0,height:Number(r.height)||0,objectCount:Number(r.objectCount)||objects.length,objects:objects,previewPath:r.previewPath};
    dpResult=null;$('dpResults').classList.add('hidden');dpImageDataUrl=img.data;dpImageDiagnostics=img.diagnostics;
    if(!r.sessionPreserved||!dpBeforeDataUrl){clearDesignPilotSession();dpBeforeDataUrl=img.data;dpBeforePreviewPath=r.previewPath}else if(dpHistoryCount>0){dpAfterDataUrl=img.data;dpAfterPreviewPath=r.previewPath}
    if(typeof r.historyCount!=='undefined')dpHistoryCount=Math.max(0,Number(r.historyCount)||0);updateHistoryUI();updateCompareUI(dpAfterDataUrl?'after':'before');
    $('aiContextStatus').textContent=dpContext.artboardName+' · '+Math.round(dpContext.width)+' × '+Math.round(dpContext.height)+' · '+dpContext.objectCount+' editable object'+(dpContext.objectCount===1?'':'s');
    status('Snapshot ready · PNG · '+compactBytes(dpImageDiagnostics.byteLength)+' · payload validated','success');if(done)done(true)
  })
}
function captureComparisonAfter(done){callHost('JT_DP_capturePreviewOnly',[],function(r){if(!r.success){status(r.message,'error');if(done)done(false);return}var img=readPreviewBase64(r.previewPath);if(!img.ok){status(img.message,'error');if(done)done(false);return}dpAfterDataUrl=img.data;dpAfterPreviewPath=r.previewPath;updateCompareUI('after');updateReviewComparison();if(done)done(true)})}
$('refreshAIContext').addEventListener('click',function(){refreshAIContext(null,false)});
$('dpCompareControls').addEventListener('click',function(e){var b=e.target.closest('[data-compare]');if(b)showCompare(b.getAttribute('data-compare'))});
$('dpModeGrid').addEventListener('click',function(e){var b=e.target.closest('.dp-mode');if(!b)return;Array.prototype.forEach.call(qa('.dp-mode'),function(x){x.classList.remove('active')});b.classList.add('active');dpMode=b.getAttribute('data-dp-mode')||'analyze'});
function dpConstraints(){var parts=[];if($('dpPreserveCopy').checked)parts.push('Preserve all wording exactly; do not return text replacement operations.');else parts.push('Copy may be refined only when it clearly improves hierarchy.');if($('dpPreserveColors').checked)parts.push('Preserve existing brand colors; do not return fill-color operations.');else parts.push('Color changes are allowed when useful.');if($('dpPreserveImages').checked)parts.push('Preserve image content; only placement/scale changes are allowed.');return parts.join(' ')}
function dpPrompt(){var direction=$('dpDirection').value,extra=$('aiPrompt').value.trim(),modeNote=dpMode==='analyze'?'Analyze the composition. Do not invent changes simply to have something to say. improvementPlan.operations may be empty.':dpMode==='improve'?'Analyze the composition, then provide a restrained improvementPlan containing only changes with a clear visual reason. Also include up to 2 optional variations.':'Analyze briefly, then create exactly 3 meaningfully different layout variations using the existing objects. Keep improvementPlan minimal.';var schema='Return ONLY valid JSON, no markdown, using this exact structure: {"summary":"short art-director read","strengths":["..."],"issues":[{"title":"...","detail":"...","severity":"high|medium|low"}],"improvementPlan":{"name":"Refined","rationale":"...","operations":[OPERATION]},"variations":[{"name":"Minimal","description":"...","operations":[OPERATION]}]}. Every OPERATION must contain ALL of these fields: {"objectId":"o0","type":"move","a":0,"b":0,"c":0,"text":"","reason":"..."}. Interpret the fields by type: move => a=dx, b=dy; scale => a=percent; type => a=font size, b=leading, c=tracking; fill => text=#RRGGBB; opacity => a=0..100; text => text=replacement copy. Unused numeric fields must be 0 and unused text must be an empty string. Coordinates are Illustrator points: positive dx moves right and positive dy moves up. Keep movement proportional and realistic. Scale percent should normally stay 70–140. Never invent object IDs. Do not propose unsupported cropping, masking, font-family replacement, image generation, or effects.';var objectJson=JSON.stringify(dpContext?dpContext.objects:[]);return 'You are DesignPilot, a senior graphic-design art director embedded in Adobe Illustrator. Judge hierarchy, alignment, spacing, balance, focal point, readability, composition, negative space and consistency. You are looking at the rendered artboard and a machine-readable list of editable objects.\n\nMODE: '+dpMode+'\nDIRECTION: '+direction+'\nCONSTRAINTS: '+dpConstraints()+'\n'+modeNote+(extra?'\nEXTRA INSTRUCTION: '+extra:'')+'\n\nARTBOARD: '+(dpContext?dpContext.artboardName:'')+' '+(dpContext?dpContext.width:0)+' × '+(dpContext?dpContext.height:0)+' pt\nEDITABLE OBJECTS:\n'+objectJson+'\n\n'+schema}
function extractCompletion(data){
  var result={text:'',finishReason:'',model:'',refusal:'',completionTokens:0,reasoningTokens:0};
  try{
    result.model=String(data&&data.model||'');
    var choice=data&&data.choices&&data.choices[0]?data.choices[0]:null;
    result.finishReason=String(choice&&choice.finish_reason||choice&&choice.native_finish_reason||'');
    var msg=choice&&choice.message?choice.message:{};
    if(msg&&msg.refusal)result.refusal=String(msg.refusal);
    var content=msg?msg.content:null,parts=[],i,x;
    if(typeof content==='string')parts.push(content);
    else if(Object.prototype.toString.call(content)==='[object Array]'){
      for(i=0;i<content.length;i++){
        x=content[i];
        if(typeof x==='string')parts.push(x);
        else if(x&&typeof x.text==='string')parts.push(x.text);
        else if(x&&typeof x.content==='string')parts.push(x.content);
        else if(x&&typeof x.output_text==='string')parts.push(x.output_text);
      }
    }else if(content&&typeof content==='object'){
      if(typeof content.text==='string')parts.push(content.text);
      if(typeof content.output_text==='string')parts.push(content.output_text);
    }
    if(!parts.length&&choice&&typeof choice.text==='string')parts.push(choice.text);
    if(!parts.length&&data&&typeof data.output_text==='string')parts.push(data.output_text);
    if(!parts.length&&data&&Object.prototype.toString.call(data.output)==='[object Array]'){
      for(i=0;i<data.output.length;i++){
        x=data.output[i];
        if(x&&typeof x.text==='string')parts.push(x.text);
        if(x&&Object.prototype.toString.call(x.content)==='[object Array]'){
          for(var j=0;j<x.content.length;j++)if(x.content[j]&&typeof x.content[j].text==='string')parts.push(x.content[j].text);
        }
      }
    }
    result.text=parts.join('\n').trim();
    var usage=data&&data.usage?data.usage:{};
    result.completionTokens=Number(usage.completion_tokens||usage.output_tokens||0)||0;
    var details=usage.completion_tokens_details||usage.output_tokens_details||{};
    result.reasoningTokens=Number(details.reasoning_tokens||0)||0;
  }catch(ignore){}
  return result;
}
function parseDPJson(text){text=String(text||'').trim().replace(/^```(?:json)?\s*/i,'').replace(/\s*```$/,'');var a=text.indexOf('{'),b=text.lastIndexOf('}');if(a>=0&&b>a)text=text.slice(a,b+1);return JSON.parse(text)}
function cleanOps(ops){var out=[],allowed={move:1,scale:1,type:1,fill:1,opacity:1,text:1};if(Object.prototype.toString.call(ops)!=='[object Array]')return out;for(var i=0;i<ops.length&&out.length<30;i++){var o=ops[i]||{},t=String(o.type||'');if(!/^o\d+$/.test(String(o.objectId||''))||!allowed[t])continue;var c={objectId:String(o.objectId),type:t,reason:String(o.reason||'')},a=o.a,b=o.b,cc=o.c,txt=o.text;if(t==='move'){c.dx=clamp(o.dx!=null?o.dx:a,-2000,2000,0);c.dy=clamp(o.dy!=null?o.dy:b,-2000,2000,0)}else if(t==='scale')c.percent=clamp(o.percent!=null?o.percent:a,40,220,100);else if(t==='type'){c.size=clamp(o.size!=null?o.size:a,1,1000,16);c.leading=clamp(o.leading!=null?o.leading:b,1,1200,c.size*1.15);c.tracking=clamp(o.tracking!=null?o.tracking:cc,-500,1000,0)}else if(t==='fill'){if($('dpPreserveColors').checked)continue;var h=cleanHex(o.hex||txt);if(!h)continue;c.hex=h}else if(t==='opacity')c.value=clamp(o.value!=null?o.value:a,0,100,100);else if(t==='text'){c.contents=String(o.contents!=null?o.contents:txt||'').slice(0,3000);if($('dpPreserveCopy').checked)continue}out.push(c)}return out}
function normalizeDPResult(r){r=r&&typeof r==='object'?r:{};r.summary=String(r.summary||'Design analysis completed.');r.strengths=Object.prototype.toString.call(r.strengths)==='[object Array]'?r.strengths.slice(0,5):[];r.issues=Object.prototype.toString.call(r.issues)==='[object Array]'?r.issues.slice(0,8):[];r.improvementPlan=r.improvementPlan&&typeof r.improvementPlan==='object'?r.improvementPlan:{name:'Refined',rationale:'',operations:[]};r.improvementPlan.operations=cleanOps(r.improvementPlan.operations);r.variations=Object.prototype.toString.call(r.variations)==='[object Array]'?r.variations.slice(0,3):[];for(var i=0;i<r.variations.length;i++){r.variations[i]=r.variations[i]||{};r.variations[i].name=String(r.variations[i].name||('Direction '+(i+1)));r.variations[i].description=String(r.variations[i].description||'');r.variations[i].operations=cleanOps(r.variations[i].operations)}return r}
function objectLabel(id){if(!dpContext||!dpContext.objects)return id;for(var i=0;i<dpContext.objects.length;i++){var x=dpContext.objects[i];if(x.objectId===id){if(x.type==='TextFrame'&&x.text)return id+' · '+String(x.text).replace(/\s+/g,' ').slice(0,34);if(x.name)return id+' · '+x.name;return id+' · '+x.type}}return id}
function opLabel(o){if(o.type==='move')return'Move '+Math.round(o.dx)+' pt X / '+Math.round(o.dy)+' pt Y';if(o.type==='scale')return'Scale to '+Math.round(o.percent)+'%';if(o.type==='type')return'Type '+Number(o.size).toFixed(1)+' / '+Number(o.leading).toFixed(1)+' · tracking '+Math.round(o.tracking);if(o.type==='fill')return'Fill '+o.hex;if(o.type==='opacity')return'Opacity '+Math.round(o.value)+'%';if(o.type==='text')return'Refine copy';return o.type}
function updateOperationSelection(){var boxes=qa('#dpOperations .dp-op-checkbox'),selected=0;Array.prototype.forEach.call(boxes,function(b){if(b.checked)selected++;var card=b.closest('.dp-operation');if(card)card.classList.toggle('disabled',!b.checked)});if($('dpSelectionStatus'))$('dpSelectionStatus').textContent=selected+' of '+boxes.length+' proposed change'+(boxes.length===1?'':'s')+' selected.';$('applyDPBtn').disabled=!selected;$('variantDPBtn').disabled=!selected}
function renderDPResult(){
  var r=dpResult;$('dpResults').classList.remove('hidden');$('dpSummary').textContent=r.summary;
  var sh='';for(var i=0;i<r.strengths.length;i++)sh+='<div class="dp-strength">✓ '+htmlEsc(r.strengths[i])+'</div>';$('dpStrengths').innerHTML=sh;
  var ih='';for(i=0;i<r.issues.length;i++){var x=r.issues[i]||{},sev=/^(high|medium|low)$/.test(x.severity)?x.severity:'low';ih+='<div class="dp-issue"><div class="dp-issue-head"><strong>'+htmlEsc(x.title||'Observation')+'</strong><span class="dp-severity '+sev+'">'+sev+'</span></div><p>'+htmlEsc(x.detail||'')+'</p></div>'}if(!ih)ih='<div class="dp-summary">No major composition problem was identified.</div>';$('dpIssues').innerHTML=ih;
  var ops=r.improvementPlan.operations||[];$('dpImprovementSection').classList.toggle('hidden',!ops.length);var oh='';
  for(i=0;i<ops.length;i++)oh+='<div class="dp-operation"><label class="dp-operation-select"><input class="dp-op-checkbox" type="checkbox" data-op-index="'+i+'" checked><span><span class="dp-op-head"><strong>'+htmlEsc(objectLabel(ops[i].objectId))+'</strong></span><span class="dp-op-meta">'+htmlEsc(opLabel(ops[i]))+'</span><p>'+htmlEsc(ops[i].reason||'')+'</p></span></label></div>';
  $('dpOperations').innerHTML=oh;updateOperationSelection();
  var vars=r.variations||[];$('dpVariationsSection').classList.toggle('hidden',!vars.length);var vh='';
  for(i=0;i<vars.length;i++){var vo=vars[i].operations||[],vops='';for(var j=0;j<vo.length;j++)vops+='<label class="dp-variant-op"><input class="dp-variant-checkbox" type="checkbox" data-op-index="'+j+'" checked><span>'+htmlEsc(objectLabel(vo[j].objectId))+' · '+htmlEsc(opLabel(vo[j]))+'</span></label>';vh+='<div class="dp-variant-card" data-variant-card="'+i+'"><div class="dp-variant-top"><div><strong>'+htmlEsc(vars[i].name)+'</strong><p>'+htmlEsc(vars[i].description)+'</p></div><span class="dp-count">'+vo.length+' edits</span></div><div class="dp-variant-ops">'+vops+'</div><button class="secondary-btn dp-build-variant" data-variant-index="'+i+'">Build selected direction</button></div>'}
  $('dpVariations').innerHTML=vh;if(window.JTRoadmap&&window.JTRoadmap.enhanceDP)window.JTRoadmap.enhanceDP()
}
function operationSchema(){return{type:'object',additionalProperties:false,properties:{objectId:{type:'string'},type:{type:'string',enum:['move','scale','type','fill','opacity','text']},a:{type:'number'},b:{type:'number'},c:{type:'number'},text:{type:'string'},reason:{type:'string'}},required:['objectId','type','a','b','c','text','reason']}}
function designPilotResponseFormat(){var op=operationSchema();return{type:'json_schema',json_schema:{name:'designpilot_plan',strict:true,schema:{type:'object',additionalProperties:false,properties:{summary:{type:'string'},strengths:{type:'array',items:{type:'string'}},issues:{type:'array',items:{type:'object',additionalProperties:false,properties:{title:{type:'string'},detail:{type:'string'},severity:{type:'string',enum:['high','medium','low']}},required:['title','detail','severity']}},improvementPlan:{type:'object',additionalProperties:false,properties:{name:{type:'string'},rationale:{type:'string'},operations:{type:'array',items:op}},required:['name','rationale','operations']},variations:{type:'array',items:{type:'object',additionalProperties:false,properties:{name:{type:'string'},description:{type:'string'},operations:{type:'array',items:op}},required:['name','description','operations']}}},required:['summary','strengths','issues','improvementPlan','variations']}}}}
function cleanApiKey(key){return String(key||'').replace(/[^\x21-\x7E]/g,'').trim()}
function openRouterErrorText(data,httpStatus){var parts=['OpenRouter '+httpStatus],err=data&&data.error?data.error:null,md=err&&err.metadata?err.metadata:null,raw='';if(err&&err.message)parts.push(String(err.message));if(err&&err.code&&String(err.code)!==String(httpStatus))parts.push('code '+String(err.code));if(md){if(md.provider_name)parts.push('provider '+String(md.provider_name));else if(md.provider)parts.push('provider '+String(md.provider));if(md.raw){try{raw=typeof md.raw==='string'?md.raw:JSON.stringify(md.raw)}catch(ignore){raw=String(md.raw)}if(raw.length>420)raw=raw.slice(0,420)+'…';if(raw)parts.push(raw)}}if(data&&data.openrouter_metadata&&data.openrouter_metadata.provider)parts.push('provider '+String(data.openrouter_metadata.provider));return parts.join(' · ')}
function shouldRetryProvider(httpStatus,data){var msg='';try{msg=String(data&&data.error&&data.error.message||'').toLowerCase()}catch(ignore){}return httpStatus===400||httpStatus===408||httpStatus===409||httpStatus===422||httpStatus===429||httpStatus===502||httpStatus===503||httpStatus===524||httpStatus===529||msg.indexOf('provider returned error')>=0||msg.indexOf('structured')>=0||msg.indexOf('response_format')>=0}
function validateOpenRouterBody(body){
  try{
    var content=body&&body.messages&&body.messages[1]&&body.messages[1].content;
    if(!content||content.length<2||content[0].type!=='text'||content[1].type!=='image_url')return{ok:false,message:'DesignPilot request must contain text followed by one PNG image.'};
    var originals=[],checks=[],i,url,checked;for(i=1;i<content.length;i++){if(content[i].type!=='image_url')continue;url=content[i]&&content[i].image_url&&content[i].image_url.url;checked=window.JTImageDataUrl.validateDataUrl(url,nodeBuffer());if(!checked.ok)return checked;originals.push(url);checks.push(checked)}
    if(!checks.length)return{ok:false,message:'DesignPilot request does not contain a validated PNG image.'};
    if(dpImageDiagnostics&&checks[0].diagnostics.byteLength!==dpImageDiagnostics.byteLength)return{ok:false,message:'DesignPilot outgoing image byte length does not match the captured PNG.'};
    var serialized=JSON.stringify(body),reparsed=JSON.parse(serialized),outgoingContent=reparsed.messages[1].content,outIndex=0,outgoing,outgoingCheck;
    for(i=1;i<outgoingContent.length;i++){if(outgoingContent[i].type!=='image_url')continue;outgoing=outgoingContent[i].image_url.url;if(outgoing!==originals[outIndex])return{ok:false,message:'DesignPilot image data changed during request serialization.'};outgoingCheck=window.JTImageDataUrl.validateDataUrl(outgoing,nodeBuffer());if(!outgoingCheck.ok)return outgoingCheck;if(outgoingCheck.diagnostics.byteLength!==checks[outIndex].diagnostics.byteLength)return{ok:false,message:'DesignPilot image data changed during final payload validation.'};outIndex++}
    return{ok:true,serialized:serialized,diagnostics:checks[0].diagnostics};
  }catch(e){return{ok:false,message:'DesignPilot could not validate the outgoing image payload: '+e.message}}
}
function openRouterXHR(key,body,cb,priorError,serialized){try{key=cleanApiKey(key);var xhr=new XMLHttpRequest();xhr.open('POST','https://openrouter.ai/api/v1/chat/completions',true);xhr.setRequestHeader('Authorization','Bearer '+key);xhr.setRequestHeader('Content-Type','application/json');xhr.setRequestHeader('Accept','application/json');xhr.timeout=120000;xhr.onreadystatechange=function(){if(xhr.readyState===4)cb(null,xhr.status,xhr.responseText||'', 'browser')};xhr.onerror=function(){var prefix=priorError?('Node HTTPS failed: '+priorError+'. '):'';cb(new Error(prefix+'Browser network request failed.'),0,'','browser')};xhr.ontimeout=function(){var prefix=priorError?('Node HTTPS failed: '+priorError+'. '):'';cb(new Error(prefix+'OpenRouter request timed out.'),0,'','browser')};xhr.send(serialized||JSON.stringify(body))}catch(e){var prefix=priorError?('Node HTTPS failed: '+priorError+'. '):'';cb(new Error(prefix+e.message),0,'','browser')}}
function openRouterRequest(key,body,cb,serialized){key=cleanApiKey(key);var reqFn=cepNodeRequire();if(!reqFn){openRouterXHR(key,body,cb,'CEP Node.js is unavailable',serialized);return}try{var https=reqFn('https'),BufferCtor=reqFn('buffer').Buffer,payload=serialized||JSON.stringify(body),finished=false,opts={hostname:'openrouter.ai',port:443,path:'/api/v1/chat/completions',method:'POST',headers:{'Authorization':'Bearer '+key,'Content-Type':'application/json','Accept':'application/json','Content-Length':BufferCtor.byteLength(payload,'utf8')}};var req=https.request(opts,function(res){var chunks='';res.setEncoding('utf8');res.on('data',function(c){chunks+=c});res.on('end',function(){if(finished)return;finished=true;cb(null,Number(res.statusCode)||0,chunks,'node')})});req.on('error',function(err){if(finished)return;finished=true;openRouterXHR(key,body,cb,err&&err.message?err.message:'Unknown Node HTTPS error',payload)});if(req.setTimeout)req.setTimeout(120000,function(){try{req.destroy()}catch(ignore2){}if(finished)return;finished=true;openRouterXHR(key,body,cb,'Node HTTPS timed out',payload)});req.write(payload);req.end()}catch(e){openRouterXHR(key,body,cb,e&&e.message?e.message:'Node HTTPS setup failed',serialized)}}
function emptyCompletionDetail(c,spec){var bits=['No final analysis text'];if(c.model)bits.push('model '+c.model);if(c.finishReason)bits.push('finish '+c.finishReason);if(c.completionTokens)bits.push(c.completionTokens+' output tokens');if(c.reasoningTokens)bits.push(c.reasoningTokens+' reasoning tokens');if(c.refusal)bits.push('refusal '+c.refusal);bits.push(spec.label);return bits.join(' · ')}
function runAI(){
  var key=$('openRouterKey').value.trim(),model=$('aiModel').value.trim()||'google/gemini-3.8-flash';
  if(!key){status('Add your OpenRouter API key first.','error');return}
  function execute(){
    if(!dpContext||!dpImageDataUrl){status('Capture the active artboard first.','error');return}
    if($('rememberAIKey').checked)localStorage.setItem('jaiafa_openrouter_key',key);else localStorage.removeItem('jaiafa_openrouter_key');
    var referenceNote=dpReferenceDataUrl?'\n\nREFERENCE IMAGE: A second image follows. Compare hierarchy, spacing, density, palette, rhythm, and visual tone. Do not copy logos, wording, characters, or protected creative content from it. Explain transferable principles and adapt them to the user artwork.':'',content=[{type:'text',text:dpPrompt()+referenceNote},{type:'image_url',image_url:{url:dpImageDataUrl}}],system='You are DesignPilot, a practical senior graphic-design art director. Analyze the rendered artwork and the supplied Illustrator object map. Return only valid JSON matching the requested design-plan structure. Never invent object IDs.',attempts=[],seen={};if(dpReferenceDataUrl)content.push({type:'image_url',image_url:{url:dpReferenceDataUrl}});
    function baseFor(m){var b={model:m,messages:[{role:'system',content:system},{role:'user',content:content}]};if(String(m).indexOf('openai/')===0)b.max_completion_tokens=4200;else b.max_tokens=4200;return b}
    function addAttempt(m,label,structured){if(!m)return;var k=m+'|'+(structured?'s':'c');if(seen[k])return;seen[k]=1;var b=baseFor(m);b.provider={allow_fallbacks:true,require_parameters:!!structured};if(structured)b.response_format=designPilotResponseFormat();attempts.push({body:b,label:label})}
    addAttempt(model,'selected model · structured',true);
    addAttempt(model,'selected model · compatibility',false);
    addAttempt('google/gemini-3.8-flash','Gemini 3.8 Flash fallback · structured',true);
    addAttempt('openai/gpt-5.4','GPT-5.4 fallback · structured',true);
    status('DesignPilot is analyzing the artboard…');dpBusy=true;$('runAIBtn').disabled=true;
    function finishBusy(){dpBusy=false;$('runAIBtn').disabled=false}
    function attempt(index,lastDetail){
      var spec=attempts[index];
      if(!spec){finishBusy();status(lastDetail||'OpenRouter could not complete the DesignPilot request.','error');return}
      var validation=validateOpenRouterBody(spec.body);
      if(!validation.ok){finishBusy();status(validation.message,'error');return}
      openRouterRequest(key,spec.body,function(netErr,httpStatus,responseText,transport){
        if(netErr){if(index+1<attempts.length){status(spec.label+' could not connect; trying '+attempts[index+1].label+'…');attempt(index+1,netErr.message);return}finishBusy();status('Could not reach OpenRouter from Illustrator. '+netErr.message,'error');return}
        var data=null;
        try{data=JSON.parse(responseText||'{}')}catch(e){if(index+1<attempts.length){status(spec.label+' returned unreadable data; trying '+attempts[index+1].label+'…');attempt(index+1,'OpenRouter returned an unreadable response.');return}finishBusy();status('OpenRouter returned an unreadable response.','error');return}
        if(httpStatus<200||httpStatus>=300){var detail=openRouterErrorText(data,httpStatus);if(index+1<attempts.length&&shouldRetryProvider(httpStatus,data)){status(spec.label+' was rejected; trying '+attempts[index+1].label+'…');attempt(index+1,detail);return}finishBusy();status(detail,'error');return}
        var completion=extractCompletion(data),out=completion.text;
        if(!out){var emptyDetail=emptyCompletionDetail(completion,spec);if(index+1<attempts.length){status(emptyDetail+'; trying '+attempts[index+1].label+'…');attempt(index+1,emptyDetail);return}finishBusy();status(emptyDetail+'.','error');return}
        try{dpResult=normalizeDPResult(parseDPJson(out));renderDPResult();finishBusy();var routed=completion.model&&completion.model!==spec.body.model?' · '+completion.model:'';status('DesignPilot analysis ready · '+transport+' · '+spec.label+routed+'. Review before applying.','success')}catch(e2){var invalid='Invalid design-plan JSON'+(completion.model?' · '+completion.model:'')+(completion.finishReason?' · finish '+completion.finishReason:'');if(index+1<attempts.length){status(invalid+'; trying '+attempts[index+1].label+'…');attempt(index+1,invalid);return}finishBusy();status('The AI returned text, but the design plan could not be validated. '+invalid,'error')}
      },validation.serialized)
    }
    attempt(0,'')
  }
  refreshAIContext(function(ok){if(ok)execute()},true)
}
$('runAIBtn').addEventListener('click',runAI);
function field(v){return encodeURIComponent(v==null?'':String(v))}
function serializeOps(ops){var lines=[];for(var i=0;i<ops.length;i++){var o=ops[i],a=[o.objectId,o.type];if(o.type==='move')a.push(o.dx,o.dy);else if(o.type==='scale')a.push(o.percent);else if(o.type==='type')a.push(o.size,o.leading,o.tracking);else if(o.type==='fill')a.push(o.hex);else if(o.type==='opacity')a.push(o.value);else if(o.type==='text')a.push(o.contents);for(var j=0;j<a.length;j++)a[j]=field(a[j]);lines.push(a.join('\t'))}return lines.join('\n')}
function selectedPlan(plan,boxes){var out={name:plan.name,operations:[]},ops=plan.operations||[];Array.prototype.forEach.call(boxes,function(b){var i=Number(b.getAttribute('data-op-index'));if(b.checked&&ops[i])out.operations.push(ops[i])});return out}
function applyDPPlan(plan,asVariant,name){
  if(!plan||!plan.operations||!plan.operations.length){status('Select at least one DesignPilot change first.','error');return}
  var payload=serializeOps(plan.operations);status(asVariant?'Building selected DesignPilot variant…':'Applying selected DesignPilot changes…');
  callHost('JT_DP_applyPlan',[payload,!!asVariant,String(name||plan.name||'DesignPilot')],function(r){
    status(r.message,r.success?'success':'error');
    if(r.success){if(!asVariant){dpHistoryCount=Number(r.historyCount)||0;updateHistoryUI()}refreshState(true);if(window.JTRoadmap&&window.JTRoadmap.afterDocumentChange)window.JTRoadmap.afterDocumentChange();captureComparisonAfter(function(ok){if(ok)status(r.message+' Compare the result above.', 'success')})}
  })
}
$('dpOperations').addEventListener('change',function(e){if(e.target.classList.contains('dp-op-checkbox'))updateOperationSelection()});
$('dpSelectAll').addEventListener('click',function(){Array.prototype.forEach.call(qa('#dpOperations .dp-op-checkbox'),function(b){b.checked=true});updateOperationSelection()});
$('dpSelectNone').addEventListener('click',function(){Array.prototype.forEach.call(qa('#dpOperations .dp-op-checkbox'),function(b){b.checked=false});updateOperationSelection()});
$('applyDPBtn').addEventListener('click',function(){if(dpResult)applyDPPlan(selectedPlan(dpResult.improvementPlan,qa('#dpOperations .dp-op-checkbox')),false,dpResult.improvementPlan.name)});
$('variantDPBtn').addEventListener('click',function(){if(dpResult)applyDPPlan(selectedPlan(dpResult.improvementPlan,qa('#dpOperations .dp-op-checkbox')),true,dpResult.improvementPlan.name||'Refined')});
$('dpVariations').addEventListener('click',function(e){var b=e.target.closest('.dp-build-variant');if(!b||!dpResult)return;var i=Number(b.getAttribute('data-variant-index')),v=dpResult.variations[i],card=b.closest('[data-variant-card]');if(v&&card)applyDPPlan(selectedPlan(v,card.querySelectorAll('.dp-variant-checkbox')),true,v.name)});
function restoreDesignPilot(which){status(which==='JT_DP_restoreOriginal'?'Restoring original artwork…':'Restoring previous DesignPilot state…');callHost(which,[],function(r){status(r.message,r.success?'success':'error');if(!r.success)return;dpHistoryCount=Number(r.historyCount)||0;updateHistoryUI();refreshState(true);if(window.JTRoadmap&&window.JTRoadmap.afterDocumentChange)window.JTRoadmap.afterDocumentChange();captureComparisonAfter(function(ok){if(ok)status(r.message+' Compare the result above.','success')})})}
$('dpRestoreLast').addEventListener('click',function(){restoreDesignPilot('JT_DP_restoreLast')});
$('dpRestoreOriginal').addEventListener('click',function(){restoreDesignPilot('JT_DP_restoreOriginal')});

window.JTDPBridge={
  callHost:callHost,status:status,readPreviewBase64:readPreviewBase64,serializeOps:serializeOps,selectedPlan:selectedPlan,opLabel:opLabel,htmlEsc:htmlEsc,
  getResult:function(){return dpResult},getContext:function(){return dpContext},refreshContext:refreshAIContext,captureAfter:captureComparisonAfter,
  getHistoryCount:function(){return dpHistoryCount},setHistoryCount:function(n){dpHistoryCount=Math.max(0,Number(n)||0);updateHistoryUI()},
  setReference:function(dataUrl,name){dpReferenceDataUrl=String(dataUrl||'');dpReferenceName=String(name||'')},getReference:function(){return{name:dpReferenceName,dataUrl:dpReferenceDataUrl}},
  setReviewIndex:function(index){lastReviewIndex=Number(index);updateReviewButtons()}
};

// Init
var remembered=localStorage.getItem('jaiafa_openrouter_key');if(remembered){$('openRouterKey').value=remembered;$('rememberAIKey').checked=true}
renderScale();generatePalette();updateNamePreview();updateReviewComparison();updateReviewButtons();refreshState(false);window.setInterval(function(){refreshState(true)},3000);
})();
