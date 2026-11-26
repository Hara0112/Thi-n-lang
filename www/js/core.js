'use strict';
const $=s=>document.querySelector(s),R=(a,b)=>a+Math.random()*(b-a),RI=(a,b)=>Math.floor(R(a,b+1)),cl=(v,a,b)=>Math.max(a,Math.min(b,v));
const fmt=n=>n>=1e6?(n/1e6).toFixed(1)+'M':n>=1e4?(n/1e3).toFixed(1)+'K':''+Math.floor(n);
const RN=['Phàm','Linh','Huyền','Thiên'],RC=['#b0b0b0','#4fc3f7','#b36bff','#ffb300'];
const REALMS=['Luyện Khí','Trúc Cơ','Kim Đan','Nguyên Anh','Hóa Thần'],STG=['Sơ Kỳ','Trung Kỳ','Hậu Kỳ','Đỉnh Phong'];
const realmName=r=>REALMS[r>>2]+' '+STG[r&3];
const SKU=[0,2,6,10];
const SK=[{n:'Kiếm Khí Trảm',i:'🌀',cd:4},{n:'Lôi Ấn',i:'⚡',cd:7},{n:'Thiên Kiếm Vũ',i:'🗡️',cd:11},{n:'Kim Thân Quyết',i:'🛡️',cd:16}];
const HEROES=[
{id:'h0',n:'Tiểu Kiếm Đồng',t:'Nhân vật',r:0,m:{hp:1,atk:1,def:1},c:'#9ad'},
{id:'h1',n:'Hắc Phong Lang',t:'Linh thú',r:0,m:{hp:1.1,atk:1.05,def:.9},c:'#99a'},
{id:'h2',n:'Thanh Liên Tiên Tử',t:'Nhân vật',r:1,m:{hp:1.1,atk:1.2,def:1.1},c:'#5fd'},
{id:'h3',n:'Xích Viêm Tước',t:'Linh thú',r:1,m:{hp:1,atk:1.35,def:.9},c:'#f84'},
{id:'h4',n:'Cửu U Kiếm Tôn',t:'Nhân vật',r:2,m:{hp:1.3,atk:1.5,def:1.2},c:'#a6f'},
{id:'h5',n:'Huyền Quy Thần Giáp',t:'Pháp bảo',r:2,m:{hp:1.8,atk:1.1,def:1.7},c:'#6a8'},
{id:'h6',n:'Thiên Long Đạo Quân',t:'Nhân vật',r:3,m:{hp:1.6,atk:2,def:1.5},c:'#fc3'},
{id:'h7',n:'Hỗn Độn Thanh Liên Đỉnh',t:'Pháp bảo',r:3,m:{hp:2,atk:1.8,def:1.8},c:'#f6c'}];
const hero=id=>HEROES.find(h=>h.id===id);
const FLAT={atk:1,hp:1,def:1},MB={atk:8,hp:60,def:5,cr:.04,cd:.1,aspd:.05},AB={atk:3,hp:25,def:2,cr:.02,cd:.05,aspd:.03};
const AN={atk:'Công',hp:'Sinh Lực',def:'Phòng',cr:'Bạo Kích',cd:'Bạo Thương',aspd:'Tốc Đánh'};
const SLN={weapon:'Vũ Khí',armor:'Giáp',relic:'Pháp Khí'};
const GN={weapon:['Thiết Kiếm','Linh Kiếm','Huyền Phong Kiếm','Thiên Uy Kiếm'],armor:['Vải Thô','Linh Y','Huyền Giáp','Thiên Long Giáp'],relic:['Ngọc Bội','Linh Phù','Huyền Ấn','Thiên Cơ Đỉnh']};
const MN={qi:'Linh Khí Thạch',ore:'Thiết Tinh',asc:'Thăng Phẩm Thạch',core:'Kết Đan Thạch'};
const KEY='tkl_save_v1';
const defState=()=>({v:1,gold:800,gems:3200,tickets:5,mats:{qi:30,ore:30,asc:3,core:0},realm:0,tp:0,talents:{},heroes:{h0:{star:0,shards:0}},hero:'h0',gear:[],eq:{weapon:null,armor:null,relic:null},pity:{l:0,e:0},zone:{0:1,1:1,2:1},tower:1,q:{p:{},c:{},cl:{},day:''},nid:1,auto:false,gfx:'high',hist:[],idle:{t:Date.now()}});
function load(){const d=defState();try{const s=JSON.parse(localStorage.getItem(KEY));if(s&&s.v===1)return Object.assign(d,s);}catch(e){}return d;}
let S=load();
function save(){try{localStorage.setItem(KEY,JSON.stringify(S));}catch(e){}}
const item=id=>S.gear.find(x=>x.id===id);
function genGear(ilv,minR=0,slot){const x=Math.random()*100;let r=x<2?3:x<12?2:x<40?1:0;r=Math.max(r,minR);
 slot=slot||['weapon','armor','relic'][RI(0,2)];
 const main=slot==='weapon'?'atk':slot==='armor'?'hp':['cr','cd','aspd'][RI(0,2)];
 const pool=['atk','hp','def','cr','cd','aspd'].filter(k=>k!==main),aff=[];
 while(aff.length<r){const k=pool.splice(RI(0,pool.length-1),1)[0];aff.push({k,b:AB[k]});}
 return{id:S.nid++,slot,rar:r,ilv,lv:0,asc:0,set:r>=1?RI(0,CFG.sets.length-1):-1,lk:false,main:{k:main,b:MB[main]},aff,n:GN[slot][r]};}
