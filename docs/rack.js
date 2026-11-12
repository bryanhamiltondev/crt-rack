/* crt-rack demo v4 - exact port of the bryanhamilton.info rack:
   rail, EST VFD, scroll dB, perf HUD, ticker.php-format ticker (payload inlined,
   Pages can't run PHP), hover dock w/ photo + next show, bh-eq.js EQ preview player,
   one-shot hover hint, production power cycle, Cmd+K palette. */

/* bh-console1 - console secret for developers only */
(function(){
  try{
    if(window.__bhconsole){return;}
    window.__bhconsole=1;
    console.log('%cSTAY FROSTY.','color:#7ef9ff;font:900 30px monospace;text-shadow:0 0 14px #00e5ff;');
    console.log('%cYou opened the console. So you are either a developer... or the FBI.\nEither way: hi.','color:#8fa3b8;font:13px monospace');
    console.log('%cThis demo is hand-built vanilla JavaScript. No frameworks. No builders.\nBugs found in this console earn you a frosty nod of respect.','color:#8fa3b8;font:13px monospace');
    console.log('%cPsst... try: \u2191 \u2193 \u2193 \u2191 \u2190 \u2192 \u2190 \u2192 B A','color:#ff2b2b;font:900 14px monospace');
    window.subzero=function(){
      console.log('%cABSOLUTE ZERO.','color:#7ef9ff;font:900 26px monospace;text-shadow:0 0 14px #00e5ff;');
      return 'STAY FROSTY';
    };
    var caught=false;
    window.addEventListener('resize',function(){
      if(caught){return;}
      var w=window.outerWidth-window.innerWidth>160;
      var h=window.outerHeight-window.innerHeight>160;
      if(w||h){caught=true;console.log('%cCaught you peeking.','color:#ff2b2b;font:900 16px monospace');}
    });
  }catch(e){}
})();

(function(){
if(window.__BHRACK)return;window.__BHRACK=1;
var d=document;
function el(t,c,h){var e=d.createElement(t);if(c)e.className=c;if(h!=null)e.innerHTML=h;return e;}
function toast(m){var t=el('div','bh-toast',m);d.body.appendChild(t);setTimeout(function(){t.parentNode.removeChild(t);},2200);}

/* ---- one-shot hover hint (bh-eqhint1) ---- */
if(window.__BHHINT===undefined){
  window.__BHHINT=1;
  var bhH=document.createElement("div");bhH.id="bh-hinthov";
  bhH.style.cssText="position:fixed;z-index:2147483000;display:flex;flex-direction:column;align-items:center;gap:2px;pointer-events:none;font:700 13px/1.25 system-ui,sans-serif;letter-spacing:.04em;color:#7ee7ff;text-shadow:0 0 14px rgba(0,229,255,.55);text-align:center;opacity:0;transition:opacity .5s;max-width:130px";
  bhH.innerHTML="<span>Hover over an artist</span><span style=\"font-size:30px;filter:drop-shadow(0 0 8px rgba(0,229,255,.6))\">\uD83D\uDC47</span>";
  var bhS=document.createElement("style");
  bhS.textContent="#bh-hinthov{animation:bhhintbob 1.3s ease-in-out infinite}@keyframes bhhintbob{0%,100%{margin-top:0}50%{margin-top:8px}}";
  document.head.appendChild(bhS);document.body.appendChild(bhH);
  function bhHintPos(){var t=document.querySelector(".bh-rail .bh-tick");var r=t?t.getBoundingClientRect():null;var x=r?Math.max(16,Math.round(r.left)):24;var y=r?Math.max(10,Math.round(r.top-bhH.offsetHeight-6)):(window.innerHeight-150);bhH.style.left=x+"px";bhH.style.top=y+"px";bhH.style.opacity="1";}
  window.addEventListener("resize",bhHintPos);
  var bhHintGone=false;
  (function bhWatch(){
    var near=false;var els=document.querySelectorAll(".bh-rail .bh-tk");
    for(var i=0;i<els.length;i++){var tx=(els[i].textContent||"").replace(/\s+/g," ");if(tx.indexOf("#1 ")>-1){var r=els[i].getBoundingClientRect();if(r.width>0&&r.left<=360&&r.left>=-50){near=true;break;}}}
    if(bhHintGone){return;}
    if(near){bhHintPos();if(!bhH._bhShown){bhH._bhShown=1;setTimeout(function(){bhHintGone=true;if(bhH.style.opacity==="1")bhH.style.opacity="0";setTimeout(function(){if(bhH.parentNode)bhH.remove();},600);},6000);}}else if(bhH.style.opacity==="1"){bhH.style.opacity="0";}
    requestAnimationFrame(bhWatch);
  })();
  function bhHintKill(){if(bhHintGone)return;bhHintGone=true;bhH.style.opacity="0";setTimeout(function(){if(bhH.parentNode)bhH.remove();},600);}
  var bhT=document.querySelector(".bh-rail .bh-tick");if(bhT)bhT.addEventListener("mouseenter",bhHintKill);
}

/* ---- status rail ---- */
var rail=el('div','bh-rail');
var pwr=el('button','bh-pwr','\u23FB');pwr.title='power cycle';
var vfd=el('span','bh-vfd','--:--:--');
var tick=el('span','bh-tick');var tickIn=el('span','bh-tick-in','LIVE DATA...');tick.appendChild(tickIn);
var pos=el('span','bh-pos','POS 0%');
var hud=el('span','bh-hud','LCP -- \u00b7 CLS --');
rail.appendChild(pwr);rail.appendChild(vfd);rail.appendChild(tick);rail.appendChild(pos);rail.appendChild(hud);
d.body.appendChild(rail);d.body.classList.add('bh-rail-on');

/* VFD clock - EST like production */
function p2(n){return(n<10?'0':'')+n;}
setInterval(function(){var n=new Date();var e=new Date(n.getTime()+(n.getTimezoneOffset()-300)*60000);var h=e.getHours();vfd.textContent=p2(h%12||12)+':'+p2(e.getMinutes())+':'+p2(e.getSeconds())+' '+(h<12?'AM':'PM')+' EST';},1000);

/* scroll readout */
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

/* ---- hover dock (photo + next show + link) ---- */
var dock=el('div','bh-dock');var dim=el('img','bh-dock-img');dim.alt='DJ photo';
var dbox=el('div','bh-dock-box');var dl1=el('div','bh-dock-date');var dl2=el('a','bh-dock-link','Click here to see more on The DJ Calendar');
dl2.target='_blank';dl2.rel='noopener';
dbox.appendChild(dl1);dbox.appendChild(dl2);dock.appendChild(dim);dock.appendChild(dbox);d.body.appendChild(dock);
function tkOpen(t){
 tickIn.style.animationPlayState='paused';
 dock.classList.add('open');
 dim.src=t.getAttribute('data-img')||'';
 dl1.textContent=t.getAttribute('data-date')?'Next show: '+t.getAttribute('data-date'):'Tour dates on thedjcalendar.com';
 dl2.href=t.getAttribute('data-url')||'https://thedjcalendar.com';
}
function tkClose(){tickIn.style.animationPlayState='';dock.classList.remove('open');}
tick.addEventListener('mouseover',function(e){var t=e.target&&e.target.closest?e.target.closest('.bh-tk'):null;if(t)tkOpen(t);});
var closeTimer=null;
function tkCloseSoon(){closeTimer=setTimeout(tkClose,150);}
function tkCancel(){if(closeTimer){clearTimeout(closeTimer);closeTimer=null;}}
tick.addEventListener('mouseleave',tkCloseSoon);
dock.addEventListener('mouseenter',tkCancel);
dock.addEventListener('mouseleave',tkClose);
tick.addEventListener('click',function(e){var t=e.target&&e.target.closest?e.target.closest('.bh-tk'):null;if(t&&t.getAttribute('data-url'))location.href=t.getAttribute('data-url');});

/* ---- ticker: exact ticker.php payload, inlined (GitHub Pages can't run PHP).
     Self-hosting: replace TICKER with fetch('/ticker.php').then(r=>r.json()) ---- */
var TICKER={"items":["The DJ Calendar top 10 DJ's worldwide","#1 DAVID GUETTA","#2 MARTIN GARRIX","#3 ALOK","#4 DIMITRI VEGAS AND LIKE MIKE","#5 ARMIN VAN BUUREN","#6 TIMMY TRUMPET","#7 FISHER","#8 AFROJACK","#9 CHARLOTTE DE WITTE","#10 ANYMA"],"djs":{"1":{"name":"David Guetta","url":"https://thedjcalendar.com/davidguetta","img":"https://thumb.wikimedia.org/wikipedia/commons/thumb/4/4f/2023-11-16_Gala_de_los_Latin_Grammy%2C_22_%28David_Guetta%29.jpg/500px-2023-11-16_Gala_de_los_Latin_Grammy%2C_22_%28David_Guetta%29.jpg","date":"DEC 31"},"2":{"name":"Martin Garrix","url":"https://thedjcalendar.com/martingarrix","img":"https://thumb.wikimedia.org/wikipedia/commons/thumb/0/09/Martin_Garrix_-_Superbloom_Festival_2023_-_DSC2689_%28cropped%29.jpg/500px-Martin_Garrix_-_Superbloom_Festival_2023_-_DSC2689_%28cropped%29.jpg","date":"NOV 20"},"3":{"name":"Alok","url":"https://thedjcalendar.com/alok","img":"https://thumb.wikimedia.org/wikipedia/commons/thumb/f/fd/Alok_-_Lady_Night.png/500px-Alok_-_Lady_Night.png","date":"NOV 13"},"4":{"name":"Dimitri Vegas and Like Mike","url":"https://thedjcalendar.com/dimitrivegasandlikemike","img":"https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c7/20220615_Ushuaia_Tomorrowland_Opening_0004_2048x1365px.jpg/500px-20220615_Ushuaia_Tomorrowland_Opening_0004_2048x1365px.jpg","date":"NOV 27"},"5":{"name":"Armin van Buuren","url":"https://thedjcalendar.com/arminvanbuuren","img":"https://thumb.wikimedia.org/wikipedia/commons/thumb/9/90/Armin_van_Buuren%2C_November_2025_%28cropped%29.jpg/500px-Armin_van_Buuren%2C_November_2025_%28cropped%29.jpg","date":"NOV 14"},"6":{"name":"Timmy Trumpet","url":"https://thedjcalendar.com/timmytrumpet","img":"https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e9/Timmy-Trumpet-WIkipedia.jpg/500px-Timmy-Trumpet-WIkipedia.jpg","date":"NOV 13"},"7":{"name":"FISHER","url":"https://thedjcalendar.com/fisher","img":"https://cdn-images.dzcdn.net/images/artist/0c0cec214fbe671c1c32c7efbc042189/500x500-000000-80-0-0.jpg","date":"NOV 12"},"8":{"name":"Afrojack","url":"https://thedjcalendar.com/afrojack","img":"https://thumb.wikimedia.org/wikipedia/commons/thumb/d/dd/Afrojack_2012.jpg/500px-Afrojack_2012.jpg","date":"NOV 20"},"9":{"name":"Charlotte de Witte","url":"https://thedjcalendar.com/charlottedewitte","img":"https://thumb.wikimedia.org/wikipedia/commons/thumb/5/51/Charlotte_de_witte-1513626416.jpg/500px-Charlotte_de_witte-1513626416.jpg","date":"NOV 28"},"10":{"name":"Anyma","url":"https://thedjcalendar.com/anyma","img":"https://thumb.wikimedia.org/wikipedia/commons/thumb/1/13/Anyma_2025_%28cropped%29.jpg/500px-Anyma_2025_%28cropped%29.jpg","date":"NOV 21"}}};
(function renderTicker(){
 tickIn.innerHTML='';
 TICKER.items.forEach(function(it,i){
  if(i===0){tickIn.appendChild(el('span','bh-tk-lab',it));return;}
  var sp=el('span','bh-tk','\u00b7 '+it+'\u00a0');
  var dj=TICKER.djs&&TICKER.djs[i];
  if(dj){sp.setAttribute('data-img',dj.img||'');sp.setAttribute('data-url',dj.url||'https://thedjcalendar.com');sp.setAttribute('data-date',dj.date||'');}
  tickIn.appendChild(sp);
 });
 tickIn.classList.add('run');
})();

/* ---- power cycle (production: 3.5s hold, theme toggle, no sound) ---- */
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
 },3500);
});

/* ---- Cmd+K palette (production entries, absolute for the demo) ---- */
var B="https://bryanhamilton.info";
var PAGES=[
 ['Home',B+'/'],['Writing',B+'/writing/'],['Playground',B+'/playground.html'],['Now',B+'/now.html'],
 ['Case studies',B+'/case-studies/'],['Contact',B+'/contact.php'],['Changelog',B+'/changelog.html'],
 ['Arcade',B+'/arcade.html'],['GitHub','https://github.com/bryanhamiltondev'],['LinkedIn','https://www.linkedin.com/in/bryanhamiltondev'],
 ['Live miles board','https://thedjcalendar.com/miles'],
 ['Portfolio as Rack Gear',B+'/writing/i-built-my-portfolio-like-a-piece-of-rack-gear-zero-dependencies-all-vanilla-js-347e/'],
 ['Web Audio Analyser Equalizer',B+'/writing/the-equalizer-that-actually-listens-a-web-audio-analyser-deep-dive-b3/']
];
var EGGS={
 'whoami':function(){toast('bryanhamiltondev \u00b7 zero dependencies');},
 'sudo make me a sandwich':function(){toast('okay.');},
 'ls':function(){toast(PAGES.length+' pages indexed \u00b7 try typing to jump');},
 'rm -rf /':function(){d.body.classList.add('bh-shake');setTimeout(function(){d.body.classList.remove('bh-shake');},520);toast('nice try.');},
 'miles':function(){location.href='https://thedjcalendar.com/miles';}
};
var ov=el('div','bh-k');var box=el('div','bh-k-box');
var inp=el('input','bh-k-in');inp.placeholder='bryan@rack:~$ ';inp.autocomplete='off';
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

