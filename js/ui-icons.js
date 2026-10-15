(function(){
'use strict';
// Original vectors: a consistent 24px grid and rounded 1.75px strokes.
var paths={
brand:'M6 18V6h12 M10 18V10h8 M14 18v-4h4',
grid:'M4 4h16v16H4Z M4 12h16 M12 4v16',
type:'M5 5h14 M12 5v14 M8 19h8 M5 5v3 M19 5v3',
color:'M12 3a9 9 0 1 0 0 18h1a2 2 0 0 0 1.5-3.3 1.5 1.5 0 0 1 1.1-2.5H17a4 4 0 0 0 4-4c0-4.4-4-8.2-9-8.2Z M7.5 10h.01 M10 6.5h.01 M15 6.5h.01 M18 10h.01',
social:'M5 3h14v18H5Z M8 7h8 M8 11h8 M8 15h4',
mockup:'M12 3 21 8v9l-9 5-9-5V8Z M3 8l9 5 9-5 M12 13v9 M7.5 5.5l9 5',
export:'M12 3v12 M8 11l4 4 4-4 M4 15v6h16v-6',
review:'M4 4h16v12H9l-5 4Z M8 8h8 M8 12h5',
qa:'M12 3 20 6v6c0 5-8 9-8 9s-8-4-8-9V6Z M8 12l3 3 5-6',
batch:'M8 3h12v14 M4 7h12v14H4Z M8 11h4 M8 15h4',
ai:'M12 3l2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5Z',
plus:'M12 5v14 M5 12h14',
resize:'M9 3H3v6 M3 3l7 7 M15 21h6v-6 M21 21l-7-7',
package:'M3 7l9-4 9 4v11l-9 4-9-4Z M3 7l9 4 9-4 M12 11v11 M7.5 5l9 4',
check:'M5 12l4 4L19 6',
save:'M4 3h13l3 3v15H4Z M8 3v6h8V3 M8 21v-7h8v7',
refresh:'M20 7V3l-3 3 M20 7h-4 M4 17v4l3-3 M4 17h4 M5 8a8 8 0 0 1 13-2 M19 16a8 8 0 0 1-13 2',
phone:'M7 2h10v20H7Z M10 5h4 M11 19h2',
poster:'M5 3h14v18H5Z M8 15l3-4 2 2 3-5 M8 7h3',
billboard:'M3 4h18v12H3Z M7 16v5 M17 16v5 M7 8h10 M7 12h6',
laptop:'M5 4h14v12H5Z M3 16h18l1 4H2Z M10 18h4',
card:'M3 5h18v14H3Z M6 9h4v4H6Z M13 9h5 M13 13h4'
};
function icon(name){var svg=document.createElementNS('http://www.w3.org/2000/svg','svg'),path=document.createElementNS('http://www.w3.org/2000/svg','path');svg.setAttribute('viewBox','0 0 24 24');svg.setAttribute('class','jt-icon');svg.setAttribute('aria-hidden','true');svg.setAttribute('focusable','false');path.setAttribute('d',paths[name]||paths.plus);svg.appendChild(path);return svg}
function fill(el,name){if(!el)return;el.textContent='';el.appendChild(icon(name))}
paths.data=paths.batch;
var tabs=document.querySelectorAll('.module-tab'),i,el;
for(i=0;i<tabs.length;i++)fill(tabs[i].querySelector('.tab-icon'),tabs[i].getAttribute('data-module'));
var mockups=document.querySelectorAll('.mockup-card');
for(i=0;i<mockups.length;i++)fill(mockups[i].querySelector('.mock-icon'),mockups[i].getAttribute('data-kind'));
var actions={createGuidesBtn:'grid',applyTypeBtn:'type',addSwatchesBtn:'color',createSocialBtn:'plus',campaignResizeBtn:'resize',createMockupBtn:'mockup',exportBtn:'export',buildHandoffBtn:'package',buildReviewBtn:'review',buildFeedbackSummaryBtn:'review',runQABtn:'qa',applyQAFixesBtn:'check',saveTemplateBtn:'save',generateBatchBtn:'batch',runAIBtn:'ai',applyDPBtn:'check'};
function decorate(button,name){if(button.querySelector('.jt-icon'))return;button.classList.add('has-ui-icon');button.insertBefore(icon(name),button.firstChild)}
function watch(button,name){decorate(button,name);if(window.MutationObserver)new MutationObserver(function(){decorate(button,name)}).observe(button,{childList:true})}
// Keep icons visible when a loading state replaces the button label.
for(var id in actions)if(Object.prototype.hasOwnProperty.call(actions,id)){el=document.getElementById(id);if(el){if(id==='createGuidesBtn'&&el.firstElementChild)el.removeChild(el.firstElementChild);watch(el,actions[id])}}
el=document.getElementById('refreshTypeBtn');if(el){fill(el,'refresh');el.setAttribute('aria-label','Refresh text selection');el.setAttribute('title','Refresh text selection')}
var header=document.querySelector('.header'),mark=document.createElement('span');if(header){mark.className='brand-mark';mark.appendChild(icon('brand'));header.insertBefore(mark,header.firstChild)}
})();
