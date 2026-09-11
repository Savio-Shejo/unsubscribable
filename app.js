// UNSUBSCRIBABLE - 100% useless, 100% annoying
let rage = 0, moves = 0, startTime = null, timerInt = null;
let guilt = 0, dodges = 0, captchaFails = 0, letterAttempts = 0;
let soundOn = true, currentLevel = 0, gameStarted = false;
let loops = 0, loopStart = Date.now(); // loops: completed runs. Winning is not on the menu.
let sharedAudio = null;

const $ = id => document.getElementById(id);
// Tuning config — tweak the cruelty here
const CONFIG = {
  cookiesTotal: 5, cookieRespawnChance: 0.55,
  guiltNeeded: 5, dodgesNeeded: 5, dodgePityAt: 12,
  captchaFailsNeeded: 3, letterMin: 100, letterMax: 600,
  pwPityAt: 3, holdSeconds: 3, holdPityStep: 0.4, holdMin: 1.5,
};
function shuffle(arr){ const a=[...arr]; for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; }
function toast(msg){
  const t=$('toast'); if(!t) return;
  t.textContent=msg; t.classList.remove('hidden');
  clearTimeout(t._h); t._h=setTimeout(()=>t.classList.add('hidden'), 1800);
}
// Fullscreen on first interaction (browsers forbid it before a gesture,
// so we hijack their very first tap — poetic). Re-enters if they Esc out.
function goFullscreen(){
  if(document.fullscreenElement || document.webkitFullscreenElement) return;
  try{
    const el=document.documentElement;
    const p=el.requestFullscreen ? el.requestFullscreen() : el.webkitRequestFullscreen?.();
    if(p && p.catch) p.catch(()=>{});
  }catch(e){}
}
document.addEventListener('pointerdown',goFullscreen,{passive:true});
document.addEventListener('keydown',goFullscreen);
// TYPING CHAOS — Clippy's autocorrect™ mangles words as you type
const WRONG_WORDS = {
  'the':'teh','you':'u','your':'ur','please':'pls','unsubscribe':'subscribe',
  'leave':'stay','want':'wnat','because':'becuase','sorry':'sowwy','never':'nevar',
  'spam':'ham','stop':'start','hate':'love','very':'vary','actually':'akshually',
  'definitely':'definately','good':'god','email':'e-mail (certified)',
};
function chaosType(el){
  const v=el.value;
  if(!v || Math.random()>0.45) return;
  const m=v.match(/^(.*\s)?([A-Za-z'()-]+)(\s)$/);
  if(!m) return;
  const head=m[1]||'', word=m[2], tail=m[3];
  const low=word.toLowerCase();
  let out=null;
  if(WRONG_WORDS[low] && Math.random()<0.6) out=WRONG_WORDS[low];
  else if(word.length>4 && Math.random()<0.5){
    const i=Math.floor(Math.random()*(word.length-1));
    out=word.slice(0,i)+word[i+1]+word[i]+word.slice(i+2); // letter swap
  } else if(Math.random()<0.3) out=word.toUpperCase(); // SHOUTING
  if(out && out!==word){
    el.value=head+out+tail;
    el.selectionStart=el.selectionEnd=el.value.length;
    if(Math.random()<0.4) spawnPopup('✏️ Autocorrect™ improved that for you');
  }
}
const taunts = [
  "Wow. Rude.", "Our CEO just felt that click.",
  "Clippy believes in you. To stay.",
  "That rage click has been logged with HR.",
  "Almost! (not even close)",
  "Have you tried… staying forever?",
  "Your inbox misses you already.",
  "Skill issue. Honestly.",
  "Bro's mad over a newsletter 💀",
  "Imagine losing to a button. Couldn't be me.",
  "TL;DR: you're not leaving."
];
const clippyLines = [
  "Looks like you're trying to leave... don't.",
  "Did you know 9/10 users LOVE spam?",
  "I told my kids about you. They cried.",
  "Click harder. That helps. Probably.",
  "Unsubscribing causes baldness. Source: me.",
  "Stay a little longer… forever.",
  "Ratio + you're staying subscribed."
];
const HEADLINES = [
  "💎 10 Crypto Tips From Our CEO's Dog", "🔥 Hot Singles In Your Spam Folder",
  "🥗 Kale Will Fix Your Personality", "🧦 Socks: The Stock Market Of Feet",
  "👽 Aliens Hate This One Unsubscribe Trick", "🧠 Your Brain On Spam (Gone)",
  "🐸 Frog Forecasts: Moist Week Ahead", "📉 Our Open Rates Are Down, Please Clap",
  "🍕 Pizza Is A Love Language (We Checked)", "🦄 Unicorn Startup Seeks Inbox Victims",
];
const COOKIE_NAMES = [
  "Super important tracker™", "Emotional support pixel", "Vibe harvester 3000",
  "Definitely-not-spyware crumb", "Grandma-approved sniffer", "Premium ultra stalker",
  "Leftover Santa tracker", "Crypto-adjacent nibble",
];
const CAPTCHA_POOL = ["🍕","🦄","💩","🌈","🧠","📎","🐸","👽","🥺","🤡","👾","💌","🧦","🛸","🎃"];
function renderHeadlines(){
  const ul=$('headlines'); if(!ul) return;
  ul.innerHTML='';
  shuffle(HEADLINES).slice(0,3).forEach(h=>{ const li=document.createElement('li'); li.textContent=h; ul.appendChild(li); });
}

const LEVEL_TOASTS = {1:'Level 1: Cookie Hell 🍪',2:'Level 2: Guilt Trip 🥺',3:'Level 3: Catch the Button 🏃',4:'Level 4: Vibe Check 🤖',5:'Level 5: Breakup Letter 💔',6:'Level 6: Password Hell 🔑',7:'Level 7: HOLD IT 🫳',8:'Processing... 🎉'};
function show(id, level){
  document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
  $(id).classList.add('active');
  window.scrollTo(0,0);
  if(typeof level === 'number'){ currentLevel = level; updateLevels(); if(LEVEL_TOASTS[level] && gameStarted) toast(LEVEL_TOASTS[level]); }
}
function updateLevels(){
  document.querySelectorAll('#levelbar span').forEach(el=>{
    const lv = parseInt(el.dataset.lv, 10);
    el.classList.toggle('active', lv === currentLevel);
    el.classList.toggle('done', lv < currentLevel);
  });
}
function bumpRage(n=1){
  rage+=n; window.rage=rage; window._rage=Math.floor(rage);
  $('rage').textContent=Math.floor(rage);
  $('taunt').textContent = taunts[Math.floor(Math.random()*taunts.length)];
  if(Math.random()<0.5) clippySay(clippyLines[Math.floor(Math.random()*clippyLines.length)]);
  if(typeof window.__onRage === 'function'){ try{ window.__onRage(n); }catch(e){} }
}
window.bumpRage = bumpRage;
function clippySay(t){
  $('clippy').classList.remove('hidden');
  $('clippy-text').textContent=t;
}
window.clippySay = clippySay;
// Throttled moves counter (avoid 10k numbers from mousemove spam)
let lastMoveTick = 0;
document.addEventListener('mousemove',e=>{
  const now = Date.now();
  if(now - lastMoveTick < 80) return;
  lastMoveTick = now; moves++; $('moves').textContent=moves;
},{passive:true});
document.addEventListener('touchmove',()=>{
  moves++; $('moves').textContent=moves;
},{passive:true});

function startTimer(){
  if(gameStarted) return;
  gameStarted = true;
  startTime=Date.now();
  loopStart=Date.now();
  timerInt=setInterval(()=>{
    const s=Math.floor((Date.now()-startTime)/1000);
    window._timeSec=s;
    $('timer').textContent=`${Math.floor(s/60)}:${String(s%60).padStart(2,'0')}`;
  },500);
}

// LEVEL 0 -> 1
$('link-unsub').addEventListener('click',e=>{
  e.preventDefault(); startTimer();
  clippySay(clippyLines[0]);
  show('screen-cookies', 1); spawnCookies();
});

// LEVEL 1 COOKIES
let cookiesLeft=CONFIG.cookiesTotal;
function spawnCookies(){
  const area=$('cookie-area'); area.innerHTML='';
  cookiesLeft=CONFIG.cookiesTotal;
  $('cookie-count').textContent=String(CONFIG.cookiesTotal);
  updateCookieBar();
  shuffle(COOKIE_NAMES).slice(0,CONFIG.cookiesTotal).forEach((name,i)=>addCookie(i,name));
}
function addCookie(i, name){
  const area=$('cookie-area');
  const d=document.createElement('div');
  d.className='cookie-banner';
  d.innerHTML=`<span>🍪 Cookie #${i+1}: ${name} <small>(required)</small></span>`;
  const b=document.createElement('button');
  b.className='btn'; b.textContent='Reject';
  let respawns = 0;
  b.onclick=()=>{
    bumpRage(1);
    // pity: after 3 respawns on the same cookie, let it die
    if(respawns < 3 && Math.random()<CONFIG.cookieRespawnChance && cookiesLeft>1){
      respawns++;
      clippySay("Oops! That cookie respawned. So quirky!");
      d.style.transform=`translateX(${Math.random()*40-20}px)`;
      spawnPopup("🍪 Cookie respawned!");
      return; // evil: doesn't count
    }
    d.remove(); cookiesLeft--;
    $('cookie-count').textContent=Math.max(cookiesLeft,0);
    updateCookieBar();
    if(cookiesLeft<=0){ show('screen-shame', 2); clippySay("Fine. But you'll feel GUILTY next."); }
  };
  d.appendChild(b); area.appendChild(d);
}
function updateCookieBar(){ $('cookie-bar').style.width=`${(CONFIG.cookiesTotal-cookiesLeft)/CONFIG.cookiesTotal*100}%`; }
function spawnPopup(text){
  const host=$('popups');
  // cap popups so the DOM doesn't explode on stage
  if(host.children.length > 12) host.firstChild.remove();
  const p=document.createElement('div');
  p.className='popup'; p.textContent=text;
  p.style.left=Math.random()*70+'vw'; p.style.top=Math.random()*60+'vh';
  p.onclick=()=>{p.remove(); bumpRage(1);};
  host.appendChild(p);
  setTimeout(()=>p.remove(),2500);
}
window.spawnPopup = spawnPopup;

// LEVEL 2 SHAME
const shameMsgs=[
  "Unsubscribing makes Baby Clippy cry.",
  "Wow. After everything we've spammed for you?",
  "Your grandma stayed subscribed. Just saying.",
  "Last chance. We'll send FEWER emails. Like 13/day instead of 14.",
  "Sharma ji ka beta reads EVERY email. Be like Sharma ji ka beta.",
  "Clippy printed your photo and put it on the fridge. Of shame."
];
$('btn-stay').onclick=()=>{
  bumpRage(2);
  spawnPopup(["❤️ Smart choice! +10 spam added!","❤️ Mmm, obedience. +10 spam!","❤️ Clippy just smiled. Terrifying. +10 spam!"][Math.floor(Math.random()*3)]);
  clippySay("YESS! Stay! STAY FOREVER!");
};
$('btn-leave').onclick=()=>{
  guilt++; $('guilt').textContent=guilt;
  $('shame-text').textContent=shameMsgs[Math.min(guilt,shameMsgs.length-1)];
  bumpRage(1);
  // make leave button smaller each time - annoying
  const b=$('btn-leave');
  b.style.fontSize=Math.max(10-guilt*2,4)+'px';
  b.style.opacity=1-guilt*0.15;
  if(guilt>=CONFIG.guiltNeeded){ show('screen-dodge', 3); clippySay("You have no shame. FINE. Catch the button then."); resetDodge(); }
};

// LEVEL 3 DODGE (mouse + touch)
const dodgeBtn=$('btn-dodge'), arena=$('dodge-arena');
function moveDodge(){
  const r=arena.getBoundingClientRect();
  const w=Math.min(140, r.width-90), h=50;
  dodgeBtn.style.left=Math.max(0, Math.random()*(r.width-w))+'px';
  dodgeBtn.style.top=Math.max(0, Math.random()*(r.height-h))+'px';
}
function resetDodge(){
  dodges=0; $('dodge-count').textContent=`Dodges: 0/${CONFIG.dodgesNeeded}`;
  dodgeBtn.textContent='UNSUBSCRIBE';
  moveDodge();
}
function dodgeEvade(){
  if(dodges<CONFIG.dodgesNeeded){
    dodges++; $('dodge-count').textContent=`Dodges: ${dodges}/${CONFIG.dodgesNeeded}`;
    moveDodge(); bumpRage(1);
    clippySay(["Too slow!","Wheee!","Can't catch me!","My cardio is amazing!","One more? Forever?"][dodges%5]);
    if(dodges>=CONFIG.dodgesNeeded){ tireDodge(); }
    else if(dodges>=CONFIG.dodgePityAt){ tireDodge(); spawnPopup("🥺 Pity unlocked: button got tired early"); }
  }
}
function tireDodge(){
  dodgeBtn.textContent="OK fine, CLICK ME (tired...)";
  dodgeBtn.style.left='35%'; dodgeBtn.style.top='40%';
}
dodgeBtn.addEventListener('mouseover',dodgeEvade);
dodgeBtn.addEventListener('touchstart',e=>{ e.preventDefault(); dodgeEvade(); },{passive:false});
dodgeBtn.addEventListener('click',()=>{
  if(dodges<CONFIG.dodgesNeeded){ bumpRage(2); spawnPopup("Missed me!"); moveDodge(); }
  else{ show('screen-captcha', 4); buildCaptcha(); }
});
moveDodge();

// LEVEL 4 CAPTCHA (shuffled pool each run)
let selected=new Set();
let captchaEmojis=[];
function buildCaptcha(){
  const g=$('captcha-grid'); g.innerHTML=''; selected.clear();
  captchaEmojis = shuffle(CAPTCHA_POOL).slice(0,9);
  captchaEmojis.forEach((e,i)=>{
    const d=document.createElement('div'); d.textContent=e;
    d.onclick=()=>{ d.classList.toggle('sel'); d.classList.contains('sel')?selected.add(i):selected.delete(i); beep(); };
    g.appendChild(d);
  });
}
function beep(){
  if(!soundOn) return;
  try{
    sharedAudio = sharedAudio || new (window.AudioContext||window.webkitAudioContext)();
    if(sharedAudio.state === 'suspended') sharedAudio.resume();
    const o=sharedAudio.createOscillator(), g=sharedAudio.createGain();
    o.connect(g); g.connect(sharedAudio.destination);
    o.frequency.value=600+Math.random()*600;
    g.gain.setValueAtTime(0.08, sharedAudio.currentTime);
    o.start(); o.stop(sharedAudio.currentTime+0.08);
  }catch(e){}
}
$('btn-sound').onclick=()=>{
  soundOn=!soundOn;
  $('btn-sound').textContent=soundOn?'🔊':'🔇';
  $('btn-sound').setAttribute('aria-pressed', String(soundOn));
};
$('btn-captcha').onclick=()=>{
  captchaFails++; bumpRage(2); beep();
  if(captchaFails<CONFIG.captchaFailsNeeded){
    $('captcha-msg').textContent=`❌ WRONG. Our vibe-checker says those vibes are ${["mid","sus","rancid","illegal in Ohio"][captchaFails-1]}. Try again.`;
    spawnPopup(["🧠 The grid rearranged itself. Rude.","🤖 Even the robot is judging you now."][captchaFails%2]);
    // shuffle to be extra annoying
    buildCaptcha();
  } else {
    $('captcha-msg').textContent="✅ …fine. Human enough, I guess.";
    setTimeout(()=>show('screen-letter', 5),800);
  }
};

// LEVEL 5 LETTER - deletes letters + mangles words randomly
$('letter').addEventListener('input',e=>{
  let v=e.target.value;
  if(Math.random()<0.25 && v.length>5){
    v=v.slice(0,Math.floor(Math.random()*v.length))+v.slice(Math.floor(Math.random()*v.length)+1);
    e.target.value=v;
    spawnPopup("✏️ Autocorrect fixed that for you (deleted a letter)");
  } else chaosType(e.target);
  v=e.target.value;
  const len=v.length;
  // lying counter: sometimes shows less
  const shown = Math.random()<0.2 ? Math.max(0,len-7) : len;
  $('char-count').textContent=shown;
  $('char-lie').textContent = len>20&&Math.random()<0.5 ? "(probably)" : "";
  $('btn-letter').disabled = len<CONFIG.letterMin;
  const bar=$('letter-bar'); if(bar) bar.style.width=Math.min(len/CONFIG.letterMin*100,100)+'%';
  if(len>=100) $('verdict').textContent='';
  if(len>0&&len%30===0) clippySay("Beautiful prose. Shakespeare is crying. Keep going.");
});
$('btn-letter').onclick=()=>{
  const letter=$('letter').value;
  letterAttempts++;
  if(letter.length < CONFIG.letterMin){
    $('verdict').textContent='Too short. Even your breakup lacks commitment. 100 chars minimum. (score: 1/10)';
    clippySay('Too short. Even your breakup lacks commitment.');
    bumpRage(2);
    return;
  }
  if(letterAttempts < 2){
    $('verdict').textContent='Weak. My spam filter has seen more emotional depth. Try again with MORE pain. (score: 3/10)';
    $('btn-letter').textContent='SUBMIT HEARTBREAK (TRY HARDER)';
    clippySay('Weak. More pain needed. Rewrite it.');
    bumpRage(3);
    return;
  }
  $('verdict').textContent='Fine. Your suffering feels genuine enough. (score: 8/10)';
  clippySay('Fine. Genuine suffering detected.');
  setTimeout(()=>show('screen-password', 6),800);
};

// LEVEL 6 PASSWORD HELL — absurd rules, pity waives the evil one
let pwFails = 0;
const PW_RULES = [
  {id:'len', label:'At least 12 characters', test:v=>v.length>=12},
  {id:'num', label:'Contains a number', test:v=>/\d/.test(v)},
  {id:'upper', label:'Contains UPPERCASE screaming', test:v=>/[A-Z]/.test(v)},
  {id:'emoji', label:'Contains an emoji (security!)', test:v=>/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/u.test(v)},
  {id:'roman', label:'Contains a Roman numeral (IVXLCDM)', test:v=>/[IVXLCDM]/.test(v)},
  {id:'bang', label:'Ends with !', test:v=>v.endsWith('!')},
  {id:'noe', label:'Contains no letter "e" (sorry)', test:v=>!/e/i.test(v), evil:true},
];
function checkPw(){
  const v=$('pw').value;
  const waiveEvil = pwFails >= CONFIG.pwPityAt;
  const ul=$('pw-rules'); ul.innerHTML='';
  let allOk=true;
  PW_RULES.forEach(r=>{
    const waived = r.evil && waiveEvil;
    const ok = waived || r.test(v);
    if(!ok) allOk=false;
    const li=document.createElement('li');
    li.textContent=(ok?'✅ ':'❌ ')+r.label+(waived?' (PITY WAIVED 🙄)':'');
    li.className=ok?'ok':'no';
    ul.appendChild(li);
  });
  $('btn-pw').disabled=!allOk;
  return allOk;
}
$('pw').addEventListener('input',e=>{ chaosType(e.target); checkPw(); });
$('btn-pw').onclick=()=>{
  if(!checkPw()){
    pwFails++; bumpRage(2);
    $('pw-verdict').textContent=`Nope. Rules are rules. (fail #${pwFails})`+(pwFails>=CONFIG.pwPityAt-1?' Pity is near...':'');
    clippySay('Your password is weak. Like your commitment.');
    return;
  }
  // evil rule passes only via pity or inhuman effort — either way, suffer
  if(pwFails>0) toast('Password accepted. Barely.');
  show('screen-hold', 7); startHold();
};

// LEVEL 7 HOLD TO LEAVE — hold while Clippy attacks, pity shortens it
let holdNeed = CONFIG.holdSeconds, holdFails = 0, holdTimer = null, holdStart = 0, holdAttack = null;
function startHold(){
  $('hold-need').textContent=holdNeed.toFixed(1).replace(/\.0$/,'');
  $('hold-bar').style.width='0%';
}
function holdDown(e){
  e.preventDefault();
  holdStart=Date.now();
  clearInterval(holdTimer); clearInterval(holdAttack);
  // attacks while holding: popups + taunts
  holdAttack=setInterval(()=>{
    bumpRage(1);
    if(typeof window.spawnEvilPopup==='function') window.spawnEvilPopup('🫳 LET GO. You want to let go.');
    else spawnPopup('🫳 LET GO. You want to let go.');
    if(Math.random()<0.5) clippySay(['Keep holding... or else.','Your finger is shaking.','Almost... NOT.','Don\'t you dare finish.'][Math.floor(Math.random()*4)]);
  },600);
  holdTimer=setInterval(()=>{
    const held=(Date.now()-holdStart)/1000;
    $('hold-bar').style.width=Math.min(held/holdNeed*100,100)+'%';
    if(held>=holdNeed){
      clearInterval(holdTimer); clearInterval(holdAttack);
      $('hold-bar').style.width='100%';
      setTimeout(runFake,500);
    }
  },50);
}
function holdUp(){
  clearInterval(holdTimer); clearInterval(holdAttack);
  const bar=$('hold-bar');
  if(bar && parseFloat(bar.style.width||'0')>=100) return; // already won
  if($('screen-hold').classList.contains('active') && parseFloat(bar.style.width||'0')>5){
    holdFails++;
    holdNeed=Math.max(CONFIG.holdMin, holdNeed-CONFIG.holdPityStep);
    $('hold-need').textContent=holdNeed.toFixed(1).replace(/\.0$/,'');
    bar.style.width='0%';
    bumpRage(2);
    spawnPopup(`💪 So close! Pity: now only ${$('hold-need').textContent}s`);
    clippySay('HA! You let go. Classic.');
  }
}
$('btn-hold').addEventListener('mousedown',holdDown);
$('btn-hold').addEventListener('touchstart',holdDown,{passive:false});
['mouseup','mouseleave','touchend','touchcancel'].forEach(ev=>$('btn-hold').addEventListener(ev,holdUp));

// GLOBAL RAGEQUIT TRAPS — everyone ragequits, no one escapes
window.addEventListener('beforeunload',e=>{
  if(!gameStarted) return;
  e.preventDefault(); e.returnValue='Wait! Your spam will miss you!';
});
document.addEventListener('keydown',e=>{
  if(e.key==='Escape' && gameStarted){
    bumpRage(2);
    spawnPopup('⎋ Escape is disabled. There is no escape.');
    clippySay('Esc? Cute.');
  }
});
// RAGE QUIT button sometimes flees at high rage
$('btn-ragequit').addEventListener('mouseenter',()=>{
  if((window._rage||0)>40 && Math.random()<0.4){
    const b=$('btn-ragequit');
    b.style.transform=`translateX(${Math.random()*120-60}px)`;
    setTimeout(()=>b.style.transform='',600);
    spawnPopup('🏃 Even quitting is hard here.');
  }
});

// PRESTIGE LOOP — there is no winning. Beat everything, get a diploma,
// learn it was the tutorial, restart harder. Rage and timer never reset.
function fmt(s){ return `${Math.floor(s/60)}:${String(s%60).padStart(2,'0')}`; }
function prestige(){
  loops++;
  CONFIG.cookieRespawnChance=Math.min(0.9,CONFIG.cookieRespawnChance+0.1);
  resetRun();
  toast(`PRESTIGE ${loops}: cookies respawn more now. You did this to yourself.`);
  clippySay(`Prestige ${loops}. The tutorial was fun, right?`);
}
function resetRun(){
  guilt=0; dodges=0; captchaFails=0; letterAttempts=0; pwFails=0; holdFails=0;
  holdNeed=Math.max(CONFIG.holdMin,CONFIG.holdSeconds+loops*0.5);
  $('guilt').textContent='0';
  $('shame-text').textContent=shameMsgs[0];
  const bl=$('btn-leave');
  bl.style.fontSize=''; bl.style.opacity=''; bl.style.position=''; bl.style.left=''; bl.style.top='';
  delete bl.dataset.armed;
  $('btn-stay').style.transform='';
  $('captcha-msg').textContent='';
  const L=$('letter'); L.value='';
  $('char-count').textContent='0'; $('char-lie').textContent='';
  $('letter-bar').style.width='0%';
  $('btn-letter').disabled=true; $('btn-letter').textContent='SUBMIT HEARTBREAK';
  $('verdict').textContent='';
  $('pw').value=''; $('pw-rules').innerHTML='';
  $('btn-pw').disabled=true; $('pw-verdict').textContent='';
  loopStart=Date.now();
  renderHeadlines();
  resetDodge();
  show('screen-cookies', 1); spawnCookies();
}

// FINALE FAKE LOADING (with built-in gaslight, no rage.js race)
let finaleGaslit = false;
function runFake(){
  finaleGaslit = false;
  show('screen-finale', 8);
  const msgs=["Spinning up unsubscribe-service v9.4.2...","Notifying 47 microservices...","Running 312 unit tests (all skipped)...","Bribing the database (sharded, 6 regions)...","Deploying to prod on a Friday...","SIKE in progress..."];
  let p=0; $('fake-bar').style.width='0%';
  const int=setInterval(()=>{
    p+=Math.random()*18;
    // gaslight once: crash from ~85% to 12%
    if(!finaleGaslit && p>85){
      finaleGaslit = true; p = 12;
      $('fake-msg').textContent='⚠️ Server hiccup! So sorry! (not sorry) Restarting...';
      clippySay('Oops! Did that scare you? Good.');
      bumpRage(3);
    }
    $('fake-bar').style.width=Math.min(p,100)+'%';
    if(!finaleGaslit || p < 80) $('fake-msg').textContent=msgs[Math.min(Math.floor(p/20),msgs.length-1)];
    if(p>=100){
      clearInterval(int);
      setTimeout(showWin,600);
    }
  },400);
}
function fanfare(){
  if(!soundOn) return;
  try{
    sharedAudio = sharedAudio || new (window.AudioContext||window.webkitAudioContext)();
    [523,659,784,1047].forEach((f,i)=>{
      const o=sharedAudio.createOscillator(), g=sharedAudio.createGain();
      o.connect(g); g.connect(sharedAudio.destination);
      o.frequency.value=f; const t=sharedAudio.currentTime+i*0.12;
      g.gain.setValueAtTime(0.09,t); o.start(t); o.stop(t+0.12);
    });
  }catch(e){}
}
function canvasConfetti(){
  const c=$('confetti'); if(!c) return;
  const ctx=c.getContext('2d');
  c.width=innerWidth; c.height=innerHeight;
  const colors=['#f0f','#0ff','#ff0','#0f0','#f00'];
  const parts=Array.from({length:150},()=>({x:Math.random()*c.width,y:-20-Math.random()*c.height*0.3,s:4+Math.random()*6,v:2+Math.random()*3,r:Math.random()*Math.PI,vr:-0.1+Math.random()*0.2,col:colors[Math.floor(Math.random()*colors.length)]}));
  let frames=0;
  (function tick(){
    ctx.clearRect(0,0,c.width,c.height);
    parts.forEach(p=>{ p.y+=p.v; p.r+=p.vr; ctx.save(); ctx.translate(p.x,p.y); ctx.rotate(p.r); ctx.fillStyle=p.col; ctx.fillRect(-p.s/2,-p.s/2,p.s,p.s*0.6); ctx.restore(); });
    if(++frames<220) requestAnimationFrame(tick);
    else ctx.clearRect(0,0,c.width,c.height);
  })();
}
function showWin(){
  // NOTE: timer is NOT cleared. Time never stops here.
  show('screen-win', 8);
  const loopSecs = Math.floor((Date.now()-loopStart)/1000);
  window._lastLoopSecs = loopSecs;
  const finalRage = Math.floor(rage);
  $('final-stats').textContent=`Loop ${loops+1} survived in ${fmt(loopSecs)} (total suffering: ${$('timer').textContent}) with ${finalRage} rage clicks and ${moves} mouse wiggles.`;
  // 3 endings by rage rank — same hell, different trauma
  let ending='sike';
  if(finalRage < 15){
    ending='zen';
    $('win-emoji').textContent='🧘 SIKE (gently)! 🧘';
    $('win-title').innerHTML='You escaped without breaking a sweat. Suspicious.';
    $('win-flavor').textContent='Clippy respects you. You have been re-subscribed only ONCE. Enjoy the silence (14 emails/day).';
  } else if(finalRage >= 50){
    ending='feral';
    $('win-emoji').textContent='🦍 SIKE! 🦍';
    $('win-title').innerHTML='HR watched that. You are now <b>Chief Rage Officer</b>.';
    $('win-flavor').textContent='You work here now. Forever. Your first task: unsubscribe yourself. We also subscribed your mom.';
  } else {
    $('win-emoji').textContent='🎉 SIKE! 🎉';
    $('win-title').innerHTML='You are now subscribed <b>TWICE</b>.';
    $('win-flavor').textContent="Thanks for your loyalty. We've also subscribed your mom.";
  }
  // ...and the punchline: that was just the tutorial.
  $('win-flavor').textContent+=' PSYCH. That was the TUTORIAL. Prestige '+ (loops+1) +' awaits: same 7 levels, meaner cookies.';
  $('btn-again').textContent=`START PRESTIGE ${loops+1} 🔁`;
  window._ending = ending;
  // victims counter + best LOOP (local only, no backend)
  try{
    const n=(parseInt(localStorage.getItem('unsubscribable-victims')||localStorage.getItem('unsub-hell-victims')||'0',10)||0)+1;
    localStorage.setItem('unsubscribable-victims', String(n));
    $('victims').textContent=`👻 ${n} soul${n===1?'':'s'} trapped on this machine.`;
    const best = JSON.parse(localStorage.getItem('unsubscribable-best') || localStorage.getItem('unsub-hell-best') || 'null');
    if(!best || loopSecs < best.secs){
      localStorage.setItem('unsubscribable-best', JSON.stringify({secs: loopSecs, rage: finalRage}));
      $('best-stats').textContent=`🏆 NEW BEST! Fastest loop: ${fmt(loopSecs)} / ${finalRage} rage.`;
    } else {
      $('best-stats').textContent=`Best loop on this machine: ${fmt(best.secs)} / ${best.rage} rage.`;
    }
  }catch(e){}
  confetti(); canvasConfetti(); fanfare();
  clippySay(ending==='zen' ? "Okay. That was elegant. Stay anyway." : ending==='feral' ? "Welcome to the team. Forever." : "Welcome back. Forever.");
}
function confetti(){
  for(let i=0;i<40;i++) setTimeout(()=>spawnPopup(["🎉","💌","📧","❌"][i%4]),i*80);
}
$('btn-again').onclick=prestige;
$('btn-share').onclick=async ()=>{
  const end = window._ending==='zen' ? 'ZEN ending 🧘' : window._ending==='feral' ? 'FERAL ending 🦍 (hired as Chief Rage Officer)' : 'classic SIKE ending 🎉';
  const t=`I played UNSUBSCRIBABLE and survived loop ${loops+1} in ${fmt(window._lastLoopSecs||0)} with ${Math.floor(rage)} rage — ${end}. There is no winning. Can you escape?`;
  try{
    if(navigator.clipboard?.writeText){ await navigator.clipboard.writeText(t); }
    else throw new Error('no-clipboard');
    $('btn-share').textContent="COPIED! Now spam your friends ✅";
  }catch(e){
    window.prompt('Copy your shame:', t);
  }
};
$('btn-ragequit').onclick=()=>{
  bumpRage(5);
  spawnPopup("🚫 Rage quit blocked. Quitting is for quitters.");
  clippySay("Rage quit? In THIS economy?");
};
// Spam News ticker (pure flavor, zero freedom)
const TICKER_EXTRA = ["BREAKING: unsubscribe button files for divorce","WEATHER: 100% chance of spam","SPORTS: local man loses to button 5-0","MARKET: rage up 400%, analysts baffled","MISSING: one (1) exit link. Reward: none"];
function startTicker(){
  const el=$('ticker-text'); if(!el) return;
  const items=[...HEADLINES.map(h=>`📰 ${h}`),...TICKER_EXTRA];
  let i=0;
  el.textContent=items[0];
  setInterval(()=>{ i++; el.textContent=items[i%items.length]; },4000);
}
// Konami code: the reward is nothing. Stylish nothing.
const KONAMI=['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
let konamiIdx=0;
document.addEventListener('keydown',e=>{
  konamiIdx=(e.key===KONAMI[konamiIdx])?konamiIdx+1:(e.key===KONAMI[0]?1:0);
  if(konamiIdx>=KONAMI.length){
    konamiIdx=0; bumpRage(5);
    toast('KONAMI ACCEPTED. Reward: nothing. Stylish nothing.');
    clippySay('A cheater? In MY newsletter? Iconic.');
    for(let k=0;k<10;k++) setTimeout(()=>spawnPopup(['🌟','⭐','✨'][k%3]+' CHEAT CONFETTI'),k*90);
    const rank=$('rage-rank');
    if(rank){ const old=rank.textContent; rank.textContent='CHEATER 🌟'; setTimeout(()=>{ if(rank.textContent==='CHEATER 🌟') rank.textContent=old; },10000); }
  }
});
renderHeadlines();
startTicker();
updateLevels();
