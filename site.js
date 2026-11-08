const $=id=>document.getElementById(id)||document.createElement('div');
/* ===== Change the brand name and contact here ===== */
const BRAND = "Wavessa";
const EMAIL = "hello@example.com";

document.querySelectorAll('[data-brand]').forEach(e=>e.textContent=BRAND);
document.title = BRAND + " " + (document.body.dataset.title||"Studio Bangkok");
$('yr').textContent = new Date().getFullYear();
document.querySelectorAll('a[href^="mailto:"]').forEach(a=>{a.href='mailto:'+EMAIL;if(a.textContent.includes('@'))a.textContent=EMAIL});
const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
/* Prices are stored in THB and shown in AUD for now (about 21 THB = A$1, rounded to retail prices). */
const AUD_FIXED={7900:379,3990:199,12900:599};
const toAud=n=>{if(AUD_FIXED[n])return AUD_FIXED[n];const v=n/21;return v>=100?Math.round(v/10)*10-1:v>=30?Math.round(v/5)*5-1:v>=20?Math.round(v):Math.round(v*2)/2};
const thb = n => {if(!n)return 'A$0';const v=toAud(n);return 'A$'+(v%1?v.toFixed(2):v.toLocaleString('en-US'))};
const store = {get(k,d){try{const v=localStorage.getItem(k);return v?JSON.parse(v):d}catch(e){return d}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}};

/* ---------- Theme ---------- */
(function(){
  const root=document.documentElement;let t=null;try{t=localStorage.getItem('site-theme')}catch(e){}
  if(t)root.dataset.theme=t;
  $('themeBtn').onclick=()=>{
    const dark=root.dataset.theme?root.dataset.theme==='dark':matchMedia('(prefers-color-scheme: dark)').matches;
    root.dataset.theme=dark?'light':'dark';try{localStorage.setItem('site-theme',root.dataset.theme)}catch(e){}
  };
})();

/* ---------- Header, menu, sticky CTA ---------- */
const hdr=$('top'),mcta=$('mcta');
addEventListener('scroll',()=>{const y=scrollY;hdr.classList.toggle('solid',y>30);
  const r=$('visit').getBoundingClientRect();
  mcta.classList.toggle('show',y>innerHeight*.9&&!(r.top<innerHeight&&r.bottom>0));},{passive:true});
const drawer=$('drawer');
$('menuBtn').onclick=()=>drawer.classList.add('open');
$('closeMenu').onclick=()=>drawer.classList.remove('open');
drawer.querySelectorAll('a').forEach(a=>a.onclick=()=>drawer.classList.remove('open'));

/* ---------- Marquee ---------- */
const mqItems=["Specialty coffee","A pad in every seat","Five moods","Evening lounge","Mini Pod","Watches and glasses","Studio clothing","Bangkok"];
$('mq').innerHTML=[...mqItems,...mqItems].map(s=>`<span>${s}</span>`).join('');

/* ---------- Reveal + counters ---------- */
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.remove('pre');io.unobserve(e.target)}}),{threshold:.12});
function watchReveal(el){if(!RM&&el.getBoundingClientRect().top>innerHeight){el.classList.add('pre');io.observe(el)}}
document.querySelectorAll('.reveal').forEach(watchReveal);
const cio=new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)return;const el=e.target,end=+el.dataset.num;cio.unobserve(el);
  if(RM){el.textContent=end;return}const t0=performance.now();(function f(t){const p=Math.min(1,(t-t0)/1400);el.textContent=Math.round(end*(1-Math.pow(1-p,3)));if(p<1)requestAnimationFrame(f)})(t0)}),{threshold:.5});
document.querySelectorAll('[data-num]').forEach(el=>cio.observe(el));

/* ---------- Statement word light-up ---------- */
(function(){const p=$('stmt');p.innerHTML=p.textContent.split(' ').map(w=>`<span>${w}</span>`).join(' ');
  const sp=[...p.children];function u(){const r=p.getBoundingClientRect();const prog=(innerHeight*.85-r.top)/(r.height+innerHeight*.35);
  const n=Math.floor(Math.max(0,Math.min(1,prog))*sp.length);sp.forEach((s,i)=>s.classList.toggle('lit',i<n))}
  addEventListener('scroll',u,{passive:true});u();})();

/* ---------- Hero day / night ---------- */
(function(){const host=$('heroScene');const bs=host.querySelectorAll('.daynight button');
  const set=m=>{bs.forEach(b=>b.setAttribute('aria-pressed',b.dataset.m===m));const day=m==='day';
    const c=day?['#c9b79c','#8f7a5e','#e6d6bd','#c4ad8c']:['#1d3a35','#0d1c1a','#29504a','#173430'];
    ['seatTop','seatBot','cushTop','cushBot'].forEach((id,i)=>$(id).setAttribute('stop-color',c[i]));
    $('lampBeam').setAttribute('opacity',day?.25:.7);};
  bs.forEach(b=>b.onclick=()=>set(b.dataset.m));})();

/* ============================================================
   DATA: sessions and menu (change prices here)
   ============================================================ */
const SESSIONS=[
 {k:'Calm',c:'#5fe0bf',d:'Slow and even. For a quiet coffee.',drink:'Butterfly Calm',hz:.5},
 {k:'Focus',c:'#7fb8ff',d:'Bright and steady. For laptop hours.',drink:'Cold Brew Tonic',hz:1.4},
 {k:'Recharge',c:'#ffc66b',d:'Lifting rhythm. For the 3 pm dip.',drink:'Yuzu Ginger Fizz',hz:1.0},
 {k:'Unwind',c:'#d79bff',d:'Rolling waves. For after work.',drink:'Coconut Chamomile',hz:.7},
 {k:'Deep Rest',c:'#8a93ff',d:'Very slow. For the last hour of the night.',drink:'Warm Pandan Oat',hz:.3}
];
const LENS=[{m:15},{m:30},{m:45}]; /* 15 min Calm is free with an order. Other 15 and 30 min sessions THB 99 (A$4.50), 45 min THB 149 (A$7) */
const MENU={
 day:[
  ['Coffee','Thai beans',[['Espresso or long black','Single-origin from Chiang Rai',140],['Flat white','Whole or oat milk',150],['Iced Thai tea oat latte','Less sweet than usual',170],['Coconut cold brew','Steeped 18 hours, fresh coconut water',180],['Ceremonial matcha','Hot or iced',180]]],
  ['Brunch','Warmed to order',[['Grilled chicken rice bowl','Ginger rice, herbs, nam jim',280],['Truffle mushroom toastie','Sourdough, three cheeses',240],['Green curry pie','Flaky pastry, Thai basil',220],['Salmon poke bowl','Served cold',380],['Granola and mango','Coconut yoghurt',220]]],
  ['Sweet','Baked daily',[['Pandan basque cheesecake','',190],['Mango sticky rice pot','In season',180],['Coconut soft serve','Toasted coconut crumb',150],['Butter croissant','',120]]]
 ],
 eve:[
  ['Mood drinks','Alcohol-free',SESSIONS.map((s,i)=>[`<span class="dot" style="background:${s.c}"></span>${s.drink}`,['Butterfly pea, lemongrass, tonic','Espresso over citrus tonic','Yuzu, ginger, soda','Coconut, chamomile, honey','Warm pandan, oat milk, nutmeg'][i],[180,190,180,180,170][i]])],
  ['Evening plates','Until 23:00',[['Crispy chicken bites','Sweet chilli and lime',220],['Truffle fries','',190],['Spicy edamame','',140],['Grilled pork skewers','Tamarind glaze',240]]],
  ['Late tea and coffee','Until midnight',[['Decaf flat white','',160],['Chamomile and honey','',140],['Thai iced tea','',150],['Hot chocolate','70% Chanthaburi cacao',170]]]
 ]};
const MENU_FOOT={day:'Prices in Australian dollars, including GST. Ask staff about allergens. Every order includes a free 15-minute Calm session.',
  eve:'After 17:00 the lights go down and the Studio becomes a quiet lounge. The full evening menu is shown in store. After dark, sessions are gentle wind-down programs only.'};

/* ---------- Sessions UI ---------- */
let sm=0,sl=0,sT=0;
const moodsEl=$('moods'),lensEl=$('lens');
moodsEl.innerHTML=SESSIONS.map((s,i)=>`<button class="mood" style="--c:${s.c}" data-i="${i}" aria-pressed="${i===0}"><i></i><div><b>${s.k}</b><span>${s.d}</span></div><em>${s.drink.toUpperCase()}</em></button>`).join('');
lensEl.innerHTML=LENS.map((l,i)=>`<button data-i="${i}" aria-pressed="${i===0}">${l.m} min</button>`).join('');
function drawSess(){const s=SESSIONS[sm],l=LENS[sl];
  moodsEl.querySelectorAll('.mood').forEach(b=>b.setAttribute('aria-pressed',+b.dataset.i===sm));
  lensEl.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',+b.dataset.i===sl));
  $('seat').style.setProperty('--mc',s.c);
  $('sArc').setAttribute('stroke',s.c);
  $('sMood').textContent=s.k.toUpperCase();
  $('sLen').textContent=l.m+' MIN SESSION';
  $('sPrice').textContent=sl===0&&sm===0?'Free with any order':thb(sl===2?149:99);
  $('sDrink').textContent=s.drink;sT=0;}
