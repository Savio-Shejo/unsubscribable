// rage.js — maximum rage-bait engine. Hooks into app.js, no rebuild needed.
(function(){
  const $ = id => document.getElementById(id);
  const RANKS = [
    [0,'CALM 🧘'],[10,'ANNOYED 😒'],[25,'FUMING 😤'],[50,'FERAL 🦍'],[100,'CLIPPY HATER 👹']
  ];
  let lastMove = Date.now(), modalShown = false;

  // track rank/meter/shake/vignette
  setInterval(()=>{
    const r = Math.floor(window.rage || parseFloat($('rage')?.textContent||'0') || 0);
    window._rage = r;
    const pct = Math.min(r,100);
    if($('rage-fill')) $('rage-fill').style.width = pct+'%';
    let rank = RANKS[0][1];
    for(const [n,name] of RANKS) if(r>=n) rank=name;
    if($('rage-rank')) $('rage-rank').textContent = rank;
    if($('vignette')) $('vignette').style.opacity = Math.min(r/80,0.9);
  },400);

  function shake(strength=1){
    document.body.classList.remove('shake');
    void document.body.offsetWidth;
    document.body.classList.add('shake');
    if(strength>1) setTimeout(shake, 150);
  }

  // Hook rage shakes: app.js calls window.__onRage(n) from bumpRage
  window.__onRage = function(n){
    shake(n>=3?2:1);
    // high rage = cursor becomes annoying briefly
    if((window._rage||0) > 30 && Math.random()<0.25){
      document.body.style.cursor='wait';
      setTimeout(()=>document.body.style.cursor='', 800);
      spawnEvilPopup('⏳ Loading patience...');
    }
  };

  // EVIL POPUPS: fake X spawns 2 more 35% of time
  window.spawnEvilPopup = function(text){
    const host = $('popups'); if(!host) return;
    const p = document.createElement('div');
    p.className='popup';
    p.style.left=Math.random()*65+'vw'; p.style.top=(10+Math.random()*55)+'vh';
    const x = document.createElement('button');
    x.className='fake-x'; x.textContent='X';
    x.onclick=(e)=>{ e.stopPropagation(); p.remove();
      if(typeof window.bumpRage==='function') window.bumpRage(1);
      if(Math.random()<0.45){ spawnEvilPopup('❌ You missed! +1 popup'); spawnEvilPopup('❌ Oops! It multiplied'); }
    };
    const s=document.createElement('span'); s.textContent=text;
    p.appendChild(x); p.appendChild(s);
    p.onclick=()=>{ p.remove(); };
    host.appendChild(p);
    setTimeout(()=>p.remove(), 4000);
  };

  // IDLE SHAME: no mouse 12s -> guilt popup
  document.addEventListener('mousemove', ()=>{ lastMove = Date.now(); }, {passive:true});
  setInterval(()=>{
    if(!window._timeSec) return; // game not started
    if(Date.now()-lastMove > 8000){
      lastMove = Date.now();
      spawnEvilPopup('👀 Still there? We missed you. Have some spam.');
      if(typeof clippySay==='function') clippySay('AFK? Bold. The spam kept going without you.');
    }
  },3000);

  // RIGHT-CLICK + COPY BLOCK (rage classic)
  document.addEventListener('contextmenu', e=>{
    e.preventDefault();
    spawnEvilPopup('🚫 Right-click is a premium feature ($9.99/mo)');
    if(typeof window.bumpRage==='function') window.bumpRage(2);
  });
  document.addEventListener('copy', e=>{
    e.preventDefault();
    spawnEvilPopup('📋 Copying is cheating. Type it with feeling.');
  });

  // FAKE WINDOWS UPDATE modal once mid-game (after ~45s)
  setInterval(()=>{
    if(modalShown || !window._timeSec || window._timeSec < 30) return;
    modalShown = true;
    const m = document.createElement('div');
    m.className='fake-modal';
    m.innerHTML=`<div class="box"><h2><span class="spin">⏳</span> Important Spam Update</h2>
      <p>Installing newsletter 2.0... do not turn off your disappointment.</p>
      <p><b id="upd-pct">0%</b></p></div>`;
    document.body.appendChild(m);
    let p=0;
    const iv=setInterval(()=>{ p+=20; const el=$('upd-pct'); if(el) el.textContent=p+'%';
      if(p>=100){ clearInterval(iv); m.remove(); spawnEvilPopup('✅ Update complete! +20 new emojis'); } },400);
  },2000);

  // (Finale gaslight now lives in app.js runFake — rage.js just adds flavor popups)
  // FINALE backup flavor: extra popup when finale screen shows

  // LETTER GASLIGHT: replace hate->love sometimes + random caps
  document.addEventListener('input', e=>{
    if(e.target?.id !== 'letter') return;
    let v = e.target.value;
    if(/hate/i.test(v) && Math.random()<0.3){
      v = v.replace(/hate/gi,'love');
      e.target.value = v;
      spawnEvilPopup('💘 We fixed that typo: hate → love');
    }
  });

  // SHAME LEVEL: STAY button grows, LEAVE teleports once
  let teleported=false;
  setInterval(()=>{
    const leave=$('btn-leave'), stay=$('btn-stay');
    if(!leave||!stay) return;
    if(!leave.dataset.armed && $('screen-shame')?.classList.contains('active')){
      leave.dataset.armed='1';
      leave.addEventListener('mouseenter', ()=>{
        if(!teleported && Math.random()<0.5){
          teleported=true;
          leave.style.position='relative';
          leave.style.left=(Math.random()*120-60)+'px';
          leave.style.top=(Math.random()*40-20)+'px';
          spawnEvilPopup('🏃 The coward button fled!');
        }
      });
    }
    if($('screen-shame')?.classList.contains('active')){
      const g = parseInt($('guilt')?.textContent||'0');
      stay.style.transform=`scale(${1+g*0.12})`;
    }
  },1000);

  // MOUSE RAGEBAIT PACK — proximity flee, ghost cursor, trail taunts, hover tax, click detector
  let mouseX=innerWidth/2, mouseY=innerHeight/2, lastTrail=0, clickTimes=[];
  document.addEventListener('mousemove',e=>{ mouseX=e.clientX; mouseY=e.clientY; },{passive:true});

  // Ghost cursor: laggy decoy that haunts the dodge arena (native cursor hidden there)
  const ghost=document.createElement('div');
  ghost.id='ghost-cursor'; ghost.textContent='👆';
  document.body.appendChild(ghost);
  let gx=mouseX, gy=mouseY;
  (function ghostLoop(){
    gx+=(mouseX-gx)*0.18; gy+=(mouseY-gy)*0.18;
    ghost.style.transform=`translate(${gx}px,${gy}px)`;
    const hunting=$('screen-dodge')?.classList.contains('active');
    ghost.style.opacity=hunting?'1':'0';
    const arena=$('dodge-arena'); if(arena) arena.classList.toggle('hunting',!!hunting);
    requestAnimationFrame(ghostLoop);
  })();

  // Proximity flee: the button runs BEFORE you touch it (reuses dodge logic + pity)
  setInterval(()=>{
    if(!$('screen-dodge')?.classList.contains('active')) return;
    const b=$('btn-dodge'); if(!b || /tired/i.test(b.textContent)) return;
    const r=b.getBoundingClientRect();
    const d=Math.hypot(mouseX-(r.left+r.width/2), mouseY-(r.top+r.height/2));
    if(d<120) b.dispatchEvent(new Event('mouseover'));
  },120);

  // Trail taunts: floating "nope"s follow fast mice at 35+ rage
  const TRAILS=['nope','miss','slow','lol','lmao','so close','nah','beta?','weak','cry'];
  document.addEventListener('mousemove',()=>{
    const now=Date.now();
    if(now-lastTrail<700 || (window._rage||0)<25 || !window._timeSec) return;
    lastTrail=now;
    const s=document.createElement('span');
    s.className='trail-taunt';
    s.textContent=TRAILS[Math.floor(Math.random()*TRAILS.length)];
    s.style.left=mouseX+'px'; s.style.top=mouseY+'px';
    document.body.appendChild(s);
    setTimeout(()=>s.remove(),800);
  },{passive:true});

  // Hover tax: just HOVERING the coward button costs rage
  setInterval(()=>{
    const leave=$('btn-leave');
    if(!leave||leave.dataset.tax) return;
    leave.dataset.tax='1';
    leave.addEventListener('mouseenter',()=>{
      if(!$('screen-shame')?.classList.contains('active')) return;
      if(typeof window.bumpRage==='function') window.bumpRage(1);
      if(Math.random()<0.3 && typeof clippySay==='function') clippySay("Hovering won't save you, beta.");
    });
  },1000);

  // Rapid-click detector: 6+ clicks/sec gets you mocked
  document.addEventListener('click',()=>{
    const now=Date.now();
    clickTimes=clickTimes.filter(t=>now-t<1000); clickTimes.push(now);
    if(clickTimes.length>=5){
      clickTimes=[];
      if(typeof window.bumpRage==='function') window.bumpRage(2);
      if(typeof clippySay==='function') clippySay("WOW. Somebody's pressed. The button felt that.");
      if(typeof window.spawnEvilPopup==='function') window.spawnEvilPopup('🖱️ Your mouse filed a complaint');
    }
  });

  // STAY MAGNET: the green button leans toward your cursor. It wants you.
  document.addEventListener('mousemove',e=>{
    const stay=$('btn-stay');
    if(!stay || !$('screen-shame')?.classList.contains('active')){ if(stay) stay.style.translate=''; return; }
    const r=stay.getBoundingClientRect();
    const dx=e.clientX-(r.left+r.width/2), dy=e.clientY-(r.top+r.height/2);
    const d=Math.hypot(dx,dy);
    if(d<260 && d>40) stay.style.translate=`${(dx/d*10).toFixed(1)}px ${(dy/d*8).toFixed(1)}px`;
    else stay.style.translate='';
  },{passive:true});

  // DODGE AFTERIMAGES: the button leaves taunting ghosts as it flees
  let lastDodgePos=null;
  setInterval(()=>{
    if(!$('screen-dodge')?.classList.contains('active')) return;
    const b=$('btn-dodge'); if(!b) return;
    const r=b.getBoundingClientRect(), x=r.left, y=r.top;
    if(lastDodgePos && Math.hypot(x-lastDodgePos.x,y-lastDodgePos.y)>40){
      const g=document.createElement('span');
      g.className='ghost-trail'; g.textContent='💨';
      g.style.left=lastDodgePos.x+'px'; g.style.top=lastDodgePos.y+'px';
      document.body.appendChild(g);
      setTimeout(()=>g.remove(),700);
      if(Math.random()<0.3 && typeof window.bumpRage==='function') window.bumpRage(1);
    }
    lastDodgePos={x,y};
  },200);

  // ZOOMIES DETECTOR: fling your mouse, get mocked
  let lastZX=0,lastZY=0,lastZT=0,zoomieCD=0;
  document.addEventListener('mousemove',e=>{
    const now=Date.now();
    if(lastZT && now-lastZT<60){
      const v=Math.hypot(e.clientX-lastZX,e.clientY-lastZY)/Math.max(now-lastZT,1);
      if(v>2.2 && now>zoomieCD && window._timeSec){
        zoomieCD=now+4000;
        spawnEvilPopup('💨 ZOOMIES DETECTED. Calm down, beta.');
        if(typeof window.bumpRage==='function') window.bumpRage(2);
      }
    }
    lastZX=e.clientX; lastZY=e.clientY; lastZT=now;
  },{passive:true});

  // CAPTCHA TILES ARE SHY: hover one and it wiggles + judges you
  document.addEventListener('mouseover',e=>{
    const t=e.target?.closest?.('#captcha-grid div');
    if(!t || t.dataset.shy) return;
    t.dataset.shy='1';
    t.classList.add('wiggle');
    setTimeout(()=>{ t.classList.remove('wiggle'); delete t.dataset.shy; },600);
    if(Math.random()<0.25 && typeof clippySay==='function') clippySay("Don't touch the vibes. Just pick them.");
  });

  console.log('%c rage.js loaded — good luck leaving ','background:red;color:white;font-size:16px');
})();
