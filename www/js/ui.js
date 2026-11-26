'use strict';
const UI=$('#ui');let tab='battle';const sel={0:S.zone[0],1:S.zone[1],2:S.zone[2]};
const TABS=[['battle','⚔️','Chiến'],['afk','💤','Treo Máy'],['realm','🧘','Tu Luyện'],['gacha','🎴','Triệu Hồi'],['hero','👤','Nhân Vật'],['bag','🎒','Túi'],['quest','📜','Nhiệm Vụ'],['talent','🌌','Kinh Mạch']];
const ZONES=[{n:'Rừng Linh Khí',d:'Rơi Linh Khí Thạch (dùng đột phá)'},{n:'Hầm Thiết Tinh',d:'Rơi Thiết Tinh (cường hóa)'},{n:'Huyết Cốc',d:'Rơi nhiều trang bị & Thăng Phẩm Thạch'}];
const TN=[['hp','Cường Thể','+5% Sinh Lực'],['atk','Kiếm Ý','+5% Công'],['def','Kim Cương Thân','+5% Phòng'],['cr','Thiên Nhãn','+1% Bạo kích'],['cd','Sát Ý','+4% Bạo thương'],['as','Phong Tốc','+2% Tốc đánh'],['dash','Thân Pháp','-0.06s hồi chiêu lướt']];
function toast(m){const t=$('#toast');t.textContent=m;t.style.opacity=1;clearTimeout(t._h);t._h=setTimeout(()=>t.style.opacity=0,1700);}
function modal(h,c){const m=$('#modal');m.className=c||'';m.innerHTML='<div class="box">'+h+'</div>';m.style.display='flex';}
function closeModal(){$('#modal').style.display='none';render();}
const go=t=>{tab=t;render();};
const iname=it=>'<span style="color:'+RC[it.rar]+'">'+it.n+' +'+it.lv+'★'.repeat(it.asc)+'</span>';
function render(){checkDay();const st=stats();
 UI.innerHTML='<div id="top"><span>🪙'+fmt(S.gold)+'</span><span>💎'+fmt(S.gems)+'</span><span>🎫'+S.tickets+'</span><span class="rl">'+realmName(S.realm)+'</span><span>⚔ '+fmt(power(st))+'</span><button onclick="settings()">⚙</button></div><div id="mid"><nav>'+TABS.map(t=>'<button class="'+(t[0]===tab?'on':'')+'" onclick="go(\''+t[0]+'\')">'+t[1]+'<small>'+t[2]+'</small></button>').join('')+'</nav><main>'+VIEWS[tab]()+'</main></div>';}
/* ---------- Battle ---------- */
function vBattle(){return ZONES.map((z,i)=>'<div class="card"><b>'+z.n+'</b><small>'+z.d+'</small><div class="row"><button onclick="lv('+i+',-1)">−</button><span>Cấp '+sel[i]+'/'+S.zone[i]+(sel[i]%5===0?' 👹Boss':'')+'</span><button onclick="lv('+i+',1)">+</button><button class="go" onclick="fight('+i+')">Xuất chiến</button></div></div>').join('')+
 '<div class="card"><b>Trấn Yêu Tháp</b><small>Tầng '+S.tower+' · Boss mỗi 5 tầng · Mở ở '+realmName(3)+'</small><div class="row"><button class="go" '+(S.realm<3?'disabled':'')+' onclick="fightTower()">Leo tháp</button></div></div>';}
function lv(i,d){sel[i]=cl(sel[i]+d,1,S.zone[i]);render();}
function fight(i){startCombat('zone',i,sel[i]);}
function fightTower(){startCombat('tower',0,S.tower);}
function showResult(){if(S.auto&&C.win){again();return;}C.on=false;cv.style.display='none';UI.style.display='flex';const L=C.loot,rw=C.rw||{gold:0,gems:0,m:{}};
 const mt=o=>Object.keys(o).map(k=>MN[k]+' x'+o[k]).join(', ');
 modal('<h2>'+(C.win?'🏆 Thắng lợi':'💀 Thất bại')+'</h2><div>Diệt '+L.kills+' yêu thú · +'+fmt(L.gold)+'🪙 nhặt được</div>'+(L.gear.length?'<div>Trang bị rơi: '+L.gear.map(iname).join(', ')+'</div>':'')+(Object.keys(L.m).length?'<div>'+mt(L.m)+'</div>':'')+(C.win?'<div>Thưởng thông quan: +'+fmt(rw.gold)+'🪙 +'+rw.gems+'💎 '+mt(rw.m)+'</div>':'')+'<div class="row"><button class="go" onclick="again()">Chiến tiếp</button><button onclick="closeModal()">Về menu</button></div>');save();}
