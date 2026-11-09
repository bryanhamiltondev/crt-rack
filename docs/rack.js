(function(){
if(window.__BHRACK)return;window.__BHRACK=1;
var d=document;
function el(t,c,h){var e=d.createElement(t);if(c)e.className=c;if(h!=null)e.innerHTML=h;return e;}
function toast(m){var t=el('div','bh-toast',m);d.body.appendChild(t);setTimeout(function(){t.parentNode.removeChild(t);},2200);}

/* ---- status rail ---- */
var rail=el('div','bh-rail');
var pwr=el('button','bh-pwr','\u23FB');pwr.title='power cycle';
var vfd=el('span','bh-vfd','--:--:--');
var tick=el('span','bh-tick');var tickIn=el('span','bh-tick-in','LIVE DATA...');tick.appendChild(tickIn);
var pos=el('span','bh-pos','POS 0%');
var hud=el('span','bh-hud','LCP -- \u00b7 CLS --');
rail.appendChild(pwr);rail.appendChild(vfd);rail.appendChild(tick);rail.appendChild(pos);rail.appendChild(hud);
d.body.appendChild(rail);d.body.classList.add('bh-rail-on');

/* VFD clock */
function p2(n){return(n<10?'0':'')+n;}
setInterval(function(){var n=new Date();vfd.textContent=p2(n.getHours())+':'+p2(n.getMinutes())+':'+p2(n.getSeconds());},1000);

/* scroll readout (fader removed bhfade1) */
function onScroll(){
 var max=d.documentElement.scrollHeight-innerHeight;
 var pct=max>0?Math.min(1,Math.max(0,scrollY/max)):0;
 var db=(20*Math.log10(Math.max(pct,0.001))).toFixed(1);
 pos.textContent='POS '+Math.round(pct*100)+'% \u00b7 '+db+'dB';
}
addEventListener('scroll',onScroll,{passive:true});onScroll();

/* perf HUD */
try{
 var lcp=0,cls=0;
 new PerformanceObserver(function(l){var e=l.getEntries();lcp=e[e.length-1].renderTime||e[e.length-1].startTime;}).observe({type:'largest-contentful-paint',buffered:true});
 new PerformanceObserver(function(l){for(var e of l.getEntries()){if(!e.hadRecentInput)cls+=e.value;}}).observe({type:'layout-shift',buffered:true});
 addEventListener('load',function(){setTimeout(function(){
  hud.textContent='LCP '+(lcp?(lcp/1000).toFixed(2)+'s':'n/a')+' \u00b7 CLS '+cls.toFixed(3);
 },800);});
}catch(e){hud.textContent='LCP n/a';}

/* live ticker via server proxy - docs demo has no PHP, so it degrades to the static line */
fetch('/ticker.php',{cache:'no-store'}).then(function(r){return r.json();}).then(function(j){
 tickIn.textContent=j.items.join('    \u00b7    ');
 tickIn.classList.add('run');
}).catch(function(){tickIn.textContent='LIVE LEADERBOARD \u2192 thedjcalendar.com/miles';tickIn.classList.add('run');});

/* power cycle */
var theme=localStorage.getItem('bh-theme')||'dark';
function apply(){if(theme!=='dark'){d.documentElement.setAttribute('data-theme',theme);}else{d.documentElement.removeAttribute('data-theme');}}
apply();
pwr.addEventListener('click',function(){
 if(d.documentElement.classList.contains('bh-shut'))return;
 var h=d.documentElement;h.classList.add('bh-shut');
 setTimeout(function(){
  window.scrollTo(0,0);
  theme=(theme==='dark')?'light':'dark';localStorage.setItem('bh-theme',theme);apply();
  h.classList.remove('bh-shut');h.classList.add('bh-boot');
  setTimeout(function(){h.classList.remove('bh-boot');},650);
 },500);
});

/* ---- Cmd+K palette (demo index) ---- */
var PAGES=[
 ['GitHub repo','https://github.com/bryanhamiltondev/crt-rack'],
 ['bryanhamilton.info (production)','https://bryanhamilton.info'],
 ['Live miles board','https://thedjcalendar.com/miles']
];
var EGGS={
 'whoami':function(){toast('bryanhamiltondev \u00b7 zero dependencies');},
 'sudo make me a sandwich':function(){toast('okay.');},
 'ls':function(){toast(PAGES.length+' pages indexed \u00b7 try typing to jump');},
 'rm -rf /':function(){d.body.classList.add('bh-shake');setTimeout(function(){d.body.classList.remove('bh-shake');},520);toast('nice try.');}
};
var ov=el('div','bh-k');var box=el('div','bh-k-box');
var inp=el('input','bh-k-in');inp.placeholder='guest@rack:~$ ';inp.autocomplete='off';
var ul=el('ul','bh-k-list');
box.appendChild(inp);box.appendChild(ul);ov.appendChild(box);d.body.appendChild(ov);
var sel=0,cur=[];
function render(q){
 ul.innerHTML='';cur=[];q=q.toLowerCase();
 PAGES.forEach(function(p){if(!q||p[0].toLowerCase().indexOf(q)>-1||p[1].toLowerCase().indexOf(q)>-1)cur.push({t:p[0],s:p[1],go:function(){location.href=p[1];}});});
 Object.keys(EGGS).forEach(function(k){if(q&&k.indexOf(q)>-1)cur.push({t:k,s:'easter egg',go:EGGS[k]});});
 cur=cur.slice(0,12);sel=0;
 cur.forEach(function(it,i){
  var li=el('li',i===sel?'sel':'','<span>'+it.t+'</span><small>'+it.s+'</small>');
  li.addEventListener('click',it.go);ul.appendChild(li);
 });
 if(!cur.length)ul.appendChild(el('li','','<span>no signal</span><small>404</small>'));
}
function openK(){ov.classList.add('open');inp.value='';render('');setTimeout(function(){inp.focus();},30);}
function closeK(){ov.classList.remove('open');}
addEventListener('keydown',function(e){
 if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==='k'){e.preventDefault();ov.classList.contains('open')?closeK():openK();return;}
 if(!ov.classList.contains('open'))return;
 if(e.key==='Escape')closeK();
 if(e.key==='ArrowDown'){e.preventDefault();sel=Math.min(sel+1,cur.length-1);paint();}
 if(e.key==='ArrowUp'){e.preventDefault();sel=Math.max(sel-1,0);paint();}
 if(e.key==='Enter'&&cur[sel])cur[sel].go();
});
function paint(){var li=ul.querySelectorAll('li');for(var i=0;i<li.length;i++)li[i].className=i===sel?'sel':'';}
inp.addEventListener('input',function(){render(inp.value.trim());});
ov.addEventListener('click',function(e){if(e.target===ov)closeK();});
})();