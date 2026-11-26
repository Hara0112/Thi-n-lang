'use strict';
/* Toàn bộ số liệu cân bằng nằm ở đây — chỉnh số ở file này, không cần đụng code */
const CFG={
 realm:{statPerRealm:.45,starBonus:.15},
 idle:{capMin:720},
 gacha:{costGem:160,rates:{L:.02,E:.10,R:.33},softPity:75,softStep:.06,hardPity:90,epicPity:10,rateUp:.5,dupShards:[5,10,20,40],starCost:20},
 banners:[{n:'Vĩnh Cửu',up:null},{n:'Thiên Long Giáng Thế',up:'h6'},{n:'Hỗn Độn Khai Thiên',up:'h7'}],
 sets:[
  {n:'Phong Lôi',c:'#6cf',b2:{aspd:.12},b3:{cr:.10,cd:.30},d2:'+12% Tốc đánh',d3:'+10% Bạo kích, +30% Bạo thương'},
  {n:'Huyết Sát',c:'#f66',b2:{atkp:.12},b3:{atkp:.20,cd:.40},d2:'+12% Công',d3:'+20% Công, +40% Bạo thương'},
  {n:'Huyền Quy',c:'#6c8',b2:{hpp:.15},b3:{defp:.25,hpp:.15},d2:'+15% Sinh lực',d3:'+25% Phòng, +15% Sinh lực'}]
};