moodsEl.onclick=e=>{const b=e.target.closest('.mood');if(b){sm=+b.dataset.i;drawSess()}};
lensEl.onclick=e=>{const b=e.target.closest('button');if(b){sl=+b.dataset.i;drawSess()}};
drawSess();
setInterval(()=>{sT=(sT+1)%300;const p=sT/300;$('sArc').style.strokeDashoffset=326.7*p;
  const left=Math.round(LENS[sl].m*60*(1-p));$('sTime').textContent=Math.floor(left/60)+':'+String(left%60).padStart(2,'0')},RM?2000:100);
(function(){const c=$('wave');if(!c.getContext)return;const x=c.getContext('2d');let W,H;
  function rs(){const r=c.getBoundingClientRect();W=c.width=r.width*Math.min(devicePixelRatio,2);H=c.height=r.height*Math.min(devicePixelRatio,2)}
  rs();addEventListener('resize',rs);let vis=false;new IntersectionObserver(e=>vis=e[0].isIntersecting).observe(c);
  (function f(t){requestAnimationFrame(f);if(!vis)return;x.clearRect(0,0,W,H);const s=SESSIONS[sm];
    for(let k=0;k<3;k++){x.beginPath();for(let i=0;i<=80;i++){const px=i/80*W;const py=H*.78+Math.sin(i/80*Math.PI*2*(2+k)+(RM?0:t/1000)*s.hz*2+k)*H*.03*(1+k*.4);i?x.lineTo(px,py):x.moveTo(px,py)}
      x.strokeStyle=s.c;x.globalAlpha=.18+.12*k;x.lineWidth=2*Math.min(devicePixelRatio,2);x.stroke()}x.globalAlpha=1})(0);})();

/* ---------- Menu UI ---------- */
const menuTabs=$('menuTabs');
function drawMenu(t){menuTabs.querySelectorAll('button').forEach(b=>b.setAttribute('aria-selected',b.dataset.t===t));
  $('menuGrid').innerHTML=MENU[t].map(([h,sub,items])=>`<div class="menu-col"><h3>${h}<small>${sub}</small></h3><ul>${items.map(([n,d,p])=>`<li><b>${n}</b><em>${typeof p==="number"?thb(p).replace("A$",""):p}</em>${d?`<span>${d}</span>`:''}</li>`).join('')}</ul></div>`).join('');
  $('menuFoot').textContent=MENU_FOOT[t];}
menuTabs.onclick=e=>{const b=e.target.closest('button');if(b)drawMenu(b.dataset.t)};
drawMenu(new Date().getHours()>=17?'eve':'day');

/* ============================================================
   DATA: devices (stored in THB, shown in AUD, target prices)
   ============================================================ */
const DEV=[
 {id:'pebble',r:'pod',tag:'Flagship',name:'Mini Pod',dims:'60 × 42 × 12 mm · 50 g',desc:'A smooth river-stone shape with a round touchscreen and one side button. Runs every program the seats do.',screen:'1.3″ round touch',batt:'800 mAh, about 4 h',water:'IP68 target',price:7900,live:1},
 {id:'puck',r:'pod',tag:'Biggest screen',name:'Puck',dims:'Ø48 × 12 mm · 48 g',desc:'A round disc where the whole face is the screen, with a progress ring for back-to-back programs.',screen:'1.6″ edge-to-edge',batt:'900 mAh',water:'IP68 target',price:7900},
 {id:'cardslim',r:'pod',tag:'Thinnest',name:'Card Slim',dims:'64 × 40 × 9 mm · 38 g',desc:'Thin enough for a wallet or phone case. Brushed aluminium with a small strip screen.',screen:'Strip display',batt:'500 mAh',water:'IP67 target',price:7290},
 {id:'capsule',r:'pod',tag:'Easiest to use',name:'Capsule',dims:'74 × 26 × 14 mm · 45 g',desc:'A pill shape with a turning ring to pick a mood and set the strength. No menus to learn.',screen:'Large-text strip',batt:'700 mAh',water:'IP67 target',price:7290},
 {id:'clippod',r:'pod',tag:'Lowest price',name:'Pod Lite',dims:'45 × 35 × 11 mm · 32 g',desc:'No screen, just one button and a light ring. Clips to a waistband and lasts weeks between charges.',screen:'Light ring',batt:'400 mAh, up to 3 weeks',water:'IP67 target',price:3990},
 {id:'podstrap',r:'watch',tag:'Add-on',name:'Pod Strap',dims:'Strap and cradle · 22 g',desc:'Click the Mini Pod into a soft strap and wear it as a watch, with steps, heart rate and sleep.',screen:'Uses the pod',batt:'Uses the pod',water:'IP68 target',price:1690},
 {id:'classic',r:'watch',tag:'Most premium',name:'Classic Round',dims:'44 mm steel case · 48 g',desc:'A polished steel watch with a turning crown and leather strap. Fitness tracking and the five moods on the wrist.',screen:'1.4″ round AMOLED',batt:'5–7 days',water:'5 ATM target',price:9390},
 {id:'square',r:'watch',tag:'Most screen',name:'Square Smart',dims:'45 × 38 × 11 mm · 40 g',desc:'A soft-square smartwatch with room for the full program menu and workout screens.',screen:'1.8″ curved AMOLED',batt:'4–5 days',water:'5 ATM target',price:8990},
 {id:'band',r:'watch',tag:'Sport and sleep',name:'Band',dims:'40 × 20 × 10 mm pod · 24 g',desc:'A slim fabric band, light enough to sleep in and sealed for the gym or the pool.',screen:'3 status lights',batt:'10 days',water:'5 ATM target',price:5890},
 {id:'cuff',r:'watch',tag:'Jewellery style',name:'Cuff',dims:'Open bangle, 30 mm wide · 55 g',desc:'A wide champagne-gold cuff with a larger coil and battery and a soft light strip.',screen:'Light strip',batt:'7 days',water:'IP67 target',price:8290},
 {id:'clipon',r:'glass',tag:'Fits your glasses',name:'Clip-On',dims:'9 g each side',desc:'Small sound modules that clip onto glasses you already own and play the audio side of a mood.',screen:'None',batt:'8 h audio',water:'IPX4 target',price:3090},
 {id:'classicg',r:'glass',tag:'Everyday style',name:'Classic',dims:'Acetate frame · 44 g',desc:'Bold square frames that look like normal sunglasses, with speakers hidden in the arms.',screen:'None',batt:'6 h audio',water:'IPX4 target',price:6890},
 {id:'roundwire',r:'glass',tag:'Lightest',name:'Round Wire',dims:'Thin metal frame · 32 g',desc:'Fine gold round frames with soft amber lenses for evening wind-down.',screen:'None',batt:'5 h audio',water:'IPX4 target',price:7290},
 {id:'sportwrap',r:'glass',tag:'Sweat-proof',name:'Sport Wrap',dims:'Wraparound shield · 36 g',desc:'A one-piece wraparound lens with grippy arms for running, cycling and the gym.',screen:'None',batt:'7 h audio',water:'IPX5 target',price:7290},
 {id:'rest',r:'glass',tag:'For sleep',name:'Rest',dims:'Soft padded frame · 28 g',desc:'A padded, light-blocking frame for naps and flights, with flat speakers that are comfortable on a pillow.',screen:'None',batt:'10 h audio',water:'IPX4 target',price:4190}
];
const RANGES={pod:['Pods','Five pocket designs, all waterproof, all running the same five moods.'],watch:['Watches','Four wrist designs plus a strap that turns the Mini Pod into a watch.'],glass:['Glasses','Five frames that play the sound side of a mood, with a gentle coil behind the ear.']};
const ONE={pod:'Pod',watch:'Watch',glass:'Glasses'};
const img=id=>`img/${id}.webp`;

/* ---------- Mini Pod tiers + finishes ---------- */
const TIERS=[
 {n:'Pod Lite',p:3990,d:'Light ring instead of a screen. Same five moods.',id:'clippod'},
 {n:'Mini Pod',p:7900,d:'Round touchscreen, heart-rate sensor, Bluetooth app.',id:'pebble'},
 {n:'Mini Pod Signature',p:12900,d:'Sapphire glass, aluminium shell, premium dock and case.',id:'pebble-sig'},
 {n:'Studio Edition',p:14900,d:'Signature, numbered and engraved, with a year of free seat sessions.',id:'pebble-studio',only:1}
];
const FIN=[{n:'Graphite',c:0x2a2e31,s:'#2a2e31'},{n:'Deep Teal',c:0x0f5d55,s:'#0f5d55'},{n:'Ivory',c:0xe9e3d6,s:'#e9e3d6'},{n:'Blush',c:0xe2a7a0,s:'#e2a7a0'},{n:'Silver',c:0xb8bdc0,s:'#b8bdc0',metal:1},{n:'Champagne',c:0xc8a96b,s:'#c8a96b',metal:1}];
let cfg={tier:1,fin:0};
const tiersEl=$('tiers'),swEl=$('swatches');
tiersEl.innerHTML=TIERS.map((t,i)=>`<button class="tier" data-i="${i}" aria-pressed="${i===1}"><b>${t.n}${t.only?'<span class="only">In Studio only</span>':''}</b><em>${thb(t.p)}</em><span>${t.d}</span></button>`).join('');
swEl.innerHTML=FIN.map((f,i)=>`<button class="sw" style="background:${f.s}" aria-label="${f.n}" aria-pressed="${i===0}" data-i="${i}"></button>`).join('');
function updCfg(){const t=TIERS[cfg.tier];tiersEl.querySelectorAll('.tier').forEach(b=>b.setAttribute('aria-pressed',+b.dataset.i===cfg.tier));
  swEl.querySelectorAll('.sw').forEach(b=>b.setAttribute('aria-pressed',+b.dataset.i===cfg.fin));
  $('cfgPrice').innerHTML=thb(t.p)+(t.p===7900?'<small class="found">Founding pre-order A$329</small>':'')+`<small>incl. GST · target price${t.only?' · collect in Studio':''}</small>`;
  $('finName').textContent=FIN[cfg.fin].n;
  $('cfgBadge').textContent=FIN[cfg.fin].n+' · live 3D';}
tiersEl.onclick=e=>{const b=e.target.closest('.tier');if(b){cfg.tier=+b.dataset.i;updCfg()}};
swEl.onclick=e=>{const b=e.target.closest('.sw');if(b){cfg.fin=+b.dataset.i;updCfg();setFinish(cfg.fin)}};
$('cfgAdd').onclick=()=>{const t=TIERS[cfg.tier];addToBag({key:'tier-'+cfg.tier+'-'+cfg.fin,name:t.n,opt:FIN[cfg.fin].n,price:t.p,img:'pebble'})};
updCfg();

/* ---------- Device grid ---------- */
const devTabs=$('devTabs');
const plus='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>';
devTabs.innerHTML=Object.entries(RANGES).map(([k,v])=>`<button role="tab" data-r="${k}" aria-selected="${k==='pod'}">${v[0]}</button>`).join('');
devTabs.onclick=e=>{const b=e.target.closest('button');if(b)showRange(b.dataset.r)};
function showRange(r){devTabs.querySelectorAll('button').forEach(b=>b.setAttribute('aria-selected',b.dataset.r===r));
  $('devIntro').textContent=RANGES[r][1];
  const g=$('devGrid');
  g.innerHTML=DEV.filter(p=>p.r===r).map(p=>`<article class="prod">
    <button class="ph" data-open="${p.id}" aria-label="${p.name} details"><img src="${img(p.id)}" alt="${p.name} render" loading="lazy"></button>
    <span class="status ${p.live?'live':''}">${p.live?'Reserve now':'Concept'}</span>
    <span class="tag">${p.tag}</span><h3>${p.name}</h3><span class="dim">${p.dims}</span>
    <div class="foot"><b>${thb(p.price)}</b><button class="add" data-add="${p.id}" aria-label="Reserve ${p.name}">${plus}</button></div></article>`).join('');
  g.querySelectorAll('.prod').forEach((c,i)=>{if(RM)return;c.style.opacity=0;c.style.transform='translateY(20px)';setTimeout(()=>{c.style.transition='opacity .6s, transform .6s';c.style.opacity=1;c.style.transform='none'},60*i)});}
$('devGrid').onclick=e=>{const o=e.target.closest('[data-open]'),a=e.target.closest('[data-add]');
  if(a){const p=DEV.find(x=>x.id===a.dataset.add);addToBag({key:p.id,name:p.name,opt:ONE[p.r],price:p.price,img:p.id});a.classList.add('done');setTimeout(()=>a.classList.remove('done'),900)}
  else if(o)openPd(o.dataset.open)};
showRange('pod');

const pd=$('pd');
function openPd(id){const p=DEV.find(x=>x.id===id);
  $('pdIn').innerHTML=`<div class="pic"><img src="${img(p.id)}" alt="${p.name} render"></div>
  <div class="body"><span class="eyebrow">${ONE[p.r]} · ${p.tag}</span><h2 style="font-size:clamp(2rem,4vw,2.7rem)">${p.name}</h2>
  <p class="muted">${p.desc}</p>
  <dl class="kv"><dt>Size</dt><dd>${p.dims}</dd><dt>Screen</dt><dd>${p.screen}</dd><dt>Battery</dt><dd>${p.batt}</dd><dt>Water</dt><dd>${p.water}</dd></dl>
  <div class="feat"><h4>Works with the Studio</h4><ul><li>Runs the same five moods as the seats</li><li>Owners get free seat sessions</li><li>Try it at the counter before you reserve</li></ul></div>
  <div style="display:flex;justify-content:space-between;align-items:center;gap:1rem;flex-wrap:wrap;margin-top:.4rem"><b style="font:600 1.9rem/1 var(--f-d)">${thb(p.price)}</b>
  <button class="btn" id="pdAdd">${p.live?'Reserve':'Register interest'}</button></div>
  <small class="muted">Design render. Target price in AUD including GST. Specifications may change.</small></div>`;
  $('pdAdd').onclick=()=>{addToBag({key:p.id,name:p.name,opt:ONE[p.r],price:p.price,img:p.id});pd.close()};
  pd.showModal();}
$('pdClose').onclick=()=>pd.close();
pd.addEventListener('click',e=>{if(e.target===pd)pd.close()});

/* ============================================================
   DATA: clothing (stored in THB, shown in AUD)
   ============================================================ */
const COL={Ink:'#1b2422',Bone:'#e9e2d3',Sage:'#9fb3a1',Teal:'#0f5d55',Clay:'#c08a68',Mint:'#5fe0bf'};
const WEAR=[
 {id:'tee',name:'Ripple Tee',tag:'Heavyweight cotton',d:'240 gsm, boxy fit, small ripple mark on the chest.',price:890,cols:['Ink','Bone','Sage'],sizes:['S','M','L','XL']},
 {id:'hoodie',name:'Lounge Hoodie',tag:'Brushed fleece',d:'Soft inside, dropped shoulder, tonal embroidery.',price:1990,cols:['Ink','Teal','Bone'],sizes:['S','M','L','XL']},
 {id:'pants',name:'Rest Pants',tag:'Lounge knit',d:'Relaxed wide leg with a drawcord. Matches the hoodie.',price:1490,cols:['Ink','Teal','Sage'],sizes:['S','M','L','XL']},
 {id:'cap',name:'Studio Cap',tag:'Washed twill',d:'Six-panel, low profile, adjustable strap.',price:690,cols:['Ink','Bone','Clay'],sizes:['One size']},
 {id:'tote',name:'Market Tote',tag:'Heavy canvas',d:'Holds a laptop and a pod. Inside pocket.',price:490,cols:['Bone','Ink'],sizes:['One size']},
 {id:'socks',name:'Calm Socks',tag:'Combed cotton',d:'Ribbed crew socks in a pair of two.',price:290,cols:['Bone','Sage','Mint'],sizes:['S/M','L/XL']}
];
function wearSVG(id,c){const dark=['Ink','Teal'].includes(c);const f=COL[c],mk=dark?'#5fe0bf':'#0f5d55',sh='rgba(0,0,0,.14)',bg='transparent';
  const logo=(x,y,s)=>`<g transform="translate(${x} ${y}) scale(${s})" fill="none" stroke="${mk}" stroke-width="2.2" stroke-linecap="round"><circle cx="0" cy="0" r="2.6" fill="${mk}" stroke="none"/><path d="M-5.5 -5.5a7.6 7.6 0 0 0 0 11M5.5 -5.5a7.6 7.6 0 0 1 0 11"/></g>`;
  const S={
   tee:`<path d="M70 52l30-14h40l30 14 34 28-22 26-20-14v100H78V92L58 106 36 80z" fill="${f}"/><path d="M100 38c6 14 34 14 40 0" fill="none" stroke="${sh}" stroke-width="5"/><path d="M78 92v100h84" fill="none" stroke="${sh}" stroke-width="2"/>${logo(146,74,1)}`,
   hoodie:`<path d="M72 60l26-16c6-10 38-10 44 0l26 16 30 60-22 10-12-28v98H76v-98l-12 28-22-10z" fill="${f}"/><path d="M98 44c0 26 44 26 44 0" fill="none" stroke="${sh}" stroke-width="6"/><path d="M110 70v26M130 70v26" stroke="${sh}" stroke-width="3" stroke-linecap="round"/><rect x="92" y="150" width="56" height="30" rx="8" fill="${sh}"/>${logo(120,124,1.3)}`,
   pants:`<path d="M84 40h72l10 160h-36l-10-110-10 110H74z" fill="${f}"/><path d="M84 54h72" stroke="${sh}" stroke-width="6"/><path d="M114 58c-6 10-2 18 0 20M126 58c6 10 2 18 0 20" fill="none" stroke="${sh}" stroke-width="2.4"/>${logo(148,74,.8)}`,
   cap:`<path d="M60 140c0-50 26-76 60-76s60 26 60 76z" fill="${f}"/><path d="M60 140c40 10 110 10 150-6l-4 14c-40 14-110 12-150 2z" fill="${f}" stroke="${sh}" stroke-width="3"/><circle cx="120" cy="66" r="5" fill="${sh}"/><path d="M120 66v74" stroke="${sh}" stroke-width="2"/>${logo(120,112,1.5)}`,
   tote:`<path d="M90 80c0-40 60-40 60 0" fill="none" stroke="${f}" stroke-width="9"/><path d="M90 80c0-40 60-40 60 0" fill="none" stroke="${sh}" stroke-width="9"/><path d="M66 78h108l-6 122H72z" fill="${f}"/><path d="M66 78h108" stroke="${sh}" stroke-width="4"/>${logo(120,140,2)}`,
   socks:`<path d="M80 40h36v100c0 10 6 16 16 20l18 8c12 6 10 26-6 26H96c-12 0-20-8-20-20z" fill="${f}"/><path d="M80 40h36v18H80z" fill="${sh}"/><path d="M128 40h36v100c0 10 6 16 16 20l10 4" fill="none" stroke="${f}" stroke-width="0"/><path d="M80 66h36M80 72h36" stroke="${sh}" stroke-width="2"/>${logo(98,100,.9)}`
  };
  return `<svg viewBox="0 0 240 240" aria-hidden="true"><rect width="240" height="240" fill="${bg}"/><ellipse cx="120" cy="214" rx="70" ry="8" fill="rgba(0,0,0,.08)"/>${S[id]}</svg>`;}
const wsel={};WEAR.forEach(w=>wsel[w.id]={c:0,s:Math.min(1,w.sizes.length-1)});
function drawWear(){$('wearGrid').innerHTML=WEAR.map(w=>{const s=wsel[w.id];return `<article class="prod" data-w="${w.id}">
  <div class="ph" style="cursor:default">${wearSVG(w.id,w.cols[s.c])}</div>
  <span class="tag">${w.tag}</span><h3>${w.name}</h3><span class="dim">${w.d}</span>
  <div class="chips" role="group" aria-label="Colour">${w.cols.map((c,i)=>`<button style="background:${COL[c]}" aria-label="${c}" aria-pressed="${i===s.c}" data-c="${i}"></button>`).join('')}</div>
  <div class="sizes" role="group" aria-label="Size">${w.sizes.map((z,i)=>`<button aria-pressed="${i===s.s}" data-s="${i}">${z}</button>`).join('')}</div>
  <div class="foot"><b>${thb(w.price)}</b><button class="add" data-wadd="${w.id}" aria-label="Add ${w.name} to bag">${plus}</button></div></article>`}).join('');}
$('wearGrid').onclick=e=>{const card=e.target.closest('[data-w]');if(!card)return;const w=WEAR.find(x=>x.id===card.dataset.w),s=wsel[w.id];
  const c=e.target.closest('[data-c]'),z=e.target.closest('[data-s]'),a=e.target.closest('[data-wadd]');
  if(c){s.c=+c.dataset.c;drawWear()}else if(z){s.s=+z.dataset.s;drawWear()}
  else if(a){addToBag({key:w.id+'-'+s.c+'-'+s.s,name:w.name,opt:w.cols[s.c]+' · '+w.sizes[s.s],price:w.price,wear:w.id,col:w.cols[s.c]})}};
drawWear();

/* ============================================================
   DATA: coffee beans (retail 250 g bags)
   ============================================================ */
const BEANS=[
 {n:'Doi Chang',r:'Chiang Rai',alt:'1,200–1,400 m',pr:'Washed',notes:['Brown sugar','Orange','Cacao'],roast:3,price:450,c:'linear-gradient(140deg,#6b4226,#a9744a)'},
 {n:'Doi Saket',r:'Chiang Mai',alt:'1,100–1,300 m',pr:'Honey',notes:['Honey','Red apple','Black tea'],roast:2,price:520,c:'linear-gradient(140deg,#0f5d55,#3b9a85)'},
 {n:'Pang Khon',r:'Chiang Rai',alt:'about 1,300 m',pr:'Natural',notes:['Strawberry','Dark chocolate','Red wine-like'],roast:4,price:560,c:'linear-gradient(140deg,#5a2f4a,#a0577a)'}
];
const plusI='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>';
let beanPlan=0;const BEAN_PLANS=[['One bag',''],['Every 2 weeks',' · every 2 weeks'],['Every 4 weeks',' · every 4 weeks']];
(function(){const h=document.querySelector('.beans-head');if(!h||!document.getElementById('beans'))return;const t=document.createElement('div');t.className='sub-tog';t.setAttribute('role','group');t.setAttribute('aria-label','How often');t.innerHTML=BEAN_PLANS.map((p,i)=>`<button data-bp="${i}" aria-pressed="${i===0}">${p[0]}${i?' <em>-10%</em>':''}</button>`).join('');h.after(t);t.onclick=e=>{const b=e.target.closest('[data-bp]');if(!b)return;beanPlan=+b.dataset.bp;t.querySelectorAll('button').forEach(x=>x.setAttribute('aria-pressed',x===b));document.querySelectorAll('#beans [data-bprice]').forEach(el=>{const p=+el.dataset.bprice;el.textContent=thb(beanPlan?Math.round(p*.9/10)*10:p)})}})();
$('beans').innerHTML=BEANS.map((b,i)=>`<article class="bean reveal"><div class="bag-art" style="--bc:${b.c};--bi:url(img/photo/${['coffee-beans','coffee-cupping','coffee-portafilter'][i%3]}.webp)"><b><small>${b.r}</small>${b.n}</b></div>
  <dl><dt>Altitude</dt><dd>${b.alt}</dd><dt>Process</dt><dd>${b.pr}</dd><dt>Roast</dt><dd><span class="roast" aria-label="Roast ${b.roast} of 5">${[1,2,3,4,5].map(k=>`<i class="${k<=b.roast?'f':''}"></i>`).join('')}</span></dd></dl>
  <div class="notes">${b.notes.map(n=>`<span>${n}</span>`).join('')}</div>
  <div class="foot"><b><span data-bprice="${b.price}">${thb(b.price)}</span> <small class="muted" style="font:400 .8rem var(--f-b)">250 g</small></b><button class="add" data-bean="${i}" aria-label="Add ${b.n} beans">${plusI}</button></div></article>`).join('');
document.querySelectorAll('#beans .reveal').forEach(watchReveal);
$('beans').onclick=e=>{const a=e.target.closest('[data-bean]');if(!a)return;const b=BEANS[+a.dataset.bean];
  addToBag({key:'bean-'+a.dataset.bean+'-'+beanPlan,name:b.n+' beans',opt:'250 g'+BEAN_PLANS[beanPlan][1],price:beanPlan?Math.round(b.price*.9/10)*10:b.price,bean:b.c})};

/* ---------- Device finder ---------- */
const FQ=[['Pocket','Wrist','Glasses'],['Lowest price','Biggest screen','Longest battery','Looks','Easiest to use'],['Day and work','Training','Evening and sleep']];
const fa=[0,1,0];
function pickDev(){const [w,m,t]=fa;
  if(w===0){if(m===0)return['clippod','The lowest price in the range, and weeks between charges.'];if(m===1)return['puck','The whole face is the screen, with a ring that shows your queue.'];if(m===2)return['clippod','No screen, so it lasts up to 3 weeks on a charge.'];if(m===3)return['cardslim','Brushed aluminium and only 9 mm thin.'];return['capsule','A turning ring picks the mood. No menus to learn.']}
  if(w===1){if(t===2&&m!==3)return['band','Light enough to sleep in, with a 10-day battery.'];if(m===0)return['podstrap','Turns a Mini Pod into a watch for the price of a strap.'];if(m===1)return['square','The biggest screen on the wrist, with workout screens.'];if(m===2)return['band','About 10 days between charges.'];if(m===3)return['classic','Polished steel and leather. It looks like a good watch.'];if(t===1)return['band','Made for the gym and the pool.'];return['classic','A crown to turn and press, simple to use.']}
  if(t===2)return['rest','A padded frame for naps, flights and bedtime.'];if(t===1)return['sportwrap','Sweat-proof and grippy for runs and rides.'];if(m===0)return['clipon','Clips onto the glasses you already own.'];if(m===3)return['roundwire','Fine gold frames with amber lenses.'];return['classicg','Looks like normal sunglasses, with calls and music too.']}
function drawFinder(){FQ.forEach((opts,qi)=>{const el=$('fq'+qi);el.innerHTML=opts.map((o,i)=>`<button aria-pressed="${fa[qi]===i}" data-i="${i}">${o}</button>`).join('');
    el.onclick=e=>{const b=e.target.closest('button');if(b){fa[qi]=+b.dataset.i;drawFinder()}}});
  const [id,why]=pickDev(),p=DEV.find(x=>x.id===id);
  $('fres').innerHTML=`<img src="img/cut/${p.id}.webp" alt="${p.name}"><div><small>Your match</small><h3>${p.name}</h3><p>${why}</p>
    <div class="row"><b>${thb(p.price)}</b><button class="btn mint sm" data-fopen="${p.id}">See details</button><button class="btn ghost sm" data-fadd="${p.id}">Reserve</button></div></div>`;}
$('fres').onclick=e=>{const o=e.target.closest('[data-fopen]'),a=e.target.closest('[data-fadd]');
  if(o)openPd(o.dataset.fopen);if(a){const p=DEV.find(x=>x.id===a.dataset.fadd);addToBag({key:p.id,name:p.name,opt:ONE[p.r],price:p.price,img:p.id})}};
drawFinder();