function again(){const k=C.kind,z=C.z,l=C.lvl;$('#modal').style.display='none';startCombat(k,z,k==='tower'?S.tower:l);}
/* ---------- Realm ---------- */
function bk(r){return{qi:Math.floor(20*(1+r*.9)),gold:Math.floor(150*Math.pow(1.35,r)),core:(r&3)===3?2+(r>>2):0,clr:1+Math.floor(r*1.5)};}
function brkConds(r){const c=bk(r),a=[['Thông quan Rừng Linh Khí cấp '+c.clr+' (hiện '+(S.zone[0]-1)+')',S.zone[0]-1>=c.clr],[c.qi+' Linh Khí Thạch (có '+S.mats.qi+')',S.mats.qi>=c.qi],[fmt(c.gold)+' Vàng (có '+fmt(S.gold)+')',S.gold>=c.gold]];
 if(c.core)a.push([c.core+' Kết Đan Thạch (có '+S.mats.core+')',S.mats.core>=c.core]);return a;}
function vRealm(){const r=S.realm;if(r>=19)return '<div class="card"><b>'+realmName(r)+'</b><div>Đã đạt đỉnh cao tu luyện hiện tại.</div></div>';
 const cd=brkConds(r),ok=cd.every(x=>x[1]),a=stats();S.realm++;const b=stats();S.realm--;
 const ul=SKU.indexOf(r+1)>0?'Mở khóa kỹ năng: '+SK[SKU.indexOf(r+1)].n:(r+1===3?'Mở khóa: Trấn Yêu Tháp':'');
 const row=(n,x,y)=>'<div>'+n+': '+Math.round(x)+' → <b class="ok">'+Math.round(y)+'</b></div>';
 return '<div class="card"><b>'+realmName(r)+' → '+realmName(r+1)+'</b>'+row('Sinh Lực',a.hp,b.hp)+row('Công',a.atk,b.atk)+row('Phòng',a.def,b.def)+'<small>+1 điểm Kinh Mạch'+(ul?' · '+ul:'')+'</small></div><div class="card"><b>Điều kiện</b>'+cd.map(x=>'<div class="'+(x[1]?'ok':'no')+'">'+(x[1]?'✓':'✗')+' '+x[0]+'</div>').join('')+'<div class="row"><button class="go" '+(ok?'':'disabled')+' onclick="breakthrough()">Đột phá</button></div></div>';}
function breakthrough(){const r=S.realm;if(r>=19||!brkConds(r).every(x=>x[1]))return toast('Chưa đủ điều kiện');const c=bk(r);
 S.mats.qi-=c.qi;S.gold-=c.gold;S.mats.core-=c.core;S.realm++;S.tp++;track('brk');save();
 const ul=SKU.indexOf(S.realm)>0?'<div>Mở khóa kỹ năng: <b>'+SK[SKU.indexOf(S.realm)].n+'</b></div>':'';
 modal('<h2>🎉 Đột phá thành công</h2><div>'+realmName(S.realm)+'</div><div>+1 điểm Kinh Mạch</div>'+ul+'<button onclick="closeModal()">Đóng</button>');render();}
/* ---------- Gacha ---------- */
const pcost=n=>S.tickets>=n?n+' 🎫':n*160+' 💎';
function vGacha(){return '<div class="card"><b>Thiên Cơ Các – Banner Vĩnh Cửu</b><small>Nhân vật · Linh thú · Pháp bảo</small><div>Bảo đảm Thiên phẩm: <b>'+S.pity.l+'/90</b> (tăng mạnh từ 75)</div><div>Bảo đảm Huyền phẩm: <b>'+S.pity.e+'/10</b></div><div class="row"><button class="go" onclick="doPull(1)">Quay x1<br><small>'+pcost(1)+'</small></button><button class="go" onclick="doPull(10)">Quay x10<br><small>'+pcost(10)+'</small></button></div><small>Tỉ lệ: Thiên 2% · Huyền 10% · Linh 33% · Phàm 55%. Trùng → mảnh dùng để tăng sao.</small></div>';}
function doPull(n){if(S.tickets>=n)S.tickets-=n;else if(S.gems>=n*160)S.gems-=n*160;else return toast('Không đủ vé/💎');
 const rs=[];for(let i=0;i<n;i++)rs.push(pull1());track('pull',n);save();reveal(rs);}
function reveal(rs){const top=Math.max(...rs.map(x=>x.h.r));
 modal('<div class="pulls">'+rs.map((x,i)=>'<div class="pc r'+x.h.r+'" style="animation-delay:'+(i*.3)+'s;border-color:'+RC[x.h.r]+'"><b style="color:'+RC[x.h.r]+'">'+RN[x.h.r]+'</b><span>'+x.h.n+'</span><small>'+(x.dup?'Trùng → +'+x.sh+' mảnh':'MỚI!')+'</small></div>').join('')+'</div><button onclick="closeModal()">Xong</button>','reveal'+(top===3?' gold':''));}
/* ---------- Heroes ---------- */
const starCost=s=>20*(s+1);
function vHero(){return HEROES.map(h=>{const o=S.heroes[h.id];return '<div class="card '+(o?'':'dim')+'" style="border-color:'+RC[h.r]+'"><b style="color:'+RC[h.r]+'">'+h.n+'</b> <small>'+h.t+' · '+RN[h.r]+' phẩm · x'+h.m.atk+' Công</small>'+(o?'<div>'+'★'.repeat(o.star)+'☆'.repeat(5-o.star)+' · Mảnh '+o.shards+(o.star<5?'/'+starCost(o.star):' (MAX)')+'</div><div class="row"><button '+(S.hero===h.id?'disabled':'')+' onclick="pick(\''+h.id+'\')">'+(S.hero===h.id?'Đang dùng':'Chọn')+'</button><button onclick="star(\''+h.id+'\')">Tăng sao</button></div>':'<small>Chưa sở hữu</small>')+'</div>';}).join('');}
function pick(id){S.hero=id;save();render();}
function star(id){const o=S.heroes[id];if(o.star>=5)return toast('Đã đủ 5 sao');const c=starCost(o.star);if(o.shards<c)return toast('Thiếu mảnh');o.shards-=c;o.star++;save();toast('Tăng sao thành công!');render();}
/* ---------- Bag ---------- */
function vBag(){const eqd=Object.values(S.eq);
 const slots='<div class="slots">'+['weapon','armor','relic'].map(sl=>{const it=item(S.eq[sl]);return '<div class="slot" '+(it?'onclick="det('+it.id+')"':'')+'>'+SLN[sl]+'<br>'+(it?iname(it):'—')+'</div>';}).join('')+'</div>';
 const mats='<div class="card">'+Object.keys(MN).map(k=>MN[k]+': <b>'+(S.mats[k]||0)+'</b>').join(' · ')+'</div>';
 const list=S.gear.filter(x=>!eqd.includes(x.id)).sort((a,b)=>b.rar-a.rar||b.ilv-a.ilv||b.lv-a.lv).slice(0,100);
 return slots+mats+'<div class="grid">'+list.map(it=>'<div class="it" style="border-color:'+RC[it.rar]+'" onclick="det('+it.id+')"><b>'+iname(it)+'</b><small>'+SLN[it.slot]+' · Cấp '+it.ilv+'</small><small>'+AN[it.main.k]+' +'+fv(it.main.k,gv(it,it.main))+'</small></div>').join('')+'</div>'+(S.gear.length>100?'<small>Hiển thị 100 món tốt nhất.</small>':'');}
const ecost=it=>({g:Math.floor(60*(it.lv+1)*(1+it.ilv*.1)),o:2+it.lv});
function det(id){const it=item(id);if(!it)return closeModal();const eqd=S.eq[it.slot]===id,mx=5+5*it.asc,ec=ecost(it);
 modal('<h3>'+iname(it)+'</h3><small>'+SLN[it.slot]+' · '+RN[it.rar]+' phẩm · Cấp '+it.ilv+' · +'+it.lv+'/'+mx+'</small>'+[it.main].concat(it.aff).map(a=>'<div>'+AN[a.k]+' +'+fv(a.k,gv(it,a))+'</div>').join('')+
 '<div class="row">'+(eqd?'':'<button onclick="equip('+id+')">Trang bị</button>')+'<button onclick="enh('+id+')">Cường hóa<br><small>'+fmt(ec.g)+'🪙 '+ec.o+' Thiết Tinh</small></button>'+
 (it.lv>=mx&&it.asc<3?'<button onclick="ascend('+id+')">Thăng phẩm<br><small>'+3*(it.asc+1)+' Thăng Phẩm Thạch · '+500*(it.asc+1)+'🪙</small></button>':'')+
 (eqd?'':'<button onclick="salv('+id+')">Phân giải</button>')+'</div><button onclick="closeModal()">Đóng</button>');}
function equip(id){const it=item(id);S.eq[it.slot]=id;save();closeModal();}
function enh(id){const it=item(id),mx=5+5*it.asc;if(it.lv>=mx)return toast('Đã tối đa — cần Thăng phẩm');const c=ecost(it);
 if(S.gold<c.g||S.mats.ore<c.o)return toast('Thiếu tài nguyên');S.gold-=c.g;S.mats.ore-=c.o;it.lv++;track('enh');save();det(id);render();}
function ascend(id){const it=item(id),a=3*(it.asc+1),g2=500*(it.asc+1);if(S.mats.asc<a||S.gold<g2)return toast('Thiếu tài nguyên');S.mats.asc-=a;S.gold-=g2;it.asc++;save();toast('Thăng phẩm thành công!');det(id);render();}
function salv(id){const it=item(id);if(S.eq[it.slot]===id)return;S.gold+=20*it.ilv*(it.rar+1);S.mats.ore+=1+it.rar*2+it.lv;S.gear=S.gear.filter(x=>x.id!==id);save();closeModal();}
/* ---------- Quests ---------- */
function vQuest(){const row=(q,pr)=>{const v=Math.min(q.n,pr[q.t]||0),done=v>=q.n,c=S.q.cl[q.id];return '<div class="card"><b>'+q.tx+'</b><div class="bar"><i style="width:'+v/q.n*100+'%"></i></div><small>'+v+'/'+q.n+' · '+rwText(q.r)+'</small><button '+(!done||c?'disabled':'')+' onclick="claim(\''+q.id+'\')">'+(c?'Đã nhận':'Nhận thưởng')+'</button></div>';};
 return '<h4>Nhiệm vụ ngày</h4>'+DAILY.map(q=>row(q,S.q.c)).join('')+'<h4>Nhiệm vụ chính</h4>'+MAIN.map(q=>row(q,S.q.p)).join('');}
function claim(id){const q=MAIN.concat(DAILY).find(x=>x.id===id),pr=id[0]==='d'?S.q.c:S.q.p;if(!q||S.q.cl[id]||(pr[q.t]||0)<q.n)return;S.q.cl[id]=1;give(q.r);save();toast('Đã nhận: '+rwText(q.r));render();}
/* ---------- Talents ---------- */
function vTalent(){return '<div class="card">Điểm Kinh Mạch: <b>'+S.tp+'</b> <small>(+1 mỗi lần đột phá)</small><div class="row"><button onclick="respec()">Tẩy Tủy (100💎)</button></div></div>'+TN.map(n=>{const l=S.talents[n[0]]||0;return '<div class="card"><b>'+n[1]+'</b> Lv '+l+'/10<small>'+n[2]+'</small><div class="bar"><i style="width:'+l*10+'%"></i></div><button '+(S.tp<1||l>=10?'disabled':'')+' onclick="tup(\''+n[0]+'\')">Tăng (1 điểm)</button></div>';}).join('');}
function tup(k){if(S.tp<1||(S.talents[k]||0)>=10)return;S.tp--;S.talents[k]=(S.talents[k]||0)+1;save();render();}
function respec(){if(S.gems<100)return toast('Thiếu 💎');let n=0;for(const k in S.talents)n+=S.talents[k];if(!n)return toast('Chưa có điểm nào');S.gems-=100;S.tp+=n;S.talents={};save();render();}
/* ---------- Settings / Save ---------- */
function settings(){modal('<h3>Lưu / Tải dữ liệu</h3><small>Tự động lưu mỗi 5 giây. Sao chép đoạn dưới để sao lưu, hoặc dán vào để khôi phục.</small><textarea id="sv">'+JSON.stringify(S).replace(/&/g,'&amp;').replace(/</g,'&lt;')+'</textarea><div class="row"><button class="go" onclick="imp()">Nhập dữ liệu</button><button onclick="wipe()">Xóa save</button><button onclick="closeModal()">Đóng</button></div>');}
function imp(){try{const p=JSON.parse($('#sv').value);if(p.v!==1)throw 0;S=Object.assign(defState(),p);save();sel[0]=S.zone[0];sel[1]=S.zone[1];sel[2]=S.zone[2];toast('Đã nhập save');closeModal();}catch(e){toast('Dữ liệu không hợp lệ');}}
function wipe(){if(confirm('Xóa toàn bộ tiến trình?')){localStorage.removeItem(KEY);location.reload();}}
const VIEWS={afk:vAfk,battle:vBattle,realm:vRealm,gacha:vGacha,hero:vHero,bag:vBag,quest:vQuest,talent:vTalent};
setInterval(save,5000);document.addEventListener('visibilitychange',save);
setInterval(()=>{if(tab==='afk'&&UI.style.display!=='none'&&$('#modal').style.display!=='flex')render();},30000);
if(idleMin()>=2)tab='afk';
render();

/* ---------- Treo máy ---------- */
function vAfk(){const r=idleRate(),m=idleMin(),h=Math.floor(m/60),mm=Math.floor(m%60);
 return '<div class="card"><b>💤 Treo máy</b><small>Tích lũy tối đa 12 giờ, kể cả khi tắt game. Tốc độ tăng theo màn đã thông.</small><div>Đã tích lũy: <b>'+h+'g '+mm+'p</b>'+(m>=720?' (đầy)':'')+'</div><div>🪙'+fmt(r.gold*m)+' · '+Math.floor(r.qi*m)+' Linh Khí · '+Math.floor(r.ore*m)+' Thiết Tinh · '+Math.floor(r.asc*m)+' Thăng Phẩm · '+Math.min(24,Math.floor(m/30))+' trang bị</div><div class="row"><button class="go" onclick="claimIdle()">Nhận thưởng</button><button onclick="fastIdle()">Nhận nhanh 2 giờ (50💎)</button></div></div>'+
 '<div class="card"><b>Mỗi giờ</b><small>🪙'+fmt(r.gold*60)+' · '+Math.floor(r.qi*60)+' Linh Khí · '+Math.floor(r.ore*60)+' Thiết Tinh</small></div>'+
 '<div class="card"><b>🤖 Tự động đánh</b><small>Bật nút 🤖 góc trên bên phải khi chiến đấu (hoặc ở đây): nhân vật tự di chuyển, đánh, né đòn và dùng kỹ năng; thắng sẽ tự vào trận tiếp. Chạm joystick bất cứ lúc nào để tự điều khiển.</small><div class="row"><button onclick="toggleAuto()">'+(S.auto?'Đang BẬT':'Đang TẮT')+'</button></div></div>';}
function toggleAuto(){S.auto=!S.auto;save();render();}
function idleGive(m){const r=idleRate();give({gold:Math.floor(r.gold*m),qi:Math.floor(r.qi*m),ore:Math.floor(r.ore*m),asc:Math.floor(r.asc*m)});}
function claimIdle(){const m=idleMin();if(m<1)return toast('Chưa có gì để nhận');idleGive(m);
 for(let i=0;i<Math.min(24,Math.floor(m/30))&&S.gear.length<250;i++)S.gear.push(genGear(Math.max(1,Math.ceil(S.zone[2]/2))));
 S.idle.t=Date.now();save();toast('Đã nhận thưởng treo máy');render();}
function fastIdle(){if(S.gems<50)return toast('Thiếu 💎');S.gems-=50;idleGive(120);save();toast('Đã nhận thưởng 2 giờ');render();}
