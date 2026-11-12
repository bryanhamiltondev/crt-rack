/* crt-rack demo v3 - production ticker format */
(function(){
if(window.__BHRACK)return;window.__BHRACK=1;
var d=document;
function el(t,c,h){var e=d.createElement(t);if(c)e.className=c;if(h!=null)e.innerHTML=h;return e;}
function toast(m){var t=el('div','bh-toast',m);d.body.appendChild(t);setTimeout(function(){t.parentNode.removeChild(t);},2200);}

/* ---- status rail ---- */
var rail=el('div','bh-rail');
var pwr=el('button','bh-pwr','\u23FB');pwr.title='power cycle';
var aud=el('button','bh-aud','\uD83D\uDD0A');aud.title='CRT audio (synthesized - no audio files)';
var vfd=el('span','bh-vfd','--:--:--');
var tick=el('span','bh-tick');var tickIn=el('span','bh-tick-in','LIVE DATA...');tick.appendChild(tickIn);
var pos=el('span','bh-pos','POS 0%');
var hud=el('span','bh-hud','LCP -- \u00b7 CLS --');
rail.appendChild(pwr);rail.appendChild(aud);rail.appendChild(vfd);rail.appendChild(tick);rail.appendChild(pos);rail.appendChild(hud);
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

/* ---- ticker: same as production (bhtick5 + ticksp1) ----
   label + DJ Mag top 5 from thedjcalendar.com/djs.json, trailing nbsp per item.
   In production this slot is fed live by /ticker.php (40-line PHP proxy, 30-min cache);
   the static Pages demo ships the same five items inline. */
tickIn.textContent='The DJ Calendar top 5 DJ\u2019s worldwide'
 +'\u00a0\u00a0\u00b7\u00a0\u00a0 #1 DAVID GUETTA\u00a0'
 +'\u00a0\u00a0\u00b7\u00a0\u00a0 #2 MARTIN GARRIX\u00a0'
 +'\u00a0\u00a0\u00b7\u00a0\u00a0 #3 ALOK\u00a0'
 +'\u00a0\u00a0\u00b7\u00a0\u00a0 #4 DIMITRI VEGAS AND LIKE MIKE\u00a0'
 +'\u00a0\u00a0\u00b7\u00a0\u00a0 #5 ARMIN VAN BUUREN\u00a0';
tickIn.classList.add('run');

/* ---- audio engine: fully synthesized CRT, zero asset files ----
   60Hz mains hum + 120Hz harmonic + faint 7.9kHz flyback whine, power sweep, degauss thunk.
   Browsers require a gesture before sound: engine arms on first click/keypress. */
var audOn=localStorage.getItem('bh-aud')!=='off';
var AC=null,master=null,hum=null;
function ac(){
 if(!AC){AC=new(window.AudioContext||window.webkitAudioContext)();master=AC.createGain();master.gain.value=audOn?1:0;master.connect(AC.destination);}
 if(AC.state==='suspended')AC.resume();
 return AC;
}
function env(g,t0,a,peak,dur){g.gain.setValueAtTime(0.0001,t0);g.gain.linearRampToValueAtTime(peak,t0+a);g.gain.exponentialRampToValueAtTime(0.0001,t0+dur);}
function thunk(peak){try{var c=ac(),t=c.currentTime,o=c.createOscillator(),g=c.createGain();o.type='sine';o.frequency.setValueAtTime(110,t);o.frequency.exponentialRampToValueAtTime(38,t+.22);env(g,t,.004,peak,.3);o.connect(g);g.connect(master);o.start(t);o.stop(t+.32);}catch(e){}}
function sweep(f0,f1,dur,peak,type){try{var c=ac(),t=c.currentTime,o=c.createOscillator(),g=c.createGain();o.type=type||'sawtooth';o.frequency.setValueAtTime(f0,t);o.frequency.exponentialRampToValueAtTime(f1,t+dur);env(g,t,.006,peak,dur+.05);o.connect(g);g.connect(master);o.start(t);o.stop(t+dur+.1);}catch(e){}}
function keytick(){if(!AC)return;try{var c=ac(),t=c.currentTime,o=c.createOscillator(),g=c.createGain();o.type='square';o.frequency.value=1900;env(g,t,.001,.016,.02);o.connect(g);g.connect(master);o.start(t);o.stop(t+.03);}catch(e){}}
function humStart(){
 if(hum||!audOn)return;
 try{
  var c=ac(),g=c.createGain();g.gain.value=0;g.connect(master);
  var spec=[[60,.05],[120,.02],[7860,.0025]],os=[];
  spec.forEach(function(s){var o=c.createOscillator();o.type='sine';o.frequency.value=s[0];var og=c.createGain();og.gain.value=s[1];o.connect(og);og.connect(g);o.start();os.push(o);});
  g.gain.linearRampToValueAtTime(.5,c.currentTime+1.4);
  hum={g:g,os:os};
 }catch(e){}
}
function humStop(){
 if(!hum)return;var n=hum;hum=null;
 try{n.g.gain.linearRampToValueAtTime(0,ac().currentTime+.15);}catch(e){}
 setTimeout(function(){n.os.forEach(function(o){try{o.stop();}catch(e){}});},260);
}
function paintAud(){aud.textContent=audOn?'\uD83D\uDD0A':'\uD83D\uDD07';}
function arm(){if(audOn)humStart();removeEventListener('pointerdown',arm);removeEventListener('keydown',arm);}
addEventListener('pointerdown',arm);addEventListener('keydown',arm);
paintAud();
aud.addEventListener('click',function(){
 audOn=!audOn;localStorage.setItem('bh-aud',audOn?'on':'off');
 if(AC){master.gain.linearRampToValueAtTime(audOn?1:0,ac().currentTime+.1);}
 if(audOn){humStart();toast('CRT audio on');}else{humStop();toast('CRT audio off');}
 paintAud();
});

/* power cycle */
var theme=localStorage.getItem('bh-theme')||'dark';
function apply(){if(theme!=='dark'){d.documentElement.setAttribute('data-theme',theme);}else{d.documentElement.removeAttribute('data-theme');}}
apply();
pwr.addEventListener('click',function(){
 if(d.documentElement.classList.contains('bh-shut'))return;
 if(audOn){humStop();sweep(320,42,.38,.2,'sawtooth');}
 var h=d.documentElement;h.classList.add('bh-shut');
 setTimeout(function(){
  if(audOn)thunk(.3);
  window.scrollTo(0,0);
  theme=(theme==='dark')?'light':'dark';localStorage.setItem('bh-theme',theme);apply();
  h.classList.remove('bh-shut');h.classList.add('bh-boot');
  if(audOn){sweep(38,150,.45,.16,'sine');setTimeout(humStart,420);}
  setTimeout(function(){h.classList.remove('bh-boot');},650);
 },500);
});

/* ---- Cmd+K palette (demo index) ---- */
var PAGES=[
 ['GitHub repo','https://github.com/bryanhamiltondev/crt-rack'],
 ['The DJ Calendar (ticker source)','https://thedjcalendar.com/miles'],
 ['bryanhamilton.info (production rack)','https://bryanhamilton.info']
];
var EGGS={
 'whoami':function(){toast('bryanhamiltondev \u00b7 zero dependencies');},
 'sudo make me a sandwich':function(){toast('okay.');},
 'ls':function(){toast(PAGES.length+' pages indexed \u00b7 try typing to jump');},
 'degauss':function(){
  d.body.classList.add('bh-degauss');
  if(audOn){humStop();thunk(.35);sweep(90,30,.5,.25,'sine');setTimeout(humStart,750);}
  setTimeout(function(){d.body.classList.remove('bh-degauss');},950);
  toast('DEGAUSS - colors will settle momentarily');
 },
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
 if(e.key.length===1)keytick();
});
function paint(){var li=ul.querySelectorAll('li');for(var i=0;i<li.length;i++)li[i].className=i===sel?'sel':'';}
inp.addEventListener('input',function(){render(inp.value.trim());});
ov.addEventListener('click',function(e){if(e.target===ov)closeK();});
})();