/* ---------- Bundle + compare ---------- */
$('bundleWas').textContent='A$'+(toAud(7900)+toAud(1690)+toAud(2900)*3).toLocaleString('en-US')+' separately';
$('bundleAdd').onclick=()=>addToBag({key:'bundle',name:'Studio Starter bundle',opt:'Mini Pod, Pod Strap, 3 months Circle',price:13900,img:'pebble'});
const CMP=[['Screen','Light ring','1.3″ round touchscreen','1.3″ round touchscreen','1.3″ round touchscreen'],
 ['Sensors','Motion','Heart rate, skin temperature, motion','Heart rate, skin temperature, motion','Heart rate, skin temperature, motion'],
 ['Shell','Soft-touch PC','Soft-touch PC','Anodised aluminium','Anodised aluminium, engraved and numbered'],
 ['Cover glass','None','Toughened glass','Sapphire glass','Sapphire glass'],
 ['In the box','Dock','Magnetic dock','Premium dock and case','Premium dock, case and a year of free seat sessions'],
 ['Where to buy','Studio and online','Studio and online','Studio and online','Studio only']];
$('cmpTable').innerHTML=`<thead><tr><th></th>${TIERS.map(t=>`<th>${t.n}<small>${thb(t.p)}</small></th>`).join('')}</tr></thead><tbody>${CMP.map(r=>`<tr><th>${r[0]}</th>${r.slice(1).map(v=>`<td class="${v==='None'?'no':''}">${v}</td>`).join('')}</tr>`).join('')}</tbody>`;

/* ---------- Live Bangkok clock and open status ---------- */
const OPENED=false; /* set to true when the Studio opens, and the chip shows live open or closed */
function bkk(){const d=new Date(Date.now()+7*3600e3);const h=d.getUTCHours(),m=d.getUTCMinutes();const t=String(h).padStart(2,'0')+':'+String(m).padStart(2,'0');
  const chip=$('liveChip');if(!chip.lastElementChild)return;const open=OPENED&&h>=8;
  chip.classList.toggle('open',open);
  chip.lastElementChild.textContent=(OPENED?(open?(h<17?'Open now, cafe until 17:00':'Open now, lounge until 24:00'):'Closed, opens 08:00'):'Not open yet')+' · '+t+' in Bangkok';}
bkk();setInterval(bkk,30000);

/* ---------- Bag ---------- */
let bag=store.get('studio-bag',[]);
const bagEl=$('bag'),toast=$('toast');let tt;
function say(m){toast.textContent=m;toast.classList.add('on');clearTimeout(tt);tt=setTimeout(()=>toast.classList.remove('on'),1800)}
function addToBag(it){const f=bag.find(x=>x.key===it.key);if(f)f.q++;else bag.push({...it,q:1});saveBag();say(it.name+' added to your bag')}
function saveBag(){store.set('studio-bag',bag);const n=bag.reduce((a,b)=>a+b.q,0);const c=$('bagCount');c.textContent=n;c.classList.toggle('on',n>0);drawBag()}
function drawBag(){const el=$('bagItems');
  el.innerHTML=bag.length?bag.map((b,i)=>`<div class="it"><div class="th">${b.wear?wearSVG(b.wear,b.col):b.bean?`<div style="width:100%;height:100%;background:${b.bean}"></div>`:`<img src="${img(b.img)}" alt="">`}</div><div><b>${b.name}</b><small>${b.opt} · ${thb(b.price)}</small></div>
    <div class="qty"><button data-q="${i}" data-d="-1" aria-label="Less">−</button><span>${b.q}</span><button data-q="${i}" data-d="1" aria-label="More">+</button></div></div>`).join(''):'<p class="empty">Your bag is empty. Add a device or some clothing to reserve it.</p>';
  $('bagTotal').textContent='A$'+bag.reduce((a,b)=>a+toAud(b.price)*b.q,0).toFixed(2).replace(/\.00$/,'');
  $('bagSend').disabled=!bag.length;$('bagSend').style.opacity=bag.length?1:.5;}
$('bagItems').onclick=e=>{const b=e.target.closest('[data-q]');if(!b)return;const i=+b.dataset.q;bag[i].q+=+b.dataset.d;if(bag[i].q<1)bag.splice(i,1);saveBag()};
const openBag=()=>{bagEl.classList.add('open');bagEl.setAttribute('aria-hidden','false')},closeBag=()=>{bagEl.classList.remove('open');bagEl.setAttribute('aria-hidden','true')};
$('bagBtn').onclick=openBag;$('footBag').onclick=e=>{e.preventDefault();openBag()};
$('bagClose').onclick=closeBag;$('bagShade').onclick=closeBag;
addEventListener('keydown',e=>{if(e.key==='Escape')closeBag()});
$('bagSend').onclick=()=>{if(!bag.length)return;
  const lines=bag.map(b=>`- ${b.q} x ${b.name} (${b.opt}) A$${(toAud(b.price)*b.q).toFixed(2).replace(/\.00$/,'')}`).join('\n');
  const body=`Hi ${BRAND} Studio,\n\nI'd like to reserve:\n${lines}\n\nTotal: ${'A$'+bag.reduce((a,b)=>a+toAud(b.price)*b.q,0).toFixed(2).replace(/\.00$/,'')}\n\nMy name:\nPhone or LINE ID:\n`;
  location.href=`mailto:${EMAIL}?subject=${encodeURIComponent(BRAND+' reservation')}&body=${encodeURIComponent(body)}`;};
saveBag();

/* ---------- Invite form ---------- */
document.querySelectorAll('[data-interest]').forEach(a=>a.addEventListener('click',()=>{$('wlInterest').value=a.dataset.interest}));
$('wl').addEventListener('submit',e=>{e.preventDefault();const f=new FormData(e.target),m=$('wlMsg');
  const body=`Name: ${f.get('name')}\nEmail or LINE: ${f.get('contact')}\nInterested in: ${f.get('interest')}\n`;
  location.href=`mailto:${EMAIL}?subject=${encodeURIComponent(BRAND+' Studio invite')}&body=${encodeURIComponent(body)}`;
  m.textContent='Your email app should open with your details. Press send there and you are on the list.';m.classList.add('show');});


/* ============================================================
   BACKGROUNDS: the device design renders (img/cut/*.webp, cut-outs
   of the 15 designs). Each entry: [design, x%, y%, width vw,
   rotate deg, opacity, blur px, show on phones 1/0]
   ============================================================ */
const BG={
 cafe:[['puck',86,4,12,12,.4,0,1],['clipon',-3,40,18,-8,.3,2,1]],
 sessions:[['rest',64,2,24,-6,.6,1,1],['band',-5,68,17,20,.45,2,1],['clippod',88,82,11,-10,.55,3,1]],
 menu:[['capsule',93,2,5,20,.45,0,1],['square',1,72,8,-14,.35,1,1]],
 devices:[['classicg',1,3,22,-6,.45,2,1],['capsule',93,8,5,18,.65,0,1],['podstrap',58,82,7,-20,.5,2,0],['cardslim',44,1,7,12,.4,4,0]],
 shop:[['pebble',82,0,13,10,.45,0,1],['roundwire',30,1,14,-8,.3,2,0]],
 clothing:[['band',86,3,13,-12,.4,0,1]],
 circle:[['cuff',66,-4,28,-10,.55,1,1],['classic',3,72,13,12,.45,2,1],['roundwire',38,86,18,6,.4,2,0]],
 visit:[['sportwrap',66,1,20,8,.35,1,1],['cardslim',1,82,7,-10,.38,0,1]]
};

/* ---------- Hero device wall ---------- */
(function(){const ids=['pebble','puck','classic','cuff','sportwrap','square','cardslim','roundwire','band','capsule','clippod','classicg','podstrap','rest','clipon'];
  document.querySelectorAll('[data-wall]').forEach(hero=>{const wall=document.createElement('div');wall.className='wall';wall.setAttribute('aria-hidden','true');
  let h='';for(let c=0;c<8;c++){const col=[];for(let k=0;k<5;k++)col.push(ids[(c*4+k*3)%15]);
    h+=`<div class="col" style="animation-duration:${50+c*7}s">${[...col,...col].map(id=>`<div class="tile"><img src="img/cut/${id}.webp" alt=""></div>`).join('')}</div>`}
  wall.innerHTML=h;const fade=document.createElement('div');fade.className='wallfade';hero.prepend(fade);hero.prepend(wall);});})();
const bgLayers=[];
Object.entries(BG).forEach(([id,list])=>{const sec=document.getElementById(id);if(!sec||sec.hasAttribute('data-wall'))return;
  const L=document.createElement('div');L.className='devbg';L.setAttribute('aria-hidden','true');
  L.innerHTML=list.map(([d,x,y,w,r,o,b,m],i)=>`<span data-m="${m}" data-sp="${(.04+b*.025).toFixed(3)}" style="--x:${x};--y:${y};--w:${w};--r:${r}deg;--o:${o};--b:${b}px;--d:${-i*2.3}s"><img src="img/cut/${d}.webp" alt="" loading="${id==='hero'?'eager':'lazy'}"></span>`).join('');
  sec.prepend(L);bgLayers.push(L)});
if(!RM){const spans=[...document.querySelectorAll('.devbg span')];
  const par=()=>{spans.forEach(sp=>{const r=sp.parentNode.parentNode.getBoundingClientRect();if(r.bottom<-200||r.top>innerHeight+200)return;
    sp.style.transform=`translate3d(0,${(r.top*+sp.dataset.sp).toFixed(1)}px,0)`})};
  addEventListener('scroll',par,{passive:true});par();}

/* ============================================================
   3D: procedural Mini Pod (three.js)
   ============================================================ */
