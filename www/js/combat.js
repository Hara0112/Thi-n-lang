'use strict';
const cv=$('#cv'),g=cv.getContext('2d'),W=960,H=540,AX0=20,AX1=W-20,AY0=60,AY1=H-20;
let sc=1;function rs(){sc=Math.min(innerWidth/W,innerHeight/H);cv.style.width=W*sc+'px';cv.style.height=H*sc+'px';}
addEventListener('resize',rs);rs();
try{screen.orientation.lock('landscape').catch(()=>{});}catch(e){}
const C={on:false,over:true,pause:false},IN={js:null,btn:{}};
const BTN={atk:{x:860,y:440,r:46},dash:{x:770,y:485,r:28},s0:{x:755,y:410,r:28},s1:{x:785,y:340,r:28},s2:{x:840,y:290,r:28},s3:{x:910,y:270,r:28},pause:{x:36,y:34,r:20}};
const IC={atk:'⚔️',dash:'💨',s0:SK[0].i,s1:SK[1].i,s2:SK[2].i,s3:SK[3].i,pause:'⏸'};
const ET={
 ghoul:{r:16,hp:1,dmg:1,sp:95,col:'#7a3b8f',wind:.55,rng:34,cd:1.1,kind:'melee'},
 archer:{r:14,hp:.7,dmg:.9,sp:70,col:'#3b8f6a',wind:.7,rng:300,cd:2,kind:'shoot'},
 golem:{r:26,hp:3,dmg:1.8,sp:55,col:'#8f7a3b',wind:1,rng:60,cd:2.2,kind:'slam'},
 boss:{r:40,hp:12,dmg:1.6,sp:70,col:'#c0392b',wind:.8,rng:90,cd:1.5,kind:'boss'}};
const ang=(a,b)=>{let d=a-b;d=((d+Math.PI)%(2*Math.PI)+2*Math.PI)%(2*Math.PI)-Math.PI;return Math.abs(d);};
const pt=e=>{const b=cv.getBoundingClientRect();return{x:(e.clientX-b.left)/sc,y:(e.clientY-b.top)/sc};};
cv.addEventListener('pointerdown',e=>{if(!C.on)return;e.preventDefault();const p=pt(e);
 if(C.pause){if(p.x<480)C.pause=false;else{C.pause=false;fleeCombat();}return;}
 if(C.over)return;
 for(const k in BTN){const b=BTN[k];if(Math.hypot(p.x-b.x,p.y-b.y)<b.r+10){IN.btn[k]=e.pointerId;press(k);return;}}
 if(p.x<480&&!IN.js)IN.js={id:e.pointerId,ox:p.x,oy:p.y,x:p.x,y:p.y};});
cv.addEventListener('pointermove',e=>{if(IN.js&&IN.js.id===e.pointerId){const p=pt(e);IN.js.x=p.x;IN.js.y=p.y;}});
const upEv=e=>{if(IN.js&&IN.js.id===e.pointerId)IN.js=null;for(const k in IN.btn)if(IN.btn[k]===e.pointerId)delete IN.btn[k];};
cv.addEventListener('pointerup',upEv);cv.addEventListener('pointercancel',upEv);
function press(k){if(k==='pause'){C.pause=true;delete IN.btn.pause;return;}if(k==='dash')return dash();if(k[0]==='s')castSkill(+k[1]);}
function startCombat(kind,z,lvl){const st=stats();
 const pw=kind==='tower'?1.3*(1+.28*(lvl-1)):1+.22*(lvl-1);
 Object.assign(C,{on:true,over:false,pause:false,kind,z,lvl,pw,boss:lvl%5===0,wave:0,waves:3,st,en:[],pr:[],fx:[],tx:[],tm:[],hs:0,shake:0,t:0,sp:false,banner:null,flash:0,loot:{gold:0,m:{},gear:[],kills:0},rw:null,win:false});
 C.P={x:W/2,y:H/2,r:14,hp:st.hp,mhp:st.hp,sh:0,inv:0,dashT:0,ddx:1,ddy:0,dcd:0,face:0,cb:0,cbt:0,at:0,cds:[0,0,0,0],buff:0};
 IN.js=null;IN.btn={};$('#ui').style.display='none';$('#modal').style.display='none';cv.style.display='block';spawnWave();}
function fleeCombat(){C.over=true;C.on=false;cv.style.display='none';$('#ui').style.display='flex';save();render();}
function txt(x,y,s,col,big){C.tx.push({x,y,s,col,big,t:.8});}
function spark(x,y,col){const a=R(0,6.28),v=R(60,220);C.fx.push({k:'sp',x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v,t:.35,T:.35,col});}
function ring(x,y,r,col){C.fx.push({k:'ring',x,y,r,t:.35,T:.35,col});}
function after(t,f){C.tm.push({t,f});}
function nearest(o,m){let b=null,bd=m;for(const e of C.en){const d=Math.hypot(e.x-o.x,e.y-o.y);if(d<bd){bd=d;b=e;}}return b;}
function mk(ty){const T=ET[ty],a=R(0,6.283);
 const x=cl(W/2+Math.cos(a)*R(250,420),AX0+30,AX1-30),y=cl(H/2+Math.sin(a)*R(150,220),AY0+30,AY1-30),hp=60*T.hp*C.pw;
 C.en.push({T,ty,x,y,r:T.r,hp,mhp:hp,dmg:12*T.dmg*C.pw,sp:T.sp,st:'move',wt:0,rt:0,cdt:R(.5,1.5),kx:0,ky:0,fl:0,stun:0,spw:.7,ch:0,cx:0,cy:0,pi:0,pat:0,ax:0,ay:0,dead:false});}
function spawnWave(){C.wave++;if(C.wave>C.waves)return endCombat(true);const last=C.wave===C.waves;
 C.banner={t:1.6,s:last&&C.boss?'⚠ BOSS ⚠':'Đợt '+C.wave+'/'+C.waves};
 if(last&&C.boss){mk('boss');mk('ghoul');mk('ghoul');return;}
 const n=Math.min(9,3+C.wave+(C.lvl/6|0));
 for(let i=0;i<n;i++)mk(i%3===2&&(C.wave>1||C.lvl>5)?'archer':(C.wave===3&&i%4===3?'golem':'ghoul'));}
function hurt(raw){const p=C.P,s=C.st;if(p.inv>0||C.over)return;let d=Math.max(1,raw*100/(100+s.def));p.inv=.5;
 if(p.sh>0){const a=Math.min(p.sh,d);p.sh-=a;d-=a;}
 p.hp-=d;C.shake=Math.max(C.shake,6);C.flash=.35;txt(p.x,p.y-20,Math.round(d),'#f66',false);
 if(p.hp<=0){p.hp=0;endCombat(false);}}
function dmgE(e,m,kb,an){if(e.spw>0||e.dead)return;const s=C.st,p=C.P,cr=Math.random()<s.cr;
 const d=s.atk*(p.buff>0?1.3:1)*m*R(.92,1.08)*(cr?s.cd:1);e.hp-=d;e.fl=.1;
 const f=e.ty==='boss'?.15:e.ty==='golem'?.4:1;e.kx+=Math.cos(an)*kb*f;e.ky+=Math.sin(an)*kb*f;
 txt(e.x,e.y-e.r,Math.round(d),cr?'#ffd34d':'#fff',cr);
 C.hs=Math.max(C.hs,cr?.07:.035);C.shake=Math.max(C.shake,cr?7:3);
 for(let i=0;i<(cr?10:5);i++)spark(e.x,e.y,cr?'#ffd34d':s.col);
 if(e.hp<=0)kill(e);}
function kill(e){if(e.dead)return;e.dead=true;C.en.splice(C.en.indexOf(e),1);for(let i=0;i<14;i++)spark(e.x,e.y,e.T.col);
 const L=C.loot,z=C.kind==='tower'?-1:C.z,lv=C.lvl,b=e.ty==='boss';
 const gd=Math.floor(RI(4,9)*(1+lv*.15)*(b?8:1));S.gold+=gd;L.gold+=gd;L.kills++;
 const mat=(k,n)=>{S.mats[k]=(S.mats[k]||0)+n;L.m[k]=(L.m[k]||0)+n;};
 if((z===0||z===-1)&&Math.random()<.7)mat('qi',RI(1,3));
 if((z===1||z===-1)&&Math.random()<.7)mat('ore',RI(1,3));
 if(z===2&&Math.random()<.3)mat('asc',1);
 if(S.gear.length<250&&Math.random()<(b?1:z===2?.3:.1)){const it=genGear(Math.max(1,Math.ceil(lv/2)),b?2:0);S.gear.push(it);L.gear.push(it);}
 track('kill');}
function aoe(x,y,r,m,kb,stun){for(const e of [...C.en])if(Math.hypot(e.x-x,e.y-y)<r+e.r){dmgE(e,m,kb,Math.atan2(e.y-y,e.x-x));if(stun)e.stun=stun;}}
function attack(){const p=C.P,s=C.st,t=nearest(p,240);if(t)p.face=Math.atan2(t.y-p.y,t.x-p.x);
 p.cb=p.cbt>0?(p.cb+1)%3:0;p.cbt=.7;const big=p.cb===2,rng=big?105:80,arc=big?2.4:1.7;
 p.at=.36/(s.aspd*(p.buff>0?1.2:1))*(big?1.3:1);p.x+=Math.cos(p.face)*8;p.y+=Math.sin(p.face)*8;
 C.fx.push({k:'slash',x:p.x,y:p.y,a:p.face,r:rng,arc,t:.14,T:.14,col:big?'#ffd34d':s.col});
 for(const e of [...C.en]){const d=Math.hypot(e.x-p.x,e.y-p.y);if(d<rng+e.r){const an=Math.atan2(e.y-p.y,e.x-p.x);if(ang(an,p.face)<arc/2||d<e.r+20)dmgE(e,big?1.6:1,big?260:120,an);}}}
function dash(){const p=C.P;if(p.dcd>0||p.dashT>0)return;let dx=Math.cos(p.face),dy=Math.sin(p.face);
 if(IN.js){const a=IN.js.x-IN.js.ox,b=IN.js.y-IN.js.oy,d=Math.hypot(a,b);if(d>6){dx=a/d;dy=b/d;}}
 p.ddx=dx;p.ddy=dy;p.dashT=.18;p.inv=.32;p.dcd=C.st.dcd;}
function castSkill(i){const p=C.P;if(S.realm<SKU[i]||p.cds[i]>0)return;p.cds[i]=SK[i].cd;
 if(i===0){const t=nearest(p,400);if(t)p.face=Math.atan2(t.y-p.y,t.x-p.x);
  C.pr.push({own:'p',x:p.x,y:p.y,vx:Math.cos(p.face)*520,vy:Math.sin(p.face)*520,r:26,m:2.2,life:.9,pierce:true,hit:new Set(),col:C.st.col});C.shake=Math.max(C.shake,3);}
 else if(i===1){ring(p.x,p.y,140,'#8ff');aoe(p.x,p.y,140,3,320,1.2);C.shake=Math.max(C.shake,8);C.hs=Math.max(C.hs,.08);}
 else if(i===2){const ts=C.en.length?C.en:[{x:p.x+60,y:p.y}];
  for(let k=0;k<6;k++){const t=ts[k%ts.length],x=t.x+R(-30,30),y=t.y+R(-30,30);
   after(.1*k,()=>{C.fx.push({k:'sword',x,y,t:.3,T:.3});after(.3,()=>{aoe(x,y,60,1.5,150,0);ring(x,y,60,'#7df');C.shake=Math.max(C.shake,4);});});}}
 else{p.sh=p.mhp*.35;p.buff=6;p.hp=Math.min(p.mhp,p.hp+p.mhp*.15);ring(p.x,p.y,70,'#ffd34d');}}
function shoot(e,tx,ty,sp,dm){const a=Math.atan2(ty-e.y,tx-e.x);C.pr.push({own:'e',x:e.x,y:e.y,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp,r:7,dmg:dm,life:3});}
function strike(e){const p=C.P,K=e.T.kind,d=Math.hypot(p.x-e.x,p.y-e.y);
 if(K==='melee'){ring(e.x,e.y,e.T.rng+20,'#f55');if(d<e.T.rng+p.r+10)hurt(e.dmg);}
 else if(K==='slam'){ring(e.x,e.y,95,'#fa5');C.shake=Math.max(C.shake,6);if(d<95+p.r)hurt(e.dmg);}
 else if(K==='shoot')shoot(e,e.ax,e.ay,260,e.dmg);
 else if(e.pat===0){ring(e.x,e.y,130,'#f33');C.shake=Math.max(C.shake,9);if(d<130+p.r)hurt(e.dmg);}
 else if(e.pat===1){for(let i=0;i<12;i++){const a=i/12*6.283+e.pi;shoot(e,e.x+Math.cos(a),e.y+Math.sin(a),210,e.dmg*.6);}}
 else{const a=Math.atan2(e.ay-e.y,e.ax-e.x);e.cx=Math.cos(a);e.cy=Math.sin(a);e.ch=.45;}
 e.st='rec';e.rt=.5;e.cdt=e.T.cd;}
function fxStep(dt){for(const f of C.fx){f.t-=dt;if(f.k==='sp'){f.x+=f.vx*dt;f.y+=f.vy*dt;}}C.fx=C.fx.filter(f=>f.t>0);
 for(const t of C.tx){t.t-=dt;t.y-=30*dt;}C.tx=C.tx.filter(t=>t.t>0);if(C.flash>0)C.flash-=dt;}
function update(dt){if(C.pause)return;fxStep(dt);if(C.over)return;
 const p=C.P,s=C.st;C.t+=dt;
 for(const k of['inv','at','cbt','dcd','buff'])p[k]-=dt;for(let i=0;i<4;i++)p.cds[i]=Math.max(0,p.cds[i]-dt);
 if(p.buff<=0)p.sh=0;
 if(C.banner){C.banner.t-=dt;if(C.banner.t<=0)C.banner=null;}
 for(const m of C.tm)m.t-=dt;const due=C.tm.filter(m=>m.t<=0);C.tm=C.tm.filter(m=>m.t>0);due.forEach(m=>m.f());
 let mx=0,my=0;
 if(IN.js){const dx=IN.js.x-IN.js.ox,dy=IN.js.y-IN.js.oy,d=Math.hypot(dx,dy);if(d>6){const m=Math.min(d,60)/60;mx=dx/d*m;my=dy/d*m;}}
 if(p.dashT>0){p.dashT-=dt;p.x+=p.ddx*720*dt;p.y+=p.ddy*720*dt;C.fx.push({k:'trail',x:p.x,y:p.y,t:.2,T:.2,col:s.col});}
 else{p.x+=mx*190*dt;p.y+=my*190*dt;if(mx||my)p.face=Math.atan2(my,mx);}
 p.x=cl(p.x,AX0+p.r,AX1-p.r);p.y=cl(p.y,AY0+p.r,AY1-p.r);
 if(IN.btn.atk!==undefined&&p.at<=0&&p.dashT<=0)attack();
 for(const e of [...C.en]){if(e.dead)continue;e.fl-=dt;e.stun-=dt;e.cdt-=dt;e.spw-=dt;
  e.x+=e.kx*dt;e.y+=e.ky*dt;const f=Math.max(0,1-9*dt);e.kx*=f;e.ky*=f;
  e.x=cl(e.x,AX0+e.r,AX1-e.r);e.y=cl(e.y,AY0+e.r,AY1-e.r);
  if(e.stun>0||e.spw>0)continue;
  const dx=p.x-e.x,dy=p.y-e.y,d=Math.hypot(dx,dy)||1;
  if(e.ch>0){e.ch-=dt;e.x+=e.cx*620*dt;e.y+=e.cy*620*dt;if(d<e.r+p.r)hurt(e.dmg*1.2);continue;}
  const K=e.T.kind;
  if(e.st==='move'){
   if(K==='shoot'&&d<180){e.x-=dx/d*e.sp*dt;e.y-=dy/d*e.sp*dt;}
   else if(d>(K==='shoot'?260:e.T.rng*.8)){e.x+=dx/d*e.sp*dt;e.y+=dy/d*e.sp*dt;}
   if(d<=(K==='shoot'?330:e.T.rng+p.r)&&e.cdt<=0){e.st='wind';e.wt=e.T.wind;e.ax=p.x;e.ay=p.y;if(K==='boss')e.pat=e.pi++%3;}}
  else if(e.st==='wind'){e.wt-=dt;if(e.wt<=0)strike(e);}
  else{e.rt-=dt;if(e.rt<=0)e.st='move';}}
 for(const q of [...C.pr]){q.x+=q.vx*dt;q.y+=q.vy*dt;q.life-=dt;
  if(q.own==='e'){if(Math.hypot(q.x-p.x,q.y-p.y)<q.r+p.r){hurt(q.dmg);q.life=0;}}
  else for(const e of [...C.en]){if(!q.hit.has(e)&&Math.hypot(q.x-e.x,q.y-e.y)<q.r+e.r){q.hit.add(e);dmgE(e,q.m,200,Math.atan2(q.vy,q.vx));if(!q.pierce){q.life=0;break;}}}
  if(q.x<AX0||q.x>AX1||q.y<AY0||q.y>AY1)q.life=0;}
 C.pr=C.pr.filter(q=>q.life>0);
 if(!C.en.length&&!C.over&&!C.sp){C.sp=true;after(.8,()=>{C.sp=false;if(!C.over)spawnWave();});}}
function endCombat(win){if(C.over)return;C.over=true;const rw={gold:0,gems:0,m:{}};
 if(win){if(C.kind==='tower'){rw.gems=40+C.lvl*6;rw.gold=C.lvl*100;if(C.boss){rw.m.asc=3;rw.m.core=1+(C.lvl/10|0);}if(C.lvl===S.tower)S.tower++;track('tower');}
  else{rw.gold=C.lvl*60;rw.gems=15+C.lvl*3;if(C.boss)rw.m.core=1+(C.lvl/10|0);
   if(C.lvl===S.zone[C.z]&&S.zone[C.z]<40){S.zone[C.z]++;rw.gems+=50;if(typeof sel!=='undefined')sel[C.z]=S.zone[C.z];}track('clear');}
  give(rw);}
 C.rw=rw;C.win=win;IN.js=null;IN.btn={};save();setTimeout(showResult,900);}
function tele(e){const P=C.P,k=1-e.wt/e.T.wind,K=e.T.kind;g.fillStyle='rgba(255,40,40,'+(.12+.25*k)+')';g.strokeStyle='rgba(255,80,80,.8)';g.lineWidth=4;
 const circ=r=>{g.beginPath();g.arc(e.x,e.y,r,0,7);g.fill();g.stroke();},line=()=>{g.beginPath();g.moveTo(e.x,e.y);g.lineTo(e.ax,e.ay);g.stroke();};
 if(K==='melee')circ(e.T.rng+P.r+10);else if(K==='slam')circ(95);else if(K==='shoot')line();
 else if(e.pat===0)circ(130);else if(e.pat===1){g.beginPath();g.arc(e.x,e.y,60+k*60,0,7);g.stroke();}else{g.lineWidth=14;line();}}
