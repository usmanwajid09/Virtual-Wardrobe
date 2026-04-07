gsap.registerPlugin(ScrollTrigger);

/* BG CANVAS */
(function(){const cv=document.getElementById('bg-cv'),ctx=cv.getContext('2d');let W,H,t=0;function r(){W=cv.width=window.innerWidth;H=cv.height=window.innerHeight}r();window.addEventListener('resize',r);const ls=[{amp:50,freq:.0025,sp:.6,c:'#0D5C3A',a:.05},{amp:35,freq:.003,sp:.8,c:'#C9A84C',a:.04},{amp:65,freq:.002,sp:.5,c:'#0D5C3A',a:.04},{amp:28,freq:.004,sp:1,c:'#C9A84C',a:.03},{amp:45,freq:.0018,sp:.4,c:'#178A56',a:.035}];function d(){ctx.clearRect(0,0,W,H);ls.forEach((l,i)=>{const y=H*(.12+i*.18);ctx.beginPath();for(let x=0;x<=W;x+=4){const yy=y+Math.sin(x*l.freq+t*l.sp*.05)*l.amp;x===0?ctx.moveTo(x,yy):ctx.lineTo(x,yy)}ctx.strokeStyle=l.c;ctx.globalAlpha=l.a;ctx.lineWidth=1.8;ctx.stroke()});ctx.globalAlpha=1;t++;requestAnimationFrame(d)}d()})();