const has3D=(()=>{try{const c=document.createElement('canvas');return !!(window.THREE&&(c.getContext('webgl2')||c.getContext('webgl')))}catch(e){return false}})();
const SHELL_MATS=[];
function setFinish(i){const f=FIN[i];SHELL_MATS.forEach(m=>{m.color.setHex(f.c).convertSRGBToLinear();m.metalness=f.metal?.85:.05;m.roughness=f.metal?.32:.55;m.clearcoat=f.metal?.6:.25;m.needsUpdate=true})}
function roundedRect(w,h,r){const s=new THREE.Shape(),x=-w/2,y=-h/2;
  s.moveTo(x+r,y);s.lineTo(x+w-r,y);s.quadraticCurveTo(x+w,y,x+w,y+r);s.lineTo(x+w,y+h-r);s.quadraticCurveTo(x+w,y+h,x+w-r,y+h);
  s.lineTo(x+r,y+h);s.quadraticCurveTo(x,y+h,x,y+h-r);s.lineTo(x,y+r);s.quadraticCurveTo(x,y,x+r,y);return s}
function makeScreenTex(){const c=document.createElement('canvas');c.width=c.height=512;const x=c.getContext('2d');const tex=new THREE.CanvasTexture(c);tex.anisotropy=4;
  const t0=performance.now();
  tex.draw=function(){const t=(performance.now()-t0)/1000;const s=SESSIONS[sm];x.fillStyle='#030606';x.fillRect(0,0,512,512);
    const p=(t/40)%1;x.lineCap='round';x.lineWidth=22;x.strokeStyle='rgba(255,255,255,.07)';x.beginPath();x.arc(256,256,200,0,7);x.stroke();
    x.strokeStyle=s.c;x.shadowColor=s.c;x.shadowBlur=24;x.beginPath();x.arc(256,256,200,-Math.PI/2,-Math.PI/2+Math.PI*2*(.25+p*.7));x.stroke();x.shadowBlur=0;
    const left=Math.max(0,Math.round(1800*(1-(.25+p*.7))));
    x.fillStyle='#f2fbf8';x.font='600 118px "Inter Tight",sans-serif';x.textAlign='center';x.textBaseline='middle';x.fillText(Math.floor(left/60)+':'+String(left%60).padStart(2,'0'),256,240);
    x.fillStyle='#8fb3aa';x.font='500 32px "JetBrains Mono",monospace';x.fillText(s.k.toUpperCase(),256,330);
    tex.needsUpdate=true};
  tex.draw();return tex}
function buildPod(){
  const g=new THREE.Group();const W=42,H=60,R=17;
  const shellMat=new THREE.MeshPhysicalMaterial({color:new THREE.Color(FIN[0].c).convertSRGBToLinear(),roughness:.55,metalness:.05,clearcoat:.25,clearcoatRoughness:.5,envMapIntensity:.55});SHELL_MATS.push(shellMat);
  const back=new THREE.Mesh(new THREE.ExtrudeGeometry(roundedRect(W-2,H-2,R-1),{depth:1.5,bevelEnabled:true,bevelThickness:1.2,bevelSize:1,bevelSegments:6,curveSegments:48}),shellMat);back.position.z=0;g.add(back);
  const fs=roundedRect(W,H,R);fs.holes.push(roundedRect(W-3.2,H-3.2,R-1.6));
  const frame=new THREE.Mesh(new THREE.ExtrudeGeometry(fs,{depth:9.4,bevelEnabled:true,bevelThickness:.8,bevelSize:.8,bevelSegments:6,curveSegments:64}),shellMat);frame.position.z=1.2;
  const btn=new THREE.Mesh(new THREE.CylinderGeometry(.9,.9,10,24),new THREE.MeshStandardMaterial({color:0xaab0b3,metalness:1,roughness:.25}));btn.position.set(W/2+.9,8,5);frame.add(btn);g.add(frame);
  const disp=new THREE.Group();disp.add(new THREE.Mesh(new THREE.ExtrudeGeometry(roundedRect(W-4,H-4,R-2),{depth:1.3,bevelEnabled:false,curveSegments:48}),new THREE.MeshStandardMaterial({color:0x050707,roughness:.4})));
  const tex=makeScreenTex();const scr=new THREE.Mesh(new THREE.CircleGeometry(15.5,96),new THREE.MeshBasicMaterial({map:tex,toneMapped:false}));scr.position.set(0,5,1.32);disp.add(scr);
  const bar=new THREE.Mesh(new THREE.PlaneGeometry(7,1.1),new THREE.MeshBasicMaterial({color:0x5fe0bf,toneMapped:false}));bar.position.set(0,-17.5,1.32);disp.add(bar);
  disp.position.z=10;g.add(disp);
  const glass=new THREE.Mesh(new THREE.ExtrudeGeometry(roundedRect(W-3.2,H-3.2,R-1.6),{depth:.7,bevelEnabled:true,bevelThickness:.25,bevelSize:.25,bevelSegments:4,curveSegments:48}),
    new THREE.MeshPhysicalMaterial({color:0xffffff,roughness:.03,transparent:true,opacity:.08,clearcoat:1,depthWrite:false}));glass.position.z=11.4;g.add(glass);
  g.children.forEach(c=>c.position.z-=6);g.userData={tex};return g}
function makeEnv(renderer){const pm=new THREE.PMREMGenerator(renderer);const s=new THREE.Scene();
  s.add(new THREE.Mesh(new THREE.SphereGeometry(50,32,16),new THREE.MeshBasicMaterial({color:0x0e1a19,side:THREE.BackSide})));
  const lamp=(c,x,y,z,w,h)=>{const m=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({color:c,side:THREE.DoubleSide}));m.position.set(x,y,z);m.lookAt(0,0,0);s.add(m)};
  lamp(0xffffff,0,30,20,40,14);lamp(0xbff7e8,-35,5,10,10,30);lamp(0xffe2b8,35,-5,15,12,28);lamp(0x5fe0bf,0,-30,-10,30,8);
  const t=pm.fromScene(s,.04).texture;pm.dispose();return t}
function scene3D(host,o){
  const renderer=new THREE.WebGLRenderer({antialias:true,alpha:true});
  renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.outputEncoding=THREE.sRGBEncoding;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.05;
  host.appendChild(renderer.domElement);
  const scene=new THREE.Scene();scene.environment=makeEnv(renderer);
  const cam=new THREE.PerspectiveCamera(30,1,1,1000);cam.position.set(0,0,o.dist||170);
  scene.add(new THREE.HemisphereLight(0xdff7ef,0x0a1212,.5));
  const key=new THREE.DirectionalLight(0xffffff,1.1);key.position.set(40,60,90);scene.add(key);
  const rim=new THREE.PointLight(0x5fe0bf,1.4,400);rim.position.set(-70,-20,40);scene.add(rim);
  const warm=new THREE.PointLight(0xe8b878,.9,400);warm.position.set(70,40,30);scene.add(warm);
  const pod=buildPod();const holder=new THREE.Group();holder.add(pod);scene.add(holder);
  const rings=[];for(let i=0;i<4;i++){const m=new THREE.Mesh(new THREE.RingGeometry(1,1.012,128),new THREE.MeshBasicMaterial({color:0x5fe0bf,transparent:true,opacity:0,blending:THREE.AdditiveBlending,depthWrite:false,side:THREE.DoubleSide,toneMapped:false}));m.userData.ph=i/4;m.position.z=-8;holder.add(m);rings.push(m)}
  let rx=o.rx,ry=o.ry,vx=0,vy=0,drag=false,lx=0,ly=0,last=performance.now();
  const el=renderer.domElement;
  el.addEventListener('pointerdown',e=>{drag=true;lx=e.clientX;ly=e.clientY;last=performance.now();el.setPointerCapture(e.pointerId)});
  el.addEventListener('pointermove',e=>{if(!drag)return;vy=(e.clientX-lx)*.008;vx=(e.clientY-ly)*.005;ry+=vy;rx=Math.max(-1,Math.min(1,rx+vx));lx=e.clientX;ly=e.clientY;last=performance.now()});
  el.addEventListener('pointerup',()=>drag=false);el.addEventListener('pointercancel',()=>drag=false);
  function size(){const w=host.clientWidth,h=host.clientHeight;renderer.setSize(w,h,false);cam.aspect=w/h;cam.updateProjectionMatrix()}
  size();new ResizeObserver(size).observe(host);
  let vis=false;new IntersectionObserver(e=>vis=e[0].isIntersecting,{rootMargin:'100px'}).observe(host);
  let fr=0;
  (function loop(t){requestAnimationFrame(loop);if(!vis)return;fr++;
    if(!drag){vy*=.94;vx*=.9;ry+=vy;if(!RM&&performance.now()-last>1500)ry+=o.spin;}
    holder.rotation.set(rx,ry,0);if(!RM)holder.position.y=Math.sin(t/1400)*1.5;
    const mc=new THREE.Color(SESSIONS[sm].c);
    rings.forEach(m=>{const p=((t/4200)+m.userData.ph)%1;const s=24+p*60;m.scale.set(s,s,1);m.material.color.copy(mc);m.material.opacity=(1-p)*.45*Math.min(1,p*6)});
    if(fr%6===0)pod.userData.tex.draw();
    renderer.render(scene,cam)})(0);
}
if(has3D&&document.getElementById('cfgStage')){scene3D($('cfgStage'),{dist:165,spin:.004,rx:-.2,ry:.5})}
else{$('cfgStage').classList.add('no3d')}