function draw(){const P=C.P;g.save();g.clearRect(0,0,W,H);if(C.shake>0)g.translate(R(-1,1)*C.shake,R(-1,1)*C.shake);
 g.fillStyle='#0d0b17';g.fillRect(-20,-20,W+40,H+40);g.strokeStyle='#1d1830';g.lineWidth=1;
 for(let x=AX0;x<=AX1;x+=40){g.beginPath();g.moveTo(x,AY0);g.lineTo(x,AY1);g.stroke();}
 for(let y=AY0;y<=AY1;y+=40){g.beginPath();g.moveTo(AX0,y);g.lineTo(AX1,y);g.stroke();}
 g.strokeStyle='#5b3b9a';g.lineWidth=3;g.strokeRect(AX0,AY0,AX1-AX0,AY1-AY0);
 for(const e of C.en)if(e.st==='wind')tele(e);
 for(const e of C.en){g.globalAlpha=e.spw>0?.4:1;g.fillStyle=e.fl>0?'#fff':e.T.col;g.beginPath();g.arc(e.x,e.y,e.r,0,7);g.fill();
  g.fillStyle='#fe5';g.fillRect(e.x-e.r*.45,e.y-e.r*.25,e.r*.25,e.r*.25);g.fillRect(e.x+e.r*.2,e.y-e.r*.25,e.r*.25,e.r*.25);g.globalAlpha=1;
  if(e.stun>0){g.font='16px sans-serif';g.textAlign='center';g.fillText('💫',e.x,e.y-e.r-14);}
  g.fillStyle='#000a';g.fillRect(e.x-e.r,e.y-e.r-9,e.r*2,5);g.fillStyle='#e33';g.fillRect(e.x-e.r,e.y-e.r-9,e.r*2*Math.max(0,e.hp/e.mhp),5);}
 for(const q of C.pr){g.fillStyle=q.own==='e'?'#f55':C.st.col;g.globalAlpha=q.own==='e'?1:.8;g.beginPath();g.arc(q.x,q.y,q.r,0,7);g.fill();g.globalAlpha=1;}
 g.globalAlpha=P.inv>0?.55:1;g.fillStyle=C.st.col;g.beginPath();g.arc(P.x,P.y,P.r,0,7);g.fill();
 g.strokeStyle='#fff';g.lineWidth=4;g.beginPath();g.moveTo(P.x,P.y);g.lineTo(P.x+Math.cos(P.face)*26,P.y+Math.sin(P.face)*26);g.stroke();g.globalAlpha=1;
 if(P.sh>0){g.strokeStyle='#6cf';g.lineWidth=3;g.beginPath();g.arc(P.x,P.y,P.r+7,0,7);g.stroke();}
 for(const f of C.fx){const a=Math.max(0,f.t/f.T);g.globalAlpha=a;
  if(f.k==='slash'){g.strokeStyle=f.col;g.lineWidth=10*a+2;g.beginPath();g.arc(f.x,f.y,f.r*.8,f.a-f.arc/2,f.a+f.arc/2);g.stroke();}
  else if(f.k==='ring'){g.strokeStyle=f.col;g.lineWidth=5;g.beginPath();g.arc(f.x,f.y,f.r*(1-a*.9),0,7);g.stroke();}
  else if(f.k==='sp'){g.fillStyle=f.col;g.fillRect(f.x,f.y,4,4);}
  else if(f.k==='sword'){g.strokeStyle='#9ef';g.lineWidth=5;g.beginPath();g.moveTo(f.x,f.y-160*a);g.lineTo(f.x,f.y-160*a+40);g.stroke();}
  else{g.fillStyle=f.col;g.beginPath();g.arc(f.x,f.y,P.r*a,0,7);g.fill();}g.globalAlpha=1;}
 g.textAlign='center';for(const t of C.tx){g.globalAlpha=Math.min(1,t.t*2);g.fillStyle=t.col;g.font=(t.big?'bold 22px':'15px')+' sans-serif';g.fillText(t.s,t.x,t.y);}g.globalAlpha=1;
 if(C.flash>0){g.fillStyle='rgba(255,0,0,'+C.flash*.5+')';g.fillRect(0,0,W,H);}
 g.restore();hud();}
