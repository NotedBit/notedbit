/* Browser adaptation of three modes selected from the user's 2026 Python/pygame simulation source.
   It does not import or execute that desktop program. Uses fixed 60 Hz updates and an explicit seed. */
(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const canvas = $('sim'), ctx = canvas.getContext('2d');
  if (!ctx) return;
  const W = canvas.width, H = canvas.height, STEP = 1 / 60, TAU = Math.PI * 2;
  const colors = ['#a7edff','#f2a9dc','#e6d18f','#b0b4ff','#85e6c7','#f6bc91'];
  const clamp = (n,a,b) => Math.max(a,Math.min(b,n));
  const rngFactory = seed => { let n = (Number(seed) || 1) >>> 0; return () => { n = (1664525 * n + 1013904223) >>> 0; return n / 4294967296; }; };
  let rand, balls, particles, seconds, score, current, paused = false, rafLast = 0, accumulator = 0, ringR = 155, round = 0, nextRound = 0, nextRoundCount = 1;
  const speed = () => Number($('speed').value);
  const gravity = () => Number($('gravity').value);
  function ball(x,y,vx,vy,r=8) { return { x,y,vx,vy,r,color:colors[Math.floor(rand()*colors.length)],trail:[] }; }
  function spawn(x=180,y=300) { if (balls.length >= 80) return; let ang = rand()*TAU;balls.push(ball(x,y,Math.cos(ang)*speed(),Math.sin(ang)*speed(),8)); }
  function reset() {
    current = $('mode').value; rand = rngFactory($('seed').value); balls=[]; particles=[]; seconds=0;score=0;ringR=154;round=0;nextRound=0;nextRoundCount=1;accumulator=0;
    if (current === 'plinko') spawnPlinko(1); else if (current === 'escape') { spawn(205,184); balls[0].vx=15; balls[0].vy=-speed()*1.2; } else spawn(180,288);
    $('mode-label').textContent = $('mode').selectedOptions[0].textContent;
    updateStats(); draw();
  }
  function spawnPlinko(count) {for(let i=0;i<count && balls.length<80;i++) balls.push(ball(180+(rand()-.5)*46,90-i*.2,(rand()-.5)*35,0,7));}
  function bounce(b,nx,ny,restitution=.94) {
    const dot=b.vx*nx+b.vy*ny;
    if(dot>0){b.vx-= (1+restitution)*dot*nx;b.vy-= (1+restitution)*dot*ny;}
  }
  function spark(x,y,c) {for(let j=0;j<6;j++){const a=rand()*TAU;particles.push({x,y,vx:Math.cos(a)*60,vy:Math.sin(a)*60,t:.28,color:c});}}
  function integrate(b,dt,g) {b.vy+=g*dt;b.x+=b.vx*dt;b.y+=b.vy*dt;b.trail.push([b.x,b.y]);if(b.trail.length>13)b.trail.shift();}
  function sphereCollisions() { // Equal-mass pairwise collisions, capped for this browser showcase.
    for(let i=0;i<balls.length;i++) for(let j=i+1;j<balls.length;j++) {
      const a=balls[i],b=balls[j];const dx=b.x-a.x,dy=b.y-a.y,ds=dx*dx+dy*dy,min=a.r+b.r;
      if(ds>=min*min||ds<.000001)continue;
      const d=Math.sqrt(ds),nx=dx/d,ny=dy/d,overlap=(min-d)/2;
      a.x-=nx*overlap;a.y-=ny*overlap;b.x+=nx*overlap;b.y+=ny*overlap;
      const relative=(a.vx-b.vx)*nx+(a.vy-b.vy)*ny;
      if(relative>0){a.vx-=relative*nx*.96;a.vy-=relative*ny*.96;b.vx+=relative*nx*.96;b.vy+=relative*ny*.96;}
    }
  }
  function stepEscape(dt) {
    const opening=(seconds*.23-1.4)%TAU, halfGap=.16; let escaped=[];
    for(const b of balls){
      integrate(b,dt,gravity()); const dx=b.x-180,dy=b.y-325,dist=Math.hypot(dx,dy),max=153-b.r;
      if(dist>max){ const angle=Math.atan2(dy,dx);const diff=Math.atan2(Math.sin(angle-opening),Math.cos(angle-opening));
        if(Math.abs(diff)<halfGap){if(dist>160+b.r){escaped.push(b);spark(b.x,b.y,b.color);}continue;}
        const nx=dx/dist,ny=dy/dist; b.x=180+nx*max;b.y=325+ny*max;
        bounce(b,nx,ny);}
      // To keep the 60 Hz showcase lively while preserving the source's circular gap logic.
      b.vx=clamp(b.vx,-280,280);b.vy=clamp(b.vy,-280,280);
    }
    if(escaped.length){ balls=balls.filter(b=>!escaped.includes(b));for(const _ of escaped){score++;for(let i=0;i<3;i++)spawn(180+(rand()-.5)*45,310+(rand()-.5)*45);} }
    if(balls.length===0)spawn();sphereCollisions();
  }
  function stepShrinking(dt){
    ringR=Math.max(58,ringR-dt*3.6);
    for(const b of balls){integrate(b,dt,gravity());const dx=b.x-180,dy=b.y-324,dist=Math.hypot(dx,dy),max=ringR-b.r;
      if(dist>max){const nx=dx/dist,ny=dy/dist;b.x=180+nx*max;b.y=324+ny*max;bounce(b,nx,ny);score++;if(score%4===0){ringR=Math.min(155,ringR+15);spark(b.x,b.y,b.color);} }
      b.vx=clamp(b.vx,-300,300);b.vy=clamp(b.vy,-300,300);
    }
  }
  const pegs=[];for(let row=0;row<9;row++)for(let col=0;col<(row%2===0?8:7);col++)pegs.push([44+col*39+(row%2?19.5:0),185+row*42]);
  function stepPlinko(dt){
    if(!balls.length){if(seconds>=nextRound){round++;spawnPlinko(Math.min(30,Math.max(1,nextRoundCount)));}return;}
    const landed=[];
    for(const b of balls){integrate(b,dt,gravity()*1.5);b.vx*=1-.035*dt;
      if(b.x<25+b.r){b.x=25+b.r;b.vx=Math.abs(b.vx)*.92;}else if(b.x>335-b.r){b.x=335-b.r;b.vx=-Math.abs(b.vx)*.92;}
      for(const [x,y] of pegs){const dx=b.x-x,dy=b.y-y,d=Math.hypot(dx,dy),min=b.r+4.5;
        if(d<min && d>.01){const nx=dx/d,ny=dy/d;b.x=x+nx*min;b.y=y+ny*min;bounce(b,nx,ny,.88);b.vx+=(rand()-.5)*15;break;}}
      if(b.y>=555){landed.push(b);spark(b.x,548,b.color);score+=1;nextRoundCount=Math.min(30,nextRoundCount+(Math.floor(clamp((b.x-20)/(320/6),0,5))%3===2?2:1));}
    }
    if(landed.length){balls=balls.filter(b=>!landed.includes(b));if(!balls.length)nextRound=seconds+1.0;}
  }
  function step(dt){seconds+=dt;if(current==='escape')stepEscape(dt);else if(current==='plinko')stepPlinko(dt);else stepShrinking(dt);
    for(const p of particles){p.x+=p.vx*dt;p.y+=p.vy*dt;p.t-=dt;}particles=particles.filter(p=>p.t>0);}
  function arena(){ctx.save();ctx.strokeStyle='#354d63';ctx.lineWidth=3;
    if(current==='escape'){
      const opening=(seconds*.23-1.4)%TAU;
      ctx.beginPath();ctx.arc(180,325,153,opening+.16,opening+TAU-.16);ctx.stroke();
      ctx.strokeStyle='#7dbddc';ctx.lineWidth=5;ctx.beginPath();ctx.arc(180,325,153,opening+.17,opening+.3);ctx.stroke();
    }else if(current==='shrinking'){
      ctx.beginPath();ctx.arc(180,324,ringR,0,TAU);ctx.stroke();
      ctx.strokeStyle='#7fc7db';ctx.beginPath();ctx.arc(180,324,ringR,seconds%TAU,seconds%TAU+.6);ctx.stroke();
    }else{
      for(const [x,y] of pegs){ctx.beginPath();ctx.arc(x,y,4,0,TAU);ctx.fillStyle='#496785';ctx.fill();}
      ctx.fillStyle='#192839';ctx.fillRect(20,557,320,33);
      for(let j=1;j<6;j++){ctx.fillStyle='#56758c';ctx.fillRect(20+j*320/6,557,1,33);}
      const labels=['×2','×1','×3','×2','×1','×2'];ctx.font='12px system-ui';ctx.textAlign='center';ctx.fillStyle='#a8d2f1';labels.forEach((s,i)=>ctx.fillText(s,20+((i+.5)*320/6),577));
    } ctx.restore();}
  function draw(){ctx.clearRect(0,0,W,H);ctx.fillStyle='#080c13';ctx.fillRect(0,0,W,H);
    const g=ctx.createLinearGradient(0,0,360,640);g.addColorStop(0,'#152535');g.addColorStop(1,'#090a14');ctx.fillStyle=g;ctx.fillRect(0,0,360,640);
    ctx.strokeStyle='rgba(146,174,216,.055)';ctx.lineWidth=1;for(let x=0;x<360;x+=30){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,640);ctx.stroke();}
    arena();
    for(const b of balls){if(b.trail.length>1){for(let i=1;i<b.trail.length;i++){ctx.globalAlpha=i/b.trail.length*.27;ctx.strokeStyle=b.color;ctx.lineWidth=b.r*.65;ctx.beginPath();ctx.moveTo(...b.trail[i-1]);ctx.lineTo(...b.trail[i]);ctx.stroke();}ctx.globalAlpha=1;}
      ctx.shadowBlur=14;ctx.shadowColor=b.color;ctx.fillStyle=b.color;ctx.beginPath();ctx.arc(b.x,b.y,b.r,0,TAU);ctx.fill();ctx.shadowBlur=0;}
    for(const p of particles){ctx.globalAlpha=clamp(p.t/.28,0,1);ctx.fillStyle=p.color;ctx.fillRect(p.x,p.y,2,2);}ctx.globalAlpha=1;
    ctx.font='11px system-ui';ctx.textAlign='left';ctx.fillStyle='#8ea8bb';ctx.fillText('MODE / '+current.toUpperCase(),15,25);ctx.fillText('SEED / '+String($('seed').value),15,41);
  }
  let statsTimer=0;
  function updateStats(){ $('time').textContent=seconds.toFixed(1)+' s';$('count').textContent=String(balls.length);$('progress').textContent=String(score);$('status').textContent=paused?'Paused':'Running'; }
  function frame(now){ if(!rafLast)rafLast=now;let elapsed=Math.min((now-rafLast)/1000,.1);rafLast=now;
    if(!paused){accumulator+=elapsed;while(accumulator>=STEP){step(STEP);accumulator-=STEP;}statsTimer+=elapsed;if(statsTimer>.08){updateStats();statsTimer=0;}}
    draw();requestAnimationFrame(frame);}
  $('restart').addEventListener('click',()=>{reset();paused=false; $('toggle').textContent=document.documentElement.lang==='de'?'Pause':'Pause';});
  $('toggle').addEventListener('click',()=>{paused=!paused;$('toggle').textContent=paused?(document.documentElement.lang==='de'?'Weiter':'Resume'):'Pause';updateStats();});
  $('speed').addEventListener('input',()=>{$('speed-value').textContent=$('speed').value;});
  $('mode').addEventListener('change',reset);$('gravity').addEventListener('change',reset);$('seed').addEventListener('change',reset);
  // Preserve site language preference without depending on the parent site's scripts.
  let lang = null; try {lang=localStorage.getItem('notedbit-language')||localStorage.getItem('notedbit-lang');} catch(_) { /* storage can be disabled */ }
  if(lang==='de'){document.documentElement.lang='de';document.querySelectorAll('[data-de]').forEach(e=>e.textContent=e.dataset.de);}
  reset();requestAnimationFrame(frame);
})();