const gv=(it,a)=>a.b*(FLAT[a.k]?(1+.25*(it.ilv-1))*(1+.5*it.rar):(1+.3*it.rar))*(1+.12*it.lv)*(1+.2*it.asc);
const fv=(k,v)=>FLAT[k]?Math.round(v):(v*100).toFixed(1)+'%';
function stats(){const h=hero(S.hero),hs=S.heroes[S.hero],k=(1+CFG.realm.statPerRealm*S.realm)*(1+CFG.realm.starBonus*hs.star),T=n=>S.talents[n]||0;
 let hp=300*h.m.hp*k,atk=25*h.m.atk*k,def=5*h.m.def*k,as=0,cr=.05,cd=1.5;
 for(const sl in S.eq){const it=item(S.eq[sl]);if(!it)continue;for(const a of [it.main,...it.aff]){const v=gv(it,a);
  if(a.k==='atk')atk+=v;else if(a.k==='hp')hp+=v;else if(a.k==='def')def+=v;else if(a.k==='cr')cr+=v;else if(a.k==='cd')cd+=v;else as+=v;}}
 const sb=setBonus().b;return{hp:hp*(1+.05*T('hp')+sb.hpp),atk:atk*(1+.05*T('atk')+sb.atkp),def:def*(1+.05*T('def')+sb.defp),cr:Math.min(1,cr+.01*T('cr')+sb.cr),cd:cd+.04*T('cd')+sb.cd,aspd:1+as+.02*T('as')+sb.aspd,dcd:Math.max(.5,1.2-.06*T('dash')),col:h.c};}
const power=s=>Math.round(s.atk*3+s.hp/4+s.def*4);
function track(t,n=1){S.q.p[t]=(S.q.p[t]||0)+n;S.q.c[t]=(S.q.c[t]||0)+n;}
function checkDay(){const d=new Date().toDateString();if(S.q.day!==d){S.q.day=d;S.q.c={};for(const k in S.q.cl)if(k[0]==='d')delete S.q.cl[k];save();}}
const MAIN=[{id:'m1',t:'kill',n:50,tx:'Diệt 50 yêu thú',r:{gold:800,gems:100}},{id:'m2',t:'pull',n:10,tx:'Triệu hồi 10 lần',r:{gems:200}},{id:'m3',t:'enh',n:10,tx:'Cường hóa trang bị 10 lần',r:{gold:2000,ore:20}},{id:'m4',t:'brk',n:1,tx:'Đột phá cảnh giới 1 lần',r:{gems:150,tickets:2}},{id:'m5',t:'clear',n:15,tx:'Thông quan 15 màn',r:{gems:300,asc:5}},{id:'m6',t:'brk',n:4,tx:'Đột phá cảnh giới 4 lần',r:{gems:400,tickets:5}},{id:'m7',t:'tower',n:10,tx:'Thông quan Trấn Yêu Tháp 10 tầng',r:{gems:500,core:3}},{id:'m8',t:'kill',n:1500,tx:'Diệt 1500 yêu thú',r:{gems:600,tickets:5}}];
const DAILY=[{id:'d1',t:'kill',n:40,tx:'Diệt 40 yêu thú',r:{gold:500,gems:30}},{id:'d2',t:'pull',n:1,tx:'Triệu hồi 1 lần',r:{gems:30}},{id:'d3',t:'enh',n:3,tx:'Cường hóa 3 lần',r:{gold:600,ore:6}},{id:'d4',t:'clear',n:3,tx:'Thông quan 3 màn',r:{gems:50,tickets:1}},{id:'d5',t:'tower',n:1,tx:'Thông quan Tháp 1 lần',r:{gems:60}}];
function give(r){for(const k in r){if(k==='gold'||k==='gems'||k==='tickets')S[k]+=r[k];else S.mats[k]=(S.mats[k]||0)+r[k];}}
const rwText=r=>Object.keys(r).map(k=>({gold:'🪙',gems:'💎',tickets:'🎫'}[k]?r[k]+({gold:'🪙',gems:'💎',tickets:'🎫'}[k]):r[k]+' '+MN[k])).join(' · ');
if(!S.gear.length){const w=genGear(1,0,'weapon');S.gear.push(w);S.eq.weapon=w.id;save();}
function pull1(b,minR=0){const p=S.pity,G=CFG.gacha;p.l++;p.e++;let pl=G.rates.L;if(p.l>=G.softPity)pl+=(p.l-G.softPity+1)*G.softStep;if(p.l>=G.hardPity)pl=1;
 const x=Math.random();let r=x<pl?3:(p.e>=G.epicPity||x<pl+G.rates.E)?2:x<pl+G.rates.E+G.rates.R?1:0;r=Math.max(r,minR);
 if(r===3)p.l=0;if(r>=2)p.e=0;
 const pool=HEROES.filter(h=>h.r===r);let h=pool[RI(0,pool.length-1)],up=false;
 if(r===3&&b&&b.up){const u=hero(b.up);if(p.g||Math.random()<G.rateUp){h=u;p.g=false;up=true;}else{const o=pool.filter(z=>z.id!==u.id);h=o[RI(0,o.length-1)];p.g=true;}}
 S.hist=S.hist||[];S.hist.unshift({n:h.n,r});S.hist.length=Math.min(S.hist.length,30);
 if(S.heroes[h.id]){const sh=G.dupShards[r];S.heroes[h.id].shards+=sh;return{h,dup:true,sh,up};}
 S.heroes[h.id]={star:0,shards:0};return{h,dup:false,sh:0,up};}

const idleMin=()=>Math.min(CFG.idle.capMin,Math.max(0,(Date.now()-S.idle.t)/60000));
function idleRate(){const a=S.zone[0],b=S.zone[1],c=S.zone[2],rm=1+.1*S.realm;return{gold:Math.floor(15*(1+.25*(a+b+c-3))*rm),qi:.6+.12*a,ore:.5+.1*b,asc:.03+.01*c};}

function setBonus(){const c={},b={atkp:0,hpp:0,defp:0,cr:0,cd:0,aspd:0};
 for(const sl in S.eq){const it=item(S.eq[sl]);if(it&&it.set>=0)c[it.set]=(c[it.set]||0)+1;}
 for(const k in c){const s=CFG.sets[k];if(c[k]>=2)for(const x in s.b2)b[x]+=s.b2[x];if(c[k]>=3)for(const x in s.b3)b[x]+=s.b3[x];}
 return{b,c};}