/* HERO CANVAS */
(function(){const cv=document.getElementById('hero-cv');if(!cv)return;const ctx=cv.getContext('2d');function r(){cv.width=cv.offsetWidth;cv.height=cv.offsetHeight}r();window.addEventListener('resize',r);const it=['👗','👔','👖','🧥','👟','👜','🧣','💍'];const ps=it.map(e=>({e,x:Math.random()*cv.width,y:Math.random()*cv.height,vx:(Math.random()-.5)*.22,vy:(Math.random()-.5)*.22,sz:Math.random()*14+10,op:Math.random()*.1+.04,r:Math.random()*Math.PI*2,rs:(Math.random()-.5)*.007}));function d(){ctx.clearRect(0,0,cv.width,cv.height);ps.forEach(p=>{p.x+=p.vx;p.y+=p.vy;p.r+=p.rs;if(p.x<-30)p.x=cv.width+30;if(p.x>cv.width+30)p.x=-30;if(p.y<-30)p.y=cv.height+30;if(p.y>cv.height+30)p.y=-30;ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.r);ctx.globalAlpha=p.op;ctx.font=p.sz+'px serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(p.e,0,0);ctx.restore()});ctx.globalAlpha=1;requestAnimationFrame(d)}d()})();

/* HERO ENTRANCE */
window.addEventListener('DOMContentLoaded',()=>{
  gsap.timeline()
    .from('#nav',{y:-80,opacity:0,duration:.7,ease:'power3.out'})
    .from('#hero-iss',{opacity:0,y:20,duration:.6,ease:'power3.out'},'-=.3')
    .from('#hero-h1',{opacity:0,y:80,duration:.9,ease:'power4.out'},'-=.3')
    .from('#hero-desc',{opacity:0,y:30,duration:.6,ease:'power3.out'},'-=.4')
    .from('#hero-btns',{opacity:0,y:30,duration:.6,ease:'power3.out'},'-=.4')
    .from('#hero-met',{opacity:0,y:30,duration:.6,ease:'power3.out'},'-=.35')
    .from('#fc1',{opacity:0,x:50,duration:.7,ease:'back.out(1.6)'},'-=.3')
    .from('#fc2',{opacity:0,x:50,duration:.7,ease:'back.out(1.6)'},'-=.4');
  gsap.from('.marquee-strip',{scrollTrigger:{trigger:'.marquee-strip',start:'top 95%'},y:40,opacity:0,duration:.7});
});

/* CLIP REVEALS */
document.querySelectorAll('.clip-inner').forEach(el=>gsap.to(el,{scrollTrigger:{trigger:el,start:'top 88%'},y:0,duration:.85,ease:'power4.out'}));

/* SCROLL REVEALS */
function sr(sel,ex){document.querySelectorAll(sel).forEach(el=>{const d=parseFloat(getComputedStyle(el).getPropertyValue('--d'))||0;gsap.to(el,{scrollTrigger:{trigger:el,start:'top 88%'},opacity:1,x:0,y:0,duration:.75,delay:d,ease:'power3.out',...ex})})}
sr('.reveal-up');sr('.reveal-left');sr('.reveal-right');sr('.reveal-fade',{duration:.6});

/* FEATURES */
gsap.from('.feat-cell:not(.big)',{scrollTrigger:{trigger:'.feat-grid',start:'top 80%'},y:50,opacity:0,duration:.7,stagger:.1,ease:'power3.out'});
gsap.from('.feat-cell.big',{scrollTrigger:{trigger:'.feat-grid',start:'top 80%'},y:40,opacity:0,duration:.85,ease:'power3.out'});

/* NAV SHRINK */
ScrollTrigger.create({start:'top -60',onUpdate(s){document.getElementById('nav').style.height=s.progress>0?'56px':'70px'}});

/* PHONE */
gsap.to('#phonemock',{y:-14,duration:2.8,ease:'sine.inOut',repeat:-1,yoyo:true});
gsap.from('#phonemock',{scrollTrigger:{trigger:'#how',start:'top 75%'},x:50,opacity:0,duration:.85,ease:'power3.out'});

/* TEAM — staircase entrance */
gsap.from('.t-card',{scrollTrigger:{trigger:'.team-row',start:'top 82%'},y:80,opacity:0,stagger:.18,duration:.9,ease:'power3.out'});

/* VALUES — floating cards */
(function(){
  function floatCard(id,amp,dur,delay){
    gsap.to(id,{y:-amp,duration:dur,ease:'sine.inOut',repeat:-1,yoyo:true,delay});
    gsap.to(id,{rotate:1.5,duration:dur*1.3,ease:'sine.inOut',repeat:-1,yoyo:true,delay:delay+.2});
  }
  gsap.from(['.float-val'],{scrollTrigger:{trigger:'#values',start:'top 80%'},y:60,opacity:0,stagger:.14,duration:.8,ease:'back.out(1.5)',
    onComplete(){
      floatCard('#fv0',12,3.2,0);
      floatCard('#fv1',16,2.7,.6);
      floatCard('#fv2',10,3.8,1.1);
    }
  });
})();

/* MARQUEE */
const mi=document.getElementById('mi');
mi.addEventListener('mouseenter',()=>mi.style.animationPlayState='paused');
mi.addEventListener('mouseleave',()=>mi.style.animationPlayState='running');

/* EFFECT 1 — SPINNING SHIRT */
(function(){
  const PANELS=5;
  const panels=Array.from({length:PANELS},(_,i)=>document.getElementById('sp'+i));
  const sdots=Array.from({length:PANELS},(_,i)=>document.getElementById('sd'+i));
  const pbar=document.getElementById('shirt-pbar');
  const scCur=document.getElementById('sc-cur');
  const tl=gsap.timeline({scrollTrigger:{trigger:'#shirt-sticky',start:'50% 50%',endTrigger:'#shirt-wrap',end:'bottom 50%',scrub:1.2,pin:true}});
  tl.to('#shirt-svg',{rotateZ:900,ease:'none',transformOrigin:'50% 50%'});
  tl.to('.shirt-orbit',{rotateZ:-180,ease:'none'},0);
  tl.to('#shirt-shadow',{scaleX:1.5,opacity:.25,ease:'none'},0);
  ScrollTrigger.create({trigger:'#shirt-sticky',start:'50% 50%',endTrigger:'#shirt-wrap',end:'bottom 50%',scrub:true,
    onUpdate(self){
      pbar.style.width=(self.progress*100)+'%';
      const idx=Math.min(Math.floor(self.progress*PANELS),PANELS-1);
      scCur.textContent=idx+1;
      panels.forEach((p,i)=>p.classList.toggle('active',i===idx));
      sdots.forEach((d,i)=>d.classList.toggle('on',i===idx));
    }
  });
  gsap.from('#shirt-svg',{scrollTrigger:{trigger:'#shirt-wrap',start:'top 80%'},y:-80,opacity:0,duration:1,ease:'back.out(1.4)',rotateZ:-30});
  gsap.from('.shirt-orbit',{scrollTrigger:{trigger:'#shirt-wrap',start:'top 80%'},scale:0,opacity:0,duration:1,ease:'power3.out',delay:.2});
})();

/* EFFECT 2 — WARDROBE DOOR */
(function(){
  const tl=gsap.timeline({scrollTrigger:{trigger:'#wardrobe-sticky',start:'50% 50%',endTrigger:'#wardrobe-wrap',end:'bottom 50%',scrub:1,pin:true}});
  tl.to('#door-left',{rotateY:-115,ease:'power2.inOut'},0);
  tl.to('#door-right',{rotateY:115,ease:'power2.inOut'},0);
  tl.to('#wardrobe-int',{opacity:1,duration:.3},.5);
  tl.to('#wsc0',{opacity:1,x:0,duration:.3},.3);
  tl.to('#wsc1',{opacity:1,x:0,duration:.3},.45);
  tl.to('#wsc2',{opacity:1,x:0,duration:.3},.35);
  tl.to('#wsc3',{opacity:1,x:0,duration:.3},.5);
  gsap.from('.wardrobe-scene',{scrollTrigger:{trigger:'#wardrobe-wrap',start:'top 80%'},y:60,opacity:0,duration:.9,ease:'power3.out'});

  /* hanging clothes drop in when interior is revealed */
  gsap.set('.w-hang-item',{opacity:0,y:-40});
  ScrollTrigger.create({
    trigger:'#wardrobe-wrap',
    start:'30% top',
    once:true,
    onEnter(){
      gsap.to('.w-hang-item',{
        opacity:1,y:0,
        duration:.7,
        stagger:.12,
        ease:'back.out(1.8)',
        delay:.2
      });
      /* pulse the rail hook */
      gsap.to('.rail-hook',{
        boxShadow:'0 0 28px #C9A84C, 0 0 56px rgba(201,168,76,.6)',
        duration:.6,
        repeat:-1,
        yoyo:true,
        ease:'sine.inOut'
      });
    }
  });
})();

/* EFFECT 3 — HORIZONTAL LOOKBOOK */
(function(){
  const track=document.getElementById('lookbook-track');
  const N=4,prog=document.getElementById('lb-prog'),counter=document.getElementById('lb-cur'),hint=document.getElementById('lb-hint');
  const tl=gsap.timeline({scrollTrigger:{trigger:'#lookbook-wrap',start:'top top',end:()=>'+='+(window.innerWidth*(N-1)),scrub:1,pin:true,anticipatePin:1,
    onEnter:()=>gsap.to(hint,{opacity:1,duration:.5}),
    onLeave:()=>gsap.to(hint,{opacity:0,duration:.3}),
    onUpdate(self){prog.style.width=(self.progress*100)+'%';counter.textContent=Math.min(Math.floor(self.progress*N)+1,N)}
  }});
  tl.to(track,{x:()=>-(track.scrollWidth-window.innerWidth),ease:'none'});
})();

/* EFFECT 4 — WASHING LINE */
(function(){
  const track=document.getElementById('cl-track');
  const tl=gsap.timeline({scrollTrigger:{trigger:'#clothesline-sticky',start:'50% 50%',endTrigger:'#clothesline-wrap',end:'bottom 50%',scrub:1.4,pin:true}});
  tl.to(track,{x:()=>-(track.scrollWidth-window.innerWidth+200),ease:'none'});
  tl.to('.cl-title',{opacity:0,y:-20,ease:'none'},.6);
  gsap.from('.cl-item',{scrollTrigger:{trigger:'#clothesline-wrap',start:'top 80%'},y:-80,opacity:0,stagger:.08,duration:.7,ease:'back.out(1.4)'});
  gsap.from('.cl-rope',{scrollTrigger:{trigger:'#clothesline-wrap',start:'top 80%'},scaleX:0,duration:.8,ease:'power3.out',transformOrigin:'left center'});
})();

/* EFFECT 5 — TAILOR CUT */
(function(){
  const clipRect=document.getElementById('tcr'),scissors=document.getElementById('tailor-scissors'),thread=document.getElementById('tailor-thread');
  const VW=()=>window.innerWidth;
  const tl=gsap.timeline({scrollTrigger:{trigger:'#tailor-sticky',start:'50% 50%',endTrigger:'#tailor-wrap',end:'bottom 50%',scrub:1,pin:true}});
  tl.to(clipRect,{attr:{x:VW,width:0},ease:'none'},0);
  tl.to(scissors,{x:()=>VW()+60,ease:'none'},0);
  tl.to(thread,{opacity:.6,ease:'none'},0);
  tl.to(thread,{opacity:0,ease:'none'},.85);
  gsap.from('#tailor-cta',{scrollTrigger:{trigger:'#tailor-wrap',start:'top 60%'},y:30,opacity:0,duration:.8,ease:'back.out(1.6)',delay:.4});
  gsap.from('.ts-val',{scrollTrigger:{trigger:'#tailor-wrap',start:'top 60%'},scale:.5,opacity:0,stagger:.15,duration:.7,ease:'back.out(2)'});
})();

/* WINDMILL */
(function(){
  const steps=[document.getElementById('ps0'),document.getElementById('ps1'),document.getElementById('ps2'),document.getElementById('ps3')];
  const dots=[document.getElementById('pd0'),document.getElementById('pd1'),document.getElementById('pd2'),document.getElementById('pd3')];
  const tl=gsap.timeline({scrollTrigger:{scrub:1,pin:true,trigger:'#pin-windmill',start:'50% 50%',endTrigger:'#pin-windmill-wrap',end:'bottom 50%'}});
  tl.to('#pin-windmill-svg',{rotateZ:900,ease:'none'});
  tl.to('.pin-ring',{scale:1.1,opacity:.5,stagger:.15,ease:'none'},0);
  ScrollTrigger.create({trigger:'#pin-windmill',start:'50% 50%',endTrigger:'#pin-windmill-wrap',end:'bottom 50%',scrub:true,
    onUpdate(self){
      const idx=Math.min(Math.floor(self.progress*4),3);
      steps.forEach((s,i)=>{gsap.to(s,i===idx?{opacity:1,y:0,duration:.35,ease:'power2.out'}:{opacity:0,y:20,duration:.25})});
      dots.forEach((d,i)=>d.classList.toggle('on',i===idx));
    }
  });
  gsap.from('#pin-windmill-svg',{scrollTrigger:{trigger:'#pin-windmill-wrap',start:'top 80%'},scale:.4,opacity:0,duration:1,ease:'back.out(1.6)'});
  gsap.from('.pin-ring',{scrollTrigger:{trigger:'#pin-windmill-wrap',start:'top 80%'},scale:0,opacity:0,stagger:.15,duration:.8,ease:'power3.out'});
})();

/* FORM */
document.getElementById('fsend').addEventListener('click',function(){
  gsap.to(this,{scale:.95,duration:.08,yoyo:true,repeat:1});
  setTimeout(()=>{this.textContent="✓ You're on the waitlist!";this.style.background='#178A56';this.style.color='#fff';this.disabled=true;setTimeout(()=>{this.textContent='Join the Waitlist →';this.style.background='';this.style.color='';this.disabled=false},4000)},200);
});