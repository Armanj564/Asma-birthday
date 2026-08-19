(() => {
  "use strict";

  const canvas = document.getElementById("sky");
  const ctx = canvas.getContext("2d", { alpha: false });
  const welcome = document.getElementById("welcome");
  const birthday = document.getElementById("birthday");
  const openBtn = document.getElementById("openBtn");
  const wishBtn = document.getElementById("wishBtn");
  const tip = document.getElementById("installTip");
  const closeTip = document.getElementById("closeTip");

  let W=0,H=0,dpr=1,particles=[],running=true;
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

  function resize(){
    dpr=Math.min(devicePixelRatio||1,1.5);
    W=innerWidth; H=innerHeight;
    canvas.width=Math.floor(W*dpr); canvas.height=Math.floor(H*dpr);
    ctx.setTransform(dpr,0,0,dpr,0,0);
    const count = reduced ? 35 : Math.min(95, Math.max(45, Math.floor(W*H/11000)));
    particles=Array.from({length:count},()=>newParticle(true));
  }
  function newParticle(initial=false){
    return {
      x:Math.random()*W, y:initial?Math.random()*H:H+10,
      r:Math.random()*1.35+.25, a:Math.random()*.55+.15,
      vx:(Math.random()-.5)*.08, vy:-(Math.random()*.18+.035),
      tw:Math.random()*Math.PI*2, ts:Math.random()*.018+.006
    };
  }
  function frame(){
    if(!running)return;
    ctx.fillStyle="#080817"; ctx.fillRect(0,0,W,H);
    for(const p of particles){
      p.y+=p.vy;p.x+=p.vx;p.tw+=p.ts;
      if(p.y<-5||p.x<-5||p.x>W+5)Object.assign(p,newParticle());
      const alpha=p.a*(.65+.35*Math.sin(p.tw));
      ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
      ctx.fillStyle=`rgba(220,207,255,${alpha})`;ctx.fill();
    }
    requestAnimationFrame(frame);
  }
  resize(); addEventListener("resize",resize,{passive:true}); frame();

  function chime(){
    try{
      const AC=window.AudioContext||window.webkitAudioContext;
      if(!AC)return;
      const ac=new AC(), now=ac.currentTime;
      [523.25,659.25,783.99].forEach((f,i)=>{
        const o=ac.createOscillator(),g=ac.createGain();
        o.type="sine";o.frequency.value=f;
        g.gain.setValueAtTime(.0001,now+i*.07);
        g.gain.exponentialRampToValueAtTime(.045,now+i*.07+.02);
        g.gain.exponentialRampToValueAtTime(.0001,now+i*.07+.55);
        o.connect(g).connect(ac.destination);o.start(now+i*.07);o.stop(now+i*.07+.6);
      });
    }catch(_){}
  }

  function launchBurst(){
    const colors=["rgba(255,255,255,","rgba(203,177,255,","rgba(165,214,255,"];
    const dots=Array.from({length:reduced?20:65},()=>({
      x:W/2,y:H/2,vx:(Math.random()-.5)*7,vy:(Math.random()-.5)*7-1,
      life:1,r:Math.random()*2+1,c:colors[(Math.random()*colors.length)|0]
    }));
    let start=performance.now();
    function burst(t){
      const dt=(t-start)/1000; start=t;
      ctx.save();ctx.globalCompositeOperation="lighter";
      for(const d of dots){
        d.x+=d.vx;d.y+=d.vy;d.vy+=.045;d.life-=dt*.7;
        if(d.life>0){ctx.beginPath();ctx.arc(d.x,d.y,d.r,0,Math.PI*2);ctx.fillStyle=d.c+d.life+")";ctx.fill();}
      }
      ctx.restore();
      if(dots.some(d=>d.life>0))requestAnimationFrame(burst);
    }
    requestAnimationFrame(burst);
  }

  openBtn.addEventListener("click",()=>{
    chime(); launchBurst();
    welcome.classList.remove("active");
    birthday.classList.add("active");
    birthday.setAttribute("aria-hidden","false");
    setTimeout(()=>{ if(isIOS() && !isStandalone()) tip.hidden=false; },1800);
  });

  wishBtn.addEventListener("click",()=>{
    chime(); launchBurst();
    wishBtn.textContent="✨ WISH SENT ✨";
    wishBtn.disabled=true;
    setTimeout(()=>{wishBtn.textContent="MAKE A WISH ✦";wishBtn.disabled=false},1800);
  });
  closeTip.addEventListener("click",()=>tip.hidden=true);

  function isIOS(){return /iPad|iPhone|iPod/.test(navigator.userAgent)||(/Macintosh/.test(navigator.userAgent)&&navigator.maxTouchPoints>1)}
  function isStandalone(){return window.matchMedia("(display-mode: standalone)").matches||navigator.standalone===true}

  if("serviceWorker" in navigator) addEventListener("load",()=>navigator.serviceWorker.register("./service-worker.js").catch(()=>{}));

  // Prevent accidental overscroll/zoom gestures while keeping normal taps.
  document.addEventListener("gesturestart",e=>e.preventDefault(),{passive:false});
})();