/* ---- bh-eq1 - DJ Calendar EQ player in the ticker tray (exact port of bh-eq.js v3).
   Hover a DJ name in the ticker -> dock opens -> EQ zone shows track name (left)
   + 8-bar EQ (right), 30s iTunes preview plays until the pointer leaves the tray. ---- */
(function(){
  'use strict';
  if(window.__BHEQ)return;
  window.__BHEQ=true;
  var TICKER_DATA=null;
  var ITUNES='https://itunes.apple.com/search?entity=musicTrack&limit=12&media=music&term=';
  var REDUCED=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function bhTrunc(s,n){s=String(s==null?'':s).trim();return s.length>n?s.slice(0,n-1).trimEnd()+'\u2026':s;}

  var css=[
    '.bh-eq-zone{position:absolute;right:14px;top:50%;transform:translateY(-50%);',
    'display:flex;align-items:center;gap:12px;max-width:46%;',
    'background:rgba(8,12,18,0.92);border:1px solid rgba(0,210,255,0.35);',
    'border-left:3px solid #00d2ff;border-radius:8px;padding:10px 14px;',
    'box-shadow:0 0 18px rgba(0,210,255,0.15);z-index:3;}',
    '.bh-eq-track{font-size:0.78rem;color:#9fb3c8;letter-spacing:0.3px;',
    'white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:240px;}',
    '.bh-eq-track b{color:#00d2ff;font-weight:600;}',
    '.bh-eq-cv{width:88px;height:44px;flex:0 0 auto;display:block;}',
    '@media (prefers-reduced-motion: reduce){.bh-eq-cv{display:none;}}'
  ].join('');
  var st=document.createElement('style');st.id='bh-eq1';st.textContent=css;document.head.appendChild(st);

  function normalize(s){return(s||'').toLowerCase().replace(/\(.*?\)/g,' ').replace(/[[\].,!'"?\-]/g,' ').replace(/\s+/g,' ').trim();}
  function stripFeat(s){return normalize(s.split(/\s+feat\.?\s+|\s+ft\.?\s+/i)[0]);}
  function pickTrack(items,artist){
    var want=stripFeat(artist);
    var wantTokens=want.split(' ');
    var pool=(items||[]).filter(function(it){return it&&it.previewUrl;});
    if(!pool.length)return null;
    var exact=pool.filter(function(it){return stripFeat(it.artistName)===want;});
    if(exact.length)return exact[0];
    var overlap=pool.filter(function(it){var toks=stripFeat(it.artistName).split(' ');return wantTokens.some(function(t){return t&&toks.indexOf(t)>-1;});});
    return overlap.length?overlap[0]:pool[0];
  }

  var audio=null,ctx=null,srcNode=null,analyser=null;
  var raf=0,cv=null,g2=null,curSlug=null;

  function drawEq(){
    if(!cv||!analyser)return;
    var g=cv.getContext('2d');
    var w=cv.width,h=cv.height;
    g.clearRect(0,0,w,h);
    var data=new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(data);
    var bars=8,seg=Math.floor(data.length/bars)||1;
    var bw=w/bars;
    for(var i=0;i<bars;i++){
      var sum=0;
      for(var j=0;j<seg;j++){sum+=data[i*seg+j];}
      var v=sum/seg/255;
      var bh=Math.max(3,v*(h-4));
      var grad=g.createLinearGradient(0,h,0,h-bh);
      grad.addColorStop(0,'#0e7490');
      grad.addColorStop(1,'#22d3ee');
      g.shadowColor='rgba(34,211,238,0.45)';
      g.shadowBlur=8;
      g.fillStyle=grad;
      g.fillRect(i*bw+2,h-bh,bw-4,bh);
    }
    raf=requestAnimationFrame(drawEq);
  }
  function staticEq(){
    if(!cv)return;
    var g=cv.getContext('2d');
    var w=cv.width,h=cv.height;
    g.clearRect(0,0,w,h);
    var bw=w/8;
    for(var i=0;i<8;i++){
      g.shadowColor='rgba(34,211,238,0.45)';
      g.shadowBlur=8;
      g.fillStyle='rgba(34,211,238,0.5)';
      g.fillRect(i*bw+2,h-6,bw-4,4);
    }
  }
  function stopPlayback(){
    if(raf){cancelAnimationFrame(raf);raf=0;}
    if(audio){try{audio.pause();}catch(e){}audio.src='';audio=null;}
    if(ctx){try{ctx.close();}catch(e){}ctx=null;}
    analyser=null;srcNode=null;
  }
  function startPreview(slug,zone){
    if(curSlug===slug)return;
    stopPlayback();
    curSlug=slug;
    var nameEl=zone.querySelector('.bh-eq-track');
    cv=zone.querySelector('.bh-eq-cv');
    nameEl.innerHTML='Looking up <b>'+zone.getAttribute('data-name')+'</b>\u2026';
    if(REDUCED)staticEq();
    fetch(ITUNES+encodeURIComponent(zone.getAttribute('data-name')))
      .then(function(r){return r.json();})
      .then(function(j){
        if(curSlug!==slug)return;
        var t=pickTrack(j.results,zone.getAttribute('data-name'));
        if(!t){nameEl.textContent='No preview found for '+zone.getAttribute('data-name');staticEq();return;}
        nameEl.innerHTML='<b>'+bhTrunc(t.trackName,34)+'</b> \u2014 '+bhTrunc(t.artistName,22);
        if(REDUCED)return;
        audio=new Audio();
        audio.preload='auto';
        audio.crossOrigin='anonymous';
        audio.src=t.previewUrl;
        var AC=window.AudioContext||window.webkitAudioContext;
        if(!AC){audio.play().catch(function(){});return;}
        ctx=new AC();
        srcNode=ctx.createMediaElementSource(audio);
        analyser=ctx.createAnalyser();
        analyser.fftSize=64;
        analyser.smoothingTimeConstant=0.8;
        srcNode.connect(analyser);
        analyser.connect(ctx.destination);
        var p=audio.play();
        if(p)p.catch(function(){
          nameEl.innerHTML='\u25B8 click to play: <b>'+bhTrunc(t.trackName,34)+'</b>';
          var once=function(){
            dock.removeEventListener('click',once);
            if(audio&&curSlug===slug){
              var pp=audio.play();
              if(pp)pp.catch(function(){});
              raf=requestAnimationFrame(drawEq);
              nameEl.innerHTML='<b>'+bhTrunc(t.trackName,34)+'</b> \u2014 '+bhTrunc(t.artistName,22);
            }
          };
          dock.addEventListener('click',once);
        });
        audio.addEventListener('ended',function(){if(curSlug===slug){stopPlayback();staticEq();}});
        raf=requestAnimationFrame(drawEq);
      })
      .catch(function(){
        if(curSlug===slug){nameEl.textContent='Preview unavailable';staticEq();}
      });
  }

  /* init: wait for rack.js dock */
  var dock=null,tick=null,zone=null,tries=0;
  var nameBySlug={};
  function init(){
    dock=document.querySelector('.bh-dock');
    tick=document.querySelector('.bh-tick');
    if(!dock||!tick){if(tries++<50)return setTimeout(init,100);return;}
    if(!dock.querySelector('.bh-eq-zone')){
      zone=document.createElement('div');
      zone.className='bh-eq-zone';
      var sp=document.createElement('span');
      sp.className='bh-eq-track';
      sp.textContent='Hover a DJ \u2014 preview plays';
      var c=document.createElement('canvas');
      c.className='bh-eq-cv';
      c.width=132;c.height=56;
      zone.appendChild(sp);
      zone.appendChild(c);
      dock.appendChild(zone);
      var cs=getComputedStyle(dock);
      if(cs.position==='static')dock.style.position='relative';
    }
    /* slug -> display name from the inline ticker payload (production: ticker.php) */
    try{
      /* the main IIFE stores the payload on window for this reader */
      var j=window.__BHTICKER||{};
      var djs=j.djs||{};
      Object.keys(djs).forEach(function(k){var dj=djs[k];if(dj&&dj.url){nameBySlug[String(dj.url).split('/').pop()]=dj.name;}});
    }catch(e){}
    tick.addEventListener('mouseover',function(e){
      var tk=e.target.closest?e.target.closest('.bh-tk'):null;
      if(!tk)return;
      var url=tk.getAttribute('data-url')||'';
      var slug=url.split('/').pop();
      if(!slug)return;
      var name=nameBySlug[slug]||slug;
      zone.setAttribute('data-name',name);
      startPreview(slug,zone);
    });
    var mo=new MutationObserver(function(){
      if(!dock.classList.contains('open')&&curSlug){
        stopPlayback();
        curSlug=null;
      }
    });
    mo.observe(dock,{attributes:true,attributeFilter:['class']});
  }
  init();
})();
