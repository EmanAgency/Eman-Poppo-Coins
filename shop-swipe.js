'use strict';
// Keep checkout fields mounted when changing app; use native horizontal touch scrolling.
function initShopSwipe(doc = document, win = window) {
 const rail=doc.getElementById('coin-panels');
 const tabs=Array.from(doc.querySelectorAll('[data-shop]'));
 if(!rail || tabs.length!==3)return;
 const panels=Array.from(rail.children);
 const names=['poppo','glow','eman'];
 let current=0, pending=false;
 const reduced=()=>win.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
 function fit(){const h=panels[current].getBoundingClientRect().height;if(h>0)rail.style.height=`${Math.ceil(h)}px`;}
 function activate(index,focus=false){
  current=Math.max(0,Math.min(2,index));
  tabs.forEach((tab,i)=>{tab.setAttribute('aria-selected',String(i===current));tab.tabIndex=i===current?0:-1;});
  panels.forEach((panel,i)=>{panel.inert=i!==current;panel.setAttribute('aria-hidden',String(i!==current));});
  fit();if(focus)tabs[current].focus();
 }
 function choose(index,focus=false){
  activate(index,focus);
  rail.scrollTo({left:current*rail.clientWidth,behavior:reduced()?'auto':'smooth'});
 }
 tabs.forEach((tab,i)=>{
  tab.addEventListener('click',()=>choose(i));
  tab.addEventListener('keydown',event=>{
   let next;
   if(event.key==='ArrowRight')next=(current+1)%3;
   else if(event.key==='ArrowLeft')next=(current+2)%3;
   else if(event.key==='Home')next=0;
   else if(event.key==='End')next=2;
   else return;
   event.preventDefault();choose(next,true);
  });
 });
 rail.addEventListener('scroll',()=>{
  if(pending)return;pending=true;
  win.requestAnimationFrame(()=>{
   pending=false;
   if(rail.clientWidth>0)activate(Math.round(rail.scrollLeft/rail.clientWidth));
  });
 },{passive:true});
 if(win.ResizeObserver){const observer=new win.ResizeObserver(fit);panels.forEach(panel=>observer.observe(panel));}
 win.addEventListener('resize',()=>{rail.scrollTo({left:current*rail.clientWidth,behavior:'auto'});fit();});
 function readHash(){const i=names.findIndex(name=>win.location.hash===`#${name}-shop`);if(i>=0){activate(i);rail.scrollTo({left:i*rail.clientWidth,behavior:'auto'});}}
 win.addEventListener('hashchange',readHash);
 activate(0);readHash();
 return {choose,get selected(){return current;}};
}
if(typeof module!=='undefined')module.exports={initShopSwipe};
if(typeof document!=='undefined')initShopSwipe();