/* ============================================================
   LOCATIONS: shortlisted areas. Put a real photo in img/ named
   loc-<id>.jpg (for example img/loc-thonglor.jpg) and it replaces
   the illustration automatically.
   ============================================================ */
const LOCS=[
 {id:'thonglor',top:1,name:'Thonglor and Ekkamai side sois',sub:'Sukhumvit 55 to 63 · near BTS Thong Lo and Ekkamai',d:"A quiet soi off the main road, on the ground floor or in a hidden upstairs room. This is Bangkok's home of premium cafes, clinics and members' bars, so it suits the evening lounge and the Circle best.",f:[['Rent','about A$3,329–A$5,239 a month'],['Size','about 60–65 m², 20 seats'],['Crowd','Young Thai professionals, Japanese and Western expats, the wellness crowd'],['Busy','All week, strongest in the evenings and at weekends']],sc:{sky:['#1b2346','#e8a46a'],bts:1,trees:2,hue:28}},
 {id:'ari',name:'Ari side sois',sub:'Phahonyothin Soi 7 · near BTS Ari',d:"Bangkok's hidden-cafe neighbourhood, with lower rent and a strong daytime crowd. A good fit for the first pop-up.",f:[['Rent','about A$1,899–A$3,329 a month'],['Crowd','Creatives, young professionals, media people'],['Busy','Weekdays and weekend brunch']],sc:{sky:['#9fd3d0','#f3e3c2'],bts:0,trees:5,hue:150}},
 {id:'sathorn',name:'Sathorn and Suan Plu',sub:'Near BTS Chong Nonsi and Saint Louis',d:'Old houses and small courtyards next to the business district, with a strong after-work crowd on weekdays.',f:[['Rent','about A$2,619–A$4,289 a month'],['Crowd','Executives, embassy staff, expat families'],['Busy','Weekdays, quieter at weekends']],sc:{sky:['#2a3550','#c9787a'],bts:1,trees:3,hue:200,house:1}}
];
function streetSVG(o,seed){let r=seed*9301+49297;const rnd=()=>(r=(r*9301+49297)%233280)/233280;
  const W=640,H=400,g=[];
  g.push(`<defs><linearGradient id="sk${seed}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${o.sky[0]}"/><stop offset="1" stop-color="${o.sky[1]}"/></linearGradient><linearGradient id="gl${seed}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffd59a" stop-opacity=".9"/><stop offset="1" stop-color="#ffb35c" stop-opacity=".5"/></linearGradient></defs>`);
  g.push(`<rect width="${W}" height="${H}" fill="url(#sk${seed})"/>`);
  // far towers
  for(let x=0;x<W;x+=34+rnd()*30){const h=90+rnd()*150;g.push(`<rect x="${x}" y="${250-h}" width="${26+rnd()*24}" height="${h}" fill="hsl(${o.hue} 18% ${20+rnd()*8}%)" opacity=".55"/>`)}
  // shophouses
  let x=-10;let i=0;while(x<W){const w=70+rnd()*40,h=150+rnd()*70,y=330-h,l=30+rnd()*25,cafe=i===2;
    g.push(`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="hsl(${o.hue+rnd()*40-20} ${14+rnd()*16}% ${l}%)"/>`);
    for(let fy=y+16;fy<y+h-70;fy+=34)for(let fx=x+10;fx<x+w-18;fx+=22){const lit=rnd()>.45;g.push(`<rect x="${fx}" y="${fy}" width="13" height="20" rx="2" fill="${lit?`url(#gl${seed})`:'rgba(0,0,0,.25)'}"/>`)}
    if(cafe){g.push(`<rect x="${x+6}" y="${282}" width="${w-12}" height="48" fill="#0e1918"/><rect x="${x+10}" y="${288}" width="${w-20}" height="36" fill="url(#gl${seed})" opacity=".8"/><rect x="${x+4}" y="272" width="${w-8}" height="10" rx="3" fill="#0f5d55"/><circle cx="${x+w/2}" cy="262" r="6" fill="#5fe0bf"/><circle cx="${x+w/2}" cy="262" r="14" fill="none" stroke="#5fe0bf" stroke-width="2" opacity=".6"/>`)}
    else g.push(`<rect x="${x+8}" y="292" width="${w-16}" height="38" fill="rgba(0,0,0,.35)"/><rect x="${x+4}" y="284" width="${w-8}" height="8" fill="hsl(${rnd()*360} 30% 40%)" opacity=".8"/>`);
    x+=w+2;i++}
  if(o.house){g.push(`<path d="M420 330V235l70-50 70 50v95z" fill="#e9e2d3"/><path d="M404 240l86-62 86 62" fill="none" stroke="#7a5232" stroke-width="10"/><rect x="460" y="270" width="60" height="60" fill="url(#gl${seed})"/><rect x="430" y="250" width="22" height="30" fill="url(#gl${seed})"/><rect x="528" y="250" width="22" height="30" fill="url(#gl${seed})"/>`)}
  if(o.bts){g.push(`<rect x="0" y="118" width="${W}" height="16" fill="#3a4441"/><rect x="0" y="134" width="${W}" height="5" fill="#262d2b"/>`);for(let px=60;px<W;px+=180)g.push(`<rect x="${px}" y="134" width="14" height="200" fill="#4a5451"/>`);g.push(`<rect x="120" y="92" width="300" height="26" rx="8" fill="#d8dedc"/><rect x="120" y="104" width="300" height="5" fill="#0f8f74"/>`);for(let wx=132;wx<410;wx+=22)g.push(`<rect x="${wx}" y="96" width="14" height="7" rx="1" fill="#8fd6c4"/>`)}
  // street + trees
  g.push(`<rect y="330" width="${W}" height="70" fill="#1d2422"/><rect y="330" width="${W}" height="8" fill="#3b4442"/>`);
  for(let k=0;k<o.trees;k++){const tx=30+rnd()*580,ts=34+rnd()*26;g.push(`<rect x="${tx-3}" y="${330-ts}" width="6" height="${ts}" fill="#4a3424"/><circle cx="${tx}" cy="${330-ts}" r="${ts*.75}" fill="hsl(${120+rnd()*30} 30% ${20+rnd()*10}%)"/><circle cx="${tx-ts*.4}" cy="${330-ts*.7}" r="${ts*.5}" fill="hsl(${120+rnd()*30} 30% ${24+rnd()*10}%)"/>`)}
  for(let k=0;k<6;k++){const lx=40+k*110;g.push(`<rect x="${lx}" y="250" width="3" height="80" fill="#2a312f"/><circle cx="${lx+1}" cy="250" r="5" fill="#ffd59a"/><circle cx="${lx+1}" cy="250" r="16" fill="#ffd59a" opacity=".18"/>`)}
  g.push(`<rect y="360" width="${W}" height="3" fill="#e8b878" opacity=".25"/>`);
  return `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice" aria-hidden="true">${g.join('')}</svg>`}
(function(){const grid=document.getElementById('locGrid');if(!grid)return;
  grid.innerHTML=LOCS.map((l,i)=>`<article class="loc reveal ${l.top?'top':''}"><div class="pic">${streetSVG(l.sc,i+3)}
    <img src="img/loc-${l.id}.jpg" alt="${l.name}" loading="lazy" onload="this.parentNode.querySelector('.lbl').textContent='Photo'" onerror="this.remove()">
    <span class="lbl">Illustration</span>${l.top?'<span class="pick">Top pick</span>':''}</div>
    <div class="body"><small>${l.sub}</small><h3 style="font-size:${l.top?'1.7rem':'1.25rem'}">${l.name}</h3><p>${l.d}</p>
    <dl>${l.f.map(([k,v])=>`<dt>${k}</dt><dd>${v}</dd>`).join('')}</dl></div></article>`).join('');
  grid.querySelectorAll('.reveal').forEach(watchReveal);})();

/* ============================================================
   APP: the companion app. APP_NAME is temporary until the brand
   name is chosen. Screens are real screenshots in img/app/.
   ============================================================ */
const APP_NAME="Ryan's Vibe";
document.querySelectorAll('[data-app]').forEach(e=>e.textContent=APP_NAME);
const APPS=[['today','Today','Your day, your wellness score and what is next.'],['routine','Routines','Ready-made routines to run back to back.'],['month','Month view','See which days you kept your routine going.'],['breathe','Breathing','Guided breathing with a slow, steady timer.'],['games','Games for all ages','Five full games with worlds and bosses. Cartoon action with no blood, rated PEGI 7.']];
(function(){const ph=document.getElementById('appPhones'),tabs=document.getElementById('appTabs');if(!ph||!tabs)return;
  let cur=0,timer;
  tabs.innerHTML=APPS.map((a,i)=>`<button role="tab" aria-selected="${i===0}" data-i="${i}"><b>${a[1]}</b><span>${a[2]}</span></button>`).join('');
  ph.innerHTML=APPS.map((a,i)=>`<img src="img/app/${a[0]}.webp" alt="${APP_NAME} app, ${a[1]} screen" class="${i===0?'on':''}" loading="lazy">`).join('');
  const show=i=>{cur=i;[...ph.children].forEach((im,k)=>im.classList.toggle('on',k===i));tabs.querySelectorAll('button').forEach((b,k)=>b.setAttribute('aria-selected',k===i))};
  const auto=()=>{clearInterval(timer);if(!RM)timer=setInterval(()=>show((cur+1)%APPS.length),3800)};
  tabs.onclick=e=>{const b=e.target.closest('button');if(b){show(+b.dataset.i);auto()}};auto();})();


/* ---------- Stock video: pause offscreen, still poster for reduced motion ---------- */
(function(){const vs=document.querySelectorAll('video[autoplay]');if(!vs.length)return;
  if(RM){vs.forEach(v=>{v.removeAttribute('autoplay');v.pause()});return}
  if(!('IntersectionObserver' in window))return;
  const io=new IntersectionObserver(es=>es.forEach(e=>{const v=e.target;if(e.isIntersecting){const p=v.play();p&&p.catch(()=>{})}else v.pause()}),{threshold:.05});
  vs.forEach(v=>io.observe(v));})();

/* ---------- Seat booking floor plan ---------- */
(function(){const g=document.getElementById('seats');if(!g)return;
  const SEATS=[];let n=1;
  [70,150,230,310,390,470,550].forEach(x=>SEATS.push({id:'W'+n++,x,y:90,t:'Window bar stool',z:'Window'}));
  n=1;[[110,190],[110,280],[250,190],[250,280]].forEach(([x,y])=>{SEATS.push({id:'L'+n++,x:x-26,y,t:'Lounge armchair',z:'Lounge'});SEATS.push({id:'L'+n++,x:x+26,y,t:'Lounge armchair',z:'Lounge'})});
  n=1;[[400,180],[400,250],[540,180],[540,250],[400,330]].forEach(([x,y])=>SEATS.push({id:'B'+n++,x,y,t:'Quiet booth seat',z:'Booth'}));
  const held=new Set(['L3','W5','B2']);let pick=null;
  const tables=[[110,190],[110,280],[250,190],[250,280]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="13" fill="#1d3a35"/>`).join('');
  g.innerHTML=tables+SEATS.map(s=>`<g class="seat${held.has(s.id)?' held':''}" data-id="${s.id}" tabindex="${held.has(s.id)?-1:0}" role="button" aria-label="${s.t} ${s.id}${held.has(s.id)?', already requested':''}"><rect x="${s.x-17}" y="${s.y-17}" width="34" height="34" rx="${s.z==='Lounge'?12:8}"/><text x="${s.x}" y="${s.y+4}" text-anchor="middle">${s.id}</text></g>`).join('');
  const days=[...Array(7)].map((_,i)=>{const d=new Date(Date.now()+i*864e5);return i===0?'Today':i===1?'Tomorrow':d.toLocaleDateString('en-GB',{weekday:'short',day:'numeric',month:'short'})});
  const times=['09:00','11:00','13:00','15:00','17:00','19:00','21:00','22:30'];
  const st={day:days[0],time:'15:00',mood:'Calm',ppl:'1'};
  function chips(id,arr,key){const el=document.getElementById(id);el.innerHTML=arr.map(v=>`<button aria-pressed="${st[key]===v}">${v}</button>`).join('');el.onclick=e=>{const b=e.target.closest('button');if(!b)return;st[key]=b.textContent;el.querySelectorAll('button').forEach(x=>x.setAttribute('aria-pressed',x===b))}}
  chips('bkDay',days,'day');chips('bkTime',times,'time');chips('bkMood',SESSIONS.map(s=>s.k),'mood');chips('bkPpl',['1','2','3','4'],'ppl');
  const box=document.getElementById('bkSeat'),go=document.getElementById('bkGo');
  function choose(el){if(!el||el.classList.contains('held'))return;g.querySelectorAll('.seat').forEach(x=>x.classList.toggle('pick',x===el));pick=SEATS.find(s=>s.id===el.dataset.id);
    box.innerHTML=`<small>Your seat</small><b>${pick.id} · ${pick.t}</b><span>${pick.z==='Window'?'Street view, good for laptops':pick.z==='Lounge'?'Soft and low, best for evening moods':'Tucked away and quiet, best for Deep Rest'}</span>`;go.disabled=false}
  g.onclick=e=>choose(e.target.closest('.seat'));g.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();choose(e.target.closest('.seat'))}};
  go.onclick=()=>{if(!pick)return;const body=`Hi, I'd like to request a seat.\n\nSeat: ${pick.id} (${pick.t})\nDay: ${st.day}\nTime: ${st.time}\nMood: ${st.mood}\nPeople: ${st.ppl}\n\nName:\nPhone or LINE:`;location.href=`mailto:${EMAIL}?subject=${encodeURIComponent(BRAND+' seat request')}&body=${encodeURIComponent(body)}`};
})();

/* ---------- Mini Pod scroll story ---------- */
(function(){const steps=document.querySelectorAll('.st');if(!steps.length)return;const pod=document.getElementById('stPod'),ring=document.getElementById('stRing'),chip=document.getElementById('stChip');
  function set(a){steps.forEach(s=>s.classList.toggle('on',s===a));const c=a.dataset.c;ring.style.setProperty('--c',c);chip.style.setProperty('--c',c);chip.lastElementChild.textContent=a.dataset.chip;pod.style.transform=`rotate(${a.dataset.r}deg) scale(${a.dataset.s})`}
  if(!('IntersectionObserver' in window))return;
  const io2=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)set(e.target)}),{rootMargin:'-45% 0px -45% 0px'});steps.forEach(s=>io2.observe(s));})();

/* ---------- Heading line reveal ---------- */
(function(){if(RM||!('IntersectionObserver' in window))return;const hs=document.querySelectorAll('.head h2, .circle h2, .visit h2');
  const io3=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('lines-in');io3.unobserve(e.target)}}),{threshold:.2});
  hs.forEach(h=>{if(h.getBoundingClientRect().top<innerHeight)return;h.innerHTML=h.innerHTML.split(/<br\s*\/?>/i).map((l,i)=>`<span class="ln"><span style="--i:${i}">${l}</span></span>`).join('');h.classList.add('lines');io3.observe(h)})})();

/* ---------- Door cursor (desktop) ---------- */
(function(){const door=document.querySelector('.door');if(!door||RM||!matchMedia('(pointer:fine)').matches)return;
  const c=document.createElement('div');c.className='door-cur';c.innerHTML='<span>Enter</span>';document.body.appendChild(c);
  let x=innerWidth/2,y=innerHeight/2,tx=x,ty=y;
  door.addEventListener('pointermove',e=>{tx=e.clientX;ty=e.clientY;const h=e.target.closest('.half');c.classList.toggle('on',!!h&&!e.target.closest('.go'));c.classList.toggle('dev',!!h&&h.classList.contains('dev'));c.firstChild.textContent=h&&h.classList.contains('dev')?'Shop':'Enter'});
  door.addEventListener('pointerleave',()=>c.classList.remove('on'));
  (function loop(){x+=(tx-x)*.18;y+=(ty-y)*.18;c.style.transform=`translate(${x}px,${y}px)`;requestAnimationFrame(loop)})();})();

/* ---------- Scroll progress ---------- */
(function(){if(document.querySelector('.door'))return;const b=document.createElement('div');b.className='sprog';document.body.appendChild(b);
  const u=()=>{const h=document.documentElement;b.style.transform=`scaleX(${Math.min(1,h.scrollTop/Math.max(1,h.scrollHeight-innerHeight))})`};addEventListener('scroll',u,{passive:true});u()})();

/* ---------- Magnetic buttons (desktop) ---------- */
(function(){if(RM||!matchMedia('(pointer:fine)').matches)return;
  document.querySelectorAll('.btn, .go, .icon-btn').forEach(b=>{b.classList.add('mag');
    b.addEventListener('pointermove',e=>{const r=b.getBoundingClientRect();const x=(e.clientX-r.left-r.width/2)*.22,y=(e.clientY-r.top-r.height/2)*.3;b.style.transform=`translate(${x}px,${y}px)`});
    b.addEventListener('pointerleave',()=>{b.style.transform=''})})})();

/* ---------- First-visit intro on the door page ---------- */
(function(){if(!document.querySelector('.door')||RM)return;let seen=false;try{seen=sessionStorage.getItem('intro')}catch(e){}if(seen)return;try{sessionStorage.setItem('intro','1')}catch(e){}
  const d=document.createElement('div');d.className='intro';d.setAttribute('aria-hidden','true');
  d.innerHTML=`<div><svg viewBox="0 0 32 32" fill="none" stroke-width="2.2" stroke-linecap="round"><circle cx="16" cy="16" r="3.2" fill="#5fe0bf"/><path d="M9.5 9.5a9.2 9.2 0 0 0 0 13" stroke="#5fe0bf"/><path d="M22.5 9.5a9.2 9.2 0 0 1 0 13" stroke="#5fe0bf"/><path d="M5 5a15.5 15.5 0 0 0 0 22" stroke="#eef4f1" opacity=".55"/><path d="M27 5a15.5 15.5 0 0 1 0 22" stroke="#eef4f1" opacity=".55"/></svg><span>${BRAND}<em>Studio</em></span></div>`;
  document.body.appendChild(d);setTimeout(()=>d.classList.add('go'),1000);setTimeout(()=>d.remove(),2000)})();