function hud(){const p=C.P;g.textBaseline='alphabetic';g.fillStyle='#000a';g.fillRect(70,14,260,18);g.fillStyle='#d33';g.fillRect(70,14,260*Math.max(0,p.hp/p.mhp),18);
 if(p.sh>0){g.fillStyle='#6cf';g.fillRect(70,14,260*Math.min(1,p.sh/p.mhp),5);}
 g.fillStyle='#fff';g.font='12px sans-serif';g.textAlign='left';g.fillText(Math.ceil(p.hp)+'/'+Math.ceil(p.mhp),76,27);
 g.fillText(C.kind==='tower'?'Trấn Yêu Tháp tầng '+C.lvl:ZONES[C.z].n+' cấp '+C.lvl,350,27);
 const bo=C.en.find(e=>e.ty==='boss');if(bo){g.fillStyle='#000a';g.fillRect(300,40,360,10);g.fillStyle='#c0392b';g.fillRect(300,40,360*Math.max(0,bo.hp/bo.mhp),10);}
 for(const k in BTN){const b=BTN[k];let fr=0,lock=false,rem=0;
  if(k[0]==='s'){const i=+k[1];lock=S.realm<SKU[i];rem=p.cds[i];fr=rem/SK[i].cd;}else if(k==='dash'){rem=Math.max(0,p.dcd);fr=rem/C.st.dcd;}
  const down=IN.btn[k]!==undefined;g.globalAlpha=lock?.35:.85;g.fillStyle=down?'#6a4bd6':'#2a2050';g.strokeStyle='#b9a0ff';g.lineWidth=3;
  g.beginPath();g.arc(b.x,b.y,b.r*(down?.94:1),0,7);g.fill();g.stroke();g.globalAlpha=1;
  g.font=Math.floor(b.r*.85)+'px sans-serif';g.textAlign='center';g.textBaseline='middle';g.fillStyle='#fff';g.fillText(lock?'🔒':IC[k],b.x,b.y);
  if(fr>0&&!lock){g.fillStyle='#000a';g.beginPath();g.moveTo(b.x,b.y);g.arc(b.x,b.y,b.r,-Math.PI/2,-Math.PI/2+6.283*Math.min(1,fr));g.closePath();g.fill();g.fillStyle='#fff';g.font='14px sans-serif';g.fillText(rem.toFixed(1),b.x,b.y);}}
 g.textBaseline='alphabetic';
 if(IN.js){g.strokeStyle='#fff6';g.lineWidth=3;g.beginPath();g.arc(IN.js.ox,IN.js.oy,60,0,7);g.stroke();
  const dx=IN.js.x-IN.js.ox,dy=IN.js.y-IN.js.oy,d=Math.min(60,Math.hypot(dx,dy)),a=Math.atan2(dy,dx);g.fillStyle='#fff8';g.beginPath();g.arc(IN.js.ox+Math.cos(a)*d,IN.js.oy+Math.sin(a)*d,24,0,7);g.fill();}
 if(C.banner){g.globalAlpha=Math.min(1,C.banner.t);g.fillStyle='#fff';g.font='bold 40px sans-serif';g.textAlign='center';g.fillText(C.banner.s,W/2,150);g.globalAlpha=1;}
 if(C.pause){g.fillStyle='#000b';g.fillRect(0,0,W,H);g.fillStyle='#2a2050';g.fillRect(120,200,320,140);g.fillRect(520,200,320,140);g.fillStyle='#fff';g.font='bold 28px sans-serif';g.textAlign='center';g.fillText('▶ Tiếp tục',280,278);g.fillText('🏃 Rút lui',680,278);}
 if(C.over){g.fillStyle='#fff';g.font='bold 48px sans-serif';g.textAlign='center';g.fillText(C.win?'THẮNG!':'THẤT BẠI',W/2,H/2);}}
let lt=0;function loop(t){const dt=Math.min(.033,(t-lt)/1000||0);lt=t;
 if(C.on){if(C.hs>0&&!C.pause&&!C.over)C.hs-=dt;else update(dt);if(C.shake>0)C.shake=Math.max(0,C.shake-30*dt);draw();}
 requestAnimationFrame(loop);}
requestAnimationFrame(loop);
