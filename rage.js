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
      if(Math.random()<0.35){ spawnEvilPopup('❌ You missed! +1 popup'); spawnEvilPopup('❌ Oops! It multiplied'); }
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
    if(Date.now()-lastMove > 12000){
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
    if(modalShown || !window._timeSec || window._timeSec < 40) return;
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

  console.log('%c rage.js loaded — good luck leaving ','background:red;color:white;font-size:16px');
})();
