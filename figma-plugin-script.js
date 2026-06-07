// ╔══════════════════════════════════════════════════════════════════════════╗
// ║  CareTrack Klinika — TYBT Figma Dizayn Generator                       ║
// ║  Ishlatish: Figma → Plugins → Development → Run once                   ║
// ╚══════════════════════════════════════════════════════════════════════════╝

// ─── Ranglar ────────────────────────────────────────────────────────────────
const C = {
  primary:'#1e40af', primaryH:'#1e3a8a', primaryL:'#eff6ff',
  secondary:'#0f766e', accent:'#d97706', danger:'#b91c1c', dangerL:'#fef2f2',
  success:'#15803d', successL:'#f0fdf4', purple:'#6d28d9', purpleL:'#f5f3ff',
  bg:'#f8fafc', bgAlt:'#f1f5f9', surface:'#ffffff',
  sidebarBg:'#0c1e3c', sidebarText:'#94a3b8',
  text:'#0f172a', textSec:'#334155', textMuted:'#64748b', textFaint:'#94a3b8',
  border:'#e2e8f0', divider:'#f1f5f9',
  amber:'#fef3c7', amberText:'#92400e',
  teal:'#ccfbf1', tealText:'#0f766e',
  sky:'#e0f2fe', skyText:'#0369a1',
};

// ─── Helper funksiyalar ──────────────────────────────────────────────────────
function rgb(h){return{r:parseInt(h.slice(1,3),16)/255,g:parseInt(h.slice(3,5),16)/255,b:parseInt(h.slice(5,7),16)/255};}
function solid(h,a=1){return[{type:'SOLID',color:rgb(h),opacity:a}];}
async function font(style='Regular'){try{await figma.loadFontAsync({family:'Inter',style});}catch(e){}}

async function T(txt,size,style,color,w=300,align='LEFT'){
  await font(style);
  const t=figma.createText();
  t.fontName={family:'Inter',style};
  t.fontSize=size;
  t.characters=String(txt);
  t.fills=solid(color);
  if(align!=='LEFT')t.textAlignHorizontal=align;
  t.textAutoResize='HEIGHT';
  if(w)t.resize(w,20);
  return t;
}

function R(w,h,fills,r=0,strokes=null){
  const n=figma.createRectangle();
  n.resize(w,h);n.fills=fills;
  if(r)n.cornerRadius=r;
  if(strokes){n.strokes=strokes;n.strokeWeight=1.5;}
  return n;
}

function FR(name,w,h,fills=solid('#ffffff')){
  const f=figma.createFrame();
  f.name=name;f.resize(w,h);f.fills=fills;
  f.clipsContent=true;
  return f;
}

function place(node,x,y){node.x=x;node.y=y;return node;}

function makeCard(parent,x,y,w,h,name='Card'){
  const c=FR(name,w,h,solid(C.surface));
  c.strokes=[{type:'SOLID',color:rgb(C.border)}];
  c.strokeWeight=1;c.cornerRadius=12;
  place(c,x,y);parent.appendChild(c);
  return c;
}

// ─── Sidebar ─────────────────────────────────────────────────────────────────
async function makeSidebar(parent,activeItem){
  const sb=FR('Sidebar',260,900,solid(C.sidebarBg));
  place(sb,0,0);parent.appendChild(sb);

  const bIcon=R(38,38,solid(C.primary),10);place(bIcon,20,22);sb.appendChild(bIcon);
  const bT=await T('CareTrack',15,'Bold',C.surface,160);place(bT,66,24);sb.appendChild(bT);
  const bS=await T('KLINIKA TYBT',9,'Regular',C.sidebarText,160);place(bS,66,42);sb.appendChild(bS);
  const navL=await T('MENYÚ',9,'Bold','#475569',200);place(navL,20,90);sb.appendChild(navL);

  const items=[
    {label:'Bosh sahifa',y:112,id:'dashboard'},
    {label:'Shifokorlar',y:148,id:'doctors'},
    {label:'Bemorlar',y:184,id:'patients'},
    {label:'Tashxislar',y:220,id:'diseases'},
  ];
  for(const item of items){
    const isActive=item.id===activeItem;
    if(isActive){
      const hl=R(260,34,solid(C.primary,0.25));place(hl,0,item.y-4);sb.appendChild(hl);
      const ac=R(3,34,solid('#60a5fa'));place(ac,0,item.y-4);sb.appendChild(ac);
    }
    const lbl=await T(item.label,14,isActive?'Semi Bold':'Regular',isActive?C.surface:C.sidebarText,200);
    place(lbl,36,item.y);sb.appendChild(lbl);
  }

  const uc=R(220,54,solid(C.surface,0.05),8);place(uc,20,800);sb.appendChild(uc);
  const ua=R(34,34,solid(C.primary),17);place(ua,30,813);sb.appendChild(ua);
  const un=await T('System Administrator',12,'Semi Bold',C.surface,160);place(un,72,811);sb.appendChild(un);
  const ur=await T('Administrator',10,'Regular','#60a5fa',160);place(ur,72,826);sb.appendChild(ur);
  const lo=await T('Tizimdan chiqish',12,'Regular',C.sidebarText,180);place(lo,36,866);sb.appendChild(lo);
}

async function makeTopbar(parent,title,rightTxt=''){
  const tb=FR('Topbar',1180,62,solid(C.surface));
  tb.strokes=[{type:'SOLID',color:rgb(C.border)}];
  tb.strokeWeight=1;
  place(tb,260,0);parent.appendChild(tb);
  const ttl=await T(title,15,'Bold',C.text,300);place(ttl,28,22);tb.appendChild(ttl);
  if(rightTxt){
    const rt=await T(rightTxt,12,'Regular',C.textMuted,400);
    rt.textAlignHorizontal='RIGHT';
    place(rt,760,24);tb.appendChild(rt);
  }
}

async function makeStatCard(parent,x,y,value,label,accent){
  const card=FR(`Stat-${label}`,262,96,solid(C.surface));
  card.strokes=[{type:'SOLID',color:rgb(C.border)}];
  card.strokeWeight=1;card.cornerRadius=12;
  place(card,x,y);parent.appendChild(card);
  const bar=R(262,3,solid(accent));place(bar,0,0);card.appendChild(bar);
  const iconBg=R(44,44,solid(accent,0.12),11);place(iconBg,16,28);card.appendChild(iconBg);
  const val=await T(String(value),28,'Extra Bold',C.text,180);place(val,72,30);card.appendChild(val);
  const lbl=await T(label,12,'Regular',C.textMuted,180);place(lbl,72,62);card.appendChild(lbl);
}

async function makeTableHeader(parent,cols,y=0){
  const hbg=R(parent.width,38,solid(C.bgAlt));place(hbg,0,y);parent.appendChild(hbg);
  let x=16;
  for(const col of cols){
    const th=await T(col.label,10,'Bold',C.textMuted,col.w);place(th,x,y+12);parent.appendChild(th);
    x+=col.w+16;
  }
}

async function makeTableRow(parent,cells,y,cols){
  const divider=R(parent.width,1,solid(C.divider));place(divider,0,y+46);parent.appendChild(divider);
  let x=16;
  for(let i=0;i<cells.length;i++){
    const cell=cells[i];const col=cols[i];
    if(cell.type==='badge'){
      const bg=R(Math.min(cell.text.length*7+16,130),22,solid(cell.bg),11);
      place(bg,x,y+12);parent.appendChild(bg);
      const bt=await T(cell.text,10,'Semi Bold',cell.fg,col.w-4);
      place(bt,x+8,y+16);parent.appendChild(bt);
    } else if(cell.type==='avatar'){
      const av=R(32,32,solid(cell.bg||C.primaryL),8);place(av,x,y+8);parent.appendChild(av);
      const avt=await T(cell.initials||'?',11,'Bold',cell.fg||C.primary,32);
      avt.textAlignHorizontal='CENTER';place(avt,x,y+18);parent.appendChild(avt);
      const nm=await T(cell.name,13,'Semi Bold',C.text,col.w-48);place(nm,x+40,y+10);parent.appendChild(nm);
      if(cell.sub){const sb=await T(cell.sub,11,'Regular',C.textMuted,col.w-48);place(sb,x+40,y+26);parent.appendChild(sb);}
    } else {
      const main=await T(cell.text||'—',13,'Regular',cell.bold?C.text:C.textSec,col.w);
      place(main,x,y+14);parent.appendChild(main);
      if(cell.sub){const s=await T(cell.sub,11,'Regular',C.textMuted,col.w);place(s,x,y+30);parent.appendChild(s);}
    }
    x+=col.w+16;
  }
}

// ════════════════════════════════════════════════════════════════════════════
//  01 — LOGIN
// ════════════════════════════════════════════════════════════════════════════
const page1=figma.currentPage;
page1.name='01 — Login';

const login=FR('Login Page',1440,900,solid(C.bg));
place(login,0,0);page1.appendChild(login);

// Left panel
const lp=FR('Left Panel',640,900,solid(C.sidebarBg));
place(lp,0,0);login.appendChild(lp);
const c1=figma.createEllipse();c1.resize(360,360);c1.fills=solid(C.surface,0.04);place(c1,340,-80);lp.appendChild(c1);
const c2=figma.createEllipse();c2.resize(280,280);c2.fills=solid(C.surface,0.03);place(c2,-80,680);lp.appendChild(c2);
const li=R(42,42,solid(C.primary),11);place(li,52,44);lp.appendChild(li);
const lt=await T('CareTrack Klinika',15,'Bold',C.surface,300);place(lt,104,48);lp.appendChild(lt);
const ls=await T('MediCore Solutions',11,'Regular',C.sidebarText,300);place(ls,104,66);lp.appendChild(ls);
const lh=await T('Tibbiy Yozuvlarni\nBoshqarish Tizimi',38,'Extra Bold',C.surface,520);
lh.lineHeight={value:120,unit:'PERCENT'};place(lh,52,240);lp.appendChild(lh);
const lp2=await T('CareTrack — shifokorlar, bemorlar va tashxislarni markazlashgan\nholda boshqarish uchun zamonaviy tibbiy platforma.',15,'Regular',C.sidebarText,530);
lp2.lineHeight={value:165,unit:'PERCENT'};place(lp2,52,370);lp.appendChild(lp2);
const feats=['Rol asosidagi xavfsiz kirish tizimi',"Shifokorlar va bemorlarni to'liq boshqarish",'Tashxislar tarixi va ICD kodlash'];
for(let i=0;i<feats.length;i++){
  const dot=R(32,32,solid(C.primary,0.3),8);place(dot,52,490+i*52);lp.appendChild(dot);
  const ft=await T(feats[i],14,'Regular',C.sidebarText,500);place(ft,96,500+i*52);lp.appendChild(ft);
}

// Right panel
const rp=FR('Right Panel',800,900,solid(C.surface));place(rp,640,0);login.appendChild(rp);
const lock=R(44,44,solid(C.primaryL),11);place(lock,200,170);rp.appendChild(lock);
const ftl=await T('Tizimga kirish',28,'Extra Bold',C.text,400);place(ftl,200,232);rp.appendChild(ftl);
const fts=await T('Davom etish uchun hisobingizga kiring',14,'Regular',C.textMuted,400);place(fts,200,272);rp.appendChild(fts);
const unLbl=await T('Foydalanuvchi nomi *',12,'Semi Bold',C.textSec,400);place(unLbl,200,324);rp.appendChild(unLbl);
const unBox=R(400,46,solid(C.surface),10,[{type:'SOLID',color:rgb(C.border)}]);place(unBox,200,346);rp.appendChild(unBox);
const unPh=await T('Foydalanuvchi nomini kiriting',14,'Regular',C.textFaint,360);place(unPh,214,359);rp.appendChild(unPh);
const pwLbl=await T('Parol *',12,'Semi Bold',C.textSec,400);place(pwLbl,200,414);rp.appendChild(pwLbl);
const pwBox=R(400,46,solid(C.surface),10,[{type:'SOLID',color:rgb(C.border)}]);place(pwBox,200,436);rp.appendChild(pwBox);
const pwPh=await T('Parolni kiriting',14,'Regular',C.textFaint,360);place(pwPh,214,449);rp.appendChild(pwPh);
const loginBtn=R(400,48,solid(C.primary),10);place(loginBtn,200,512);rp.appendChild(loginBtn);
const loginBtnT=await T('Kirish',15,'Semi Bold',C.surface,400);loginBtnT.textAlignHorizontal='CENTER';place(loginBtnT,200,526);rp.appendChild(loginBtnT);
const cp=await T('© 2024 MediCore Solutions. Barcha huquqlar himoyalangan.',12,'Regular',C.textFaint,400);cp.textAlignHorizontal='CENTER';place(cp,200,598);rp.appendChild(cp);

// ════════════════════════════════════════════════════════════════════════════
//  02 — DASHBOARD
// ════════════════════════════════════════════════════════════════════════════
const p2=figma.createPage();p2.name='02 — Dashboard';
const dash=FR('Dashboard',1440,960,solid(C.bg));
place(dash,0,0);p2.appendChild(dash);
await makeSidebar(dash,'dashboard');
await makeTopbar(dash,'Bosh sahifa','Payshanba, 5-iyun 2026');

const phTitle=await T('Xush kelibsiz, Diyorbek!',22,'Extra Bold',C.text,600);place(phTitle,288,86);dash.appendChild(phTitle);
const phSub=await T("CareTrack klinika boshqaruv tizimiga umumiy ko'rinish",14,'Regular',C.textMuted,600);place(phSub,288,114);dash.appendChild(phSub);
const bB=R(120,34,solid(C.surface),8,[{type:'SOLID',color:rgb(C.border)}]);place(bB,1188,94);dash.appendChild(bB);
const bBT=await T('Bemorlar',13,'Semi Bold',C.textSec,110);bBT.textAlignHorizontal='CENTER';place(bBT,1188,104);dash.appendChild(bBT);
const bT2=R(126,34,solid(C.primary),8);place(bT2,1316,94);dash.appendChild(bT2);
const bT2T=await T('Tashxislar',13,'Semi Bold',C.surface,116);bT2T.textAlignHorizontal='CENTER';place(bT2T,1316,104);dash.appendChild(bT2T);

await makeStatCard(dash,288,148,'4','Jami shifokorlar',C.primary);
await makeStatCard(dash,562,148,'4','Jami bemorlar',C.secondary);
await makeStatCard(dash,836,148,'5','Jami tashxislar',C.accent);
await makeStatCard(dash,1110,148,'1',"Og'ir / Kritik holat",C.danger);

// Recent patients
const rpCard=makeCard(dash,288,268,690,430,"So'nggi bemorlar");
const rpT=await T("So'nggi qo'shilgan bemorlar",15,'Bold',C.text,400);place(rpT,22,18);rpCard.appendChild(rpT);
const rpS=await T("Tizimga ro'yxatdan o'tgan oxirgi bemorlar",12,'Regular',C.textMuted,400);place(rpS,22,38);rpCard.appendChild(rpS);
const vaBtn=R(110,30,solid(C.bgAlt),8);place(vaBtn,558,18);rpCard.appendChild(vaBtn);
const vaBtnT=await T("Barchasini ko'rish",11,'Semi Bold',C.textSec,100);vaBtnT.textAlignHorizontal='CENTER';place(vaBtnT,558,27);rpCard.appendChild(vaBtnT);
const divL=R(690,1,solid(C.divider));place(divL,0,58);rpCard.appendChild(divL);

const pats=[
  {ini:'SL',name:'Susan Lee',doc:'Dr. Aisha Patel',info:'Ayol, 58 yosh',blood:'AB+',bg:'#ede9fe',fg:C.purple},
  {ini:'RG',name:'Robert Garcia',doc:'Dr. Michael Chen',info:'Erkak, 35 yosh',blood:'B+',bg:'#d1fae5',fg:C.success},
  {ini:'LT',name:'Linda Thompson',doc:'Dr. Sarah Johnson',info:'Ayol, 53 yosh',blood:'O-',bg:'#fee2e2',fg:C.danger},
  {ini:'JW',name:'James Wilson',doc:'Dr. Sarah Johnson',info:'Erkak, 41 yosh',blood:'A+',bg:'#dbeafe',fg:C.primary},
];
for(let i=0;i<pats.length;i++){
  const p=pats[i];const ry=70+i*84;
  const av=R(38,38,solid(p.bg),10);place(av,16,ry+8);rpCard.appendChild(av);
  const avt=await T(p.ini,12,'Bold',p.fg,38);avt.textAlignHorizontal='CENTER';place(avt,16,ry+20);rpCard.appendChild(avt);
  const nm=await T(p.name,14,'Semi Bold',C.text,240);place(nm,64,ry+12);rpCard.appendChild(nm);
  const sub=await T(p.doc+' · '+p.info,12,'Regular',C.textMuted,280);place(sub,64,ry+30);rpCard.appendChild(sub);
  const bl=R(38,22,solid(p.bg),11);place(bl,606,ry+18);rpCard.appendChild(bl);
  const blt=await T(p.blood,10,'Bold',p.fg,36);blt.textAlignHorizontal='CENTER';place(blt,606,ry+22);rpCard.appendChild(blt);
  const eye=R(30,30,solid(C.bgAlt),8);place(eye,652,ry+14);rpCard.appendChild(eye);
  if(i<3){const d=R(690,1,solid(C.divider));place(d,0,ry+76);rpCard.appendChild(d);}
}

// Severity
const sevCard=makeCard(dash,990,268,390,196,"Og'irlik darajasi");
const sevT=await T("Tashxis og'irlik darajasi",14,'Bold',C.text,320);place(sevT,20,18);sevCard.appendChild(sevT);
const sevD=R(390,1,solid(C.divider));place(sevD,0,48);sevCard.appendChild(sevD);
const sevItems=[{l:'Yengil',w:180,c:C.success},{l:"O'rtacha",w:150,c:C.accent},{l:"Og'ir",w:80,c:C.danger},{l:'Kritik',w:10,c:C.purple}];
for(let i=0;i<sevItems.length;i++){
  const si=sevItems[i];const sy=58+i*32;
  const sl=await T(si.l,12,'Semi Bold',C.textSec,70);place(sl,16,sy);sevCard.appendChild(sl);
  const trk=R(248,6,solid(C.bgAlt),3);place(trk,94,sy+8);sevCard.appendChild(trk);
  const fill=R(si.w,6,solid(si.c),3);place(fill,94,sy+8);sevCard.appendChild(fill);
  const cnt=await T(i<2?'2':i===2?'1':'0',12,'Bold',C.textMuted,24);cnt.textAlignHorizontal='RIGHT';place(cnt,358,sy);sevCard.appendChild(cnt);
}

// Departments
const dCard=makeCard(dash,990,476,390,188,"Bo'limlar");
const dT=await T("Bo'limlar",14,'Bold',C.text,200);place(dT,20,18);dCard.appendChild(dT);
const dDiv=R(390,1,solid(C.divider));place(dDiv,0,48);dCard.appendChild(dDiv);
const depts=[{n:'Cardiology',b:'1 shifokor',bg:'#dbeafe',fg:C.primary},{n:'Neurology',b:'1 shifokor',bg:'#d1fae5',fg:C.success},{n:'Dermatology',b:'1 shifokor',bg:'#ede9fe',fg:C.purple},{n:'Orthopedics',b:'1 shifokor',bg:'#fef3c7',fg:C.accent}];
for(let i=0;i<depts.length;i++){
  const d=depts[i];const dy=58+i*32;
  const dn=await T(d.n,13,'Regular',C.text,200);place(dn,16,dy);dCard.appendChild(dn);
  const dbg=R(78,22,solid(d.bg),11);place(dbg,292,dy-1);dCard.appendChild(dbg);
  const dbt=await T(d.b,10,'Semi Bold',d.fg,74);dbt.textAlignHorizontal='CENTER';place(dbt,294,dy+3);dCard.appendChild(dbt);
}

// ════════════════════════════════════════════════════════════════════════════
//  03 — SHIFOKORLAR
// ════════════════════════════════════════════════════════════════════════════
const p3=figma.createPage();p3.name='03 — Shifokorlar';
const docPage=FR('Doctors Page',1440,900,solid(C.bg));
place(docPage,0,0);p3.appendChild(docPage);
await makeSidebar(docPage,'doctors');
await makeTopbar(docPage,'Shifokorlar');

const dpT=await T("Shifokorlar ro'yxati",22,'Extra Bold',C.text,500);place(dpT,288,86);docPage.appendChild(dpT);
const dpS=await T('Klinikadagi barcha shifokorlarni boshqarish',14,'Regular',C.textMuted,500);place(dpS,288,114);docPage.appendChild(dpS);
const addD=R(172,36,solid(C.primary),8);place(addD,1236,96);docPage.appendChild(addD);
const addDT=await T("+ Shifokor qo'shish",13,'Semi Bold',C.surface,160);addDT.textAlignHorizontal='CENTER';place(addDT,1236,107);docPage.appendChild(addDT);

const srch=R(400,42,solid(C.surface),10,[{type:'SOLID',color:rgb(C.border)}]);place(srch,288,148);docPage.appendChild(srch);
const srchT=await T("Ism, email yoki litsenziya bo'yicha qidirish…",13,'Regular',C.textFaint,360);place(srchT,312,160);docPage.appendChild(srchT);
const f1=R(180,42,solid(C.surface),10,[{type:'SOLID',color:rgb(C.border)}]);place(f1,700,148);docPage.appendChild(f1);
const f1T=await T('Barcha mutaxassisliklar',12,'Regular',C.textMuted,160);place(f1T,712,160);docPage.appendChild(f1T);
const f2=R(160,42,solid(C.surface),10,[{type:'SOLID',color:rgb(C.border)}]);place(f2,892,148);docPage.appendChild(f2);
const f2T=await T("Barcha bo'limlar",12,'Regular',C.textMuted,148);place(f2T,904,160);docPage.appendChild(f2T);

const docCard=makeCard(docPage,288,210,1120,560,'Doctors Table');
const dcHT=await T('Shifokorlar',14,'Bold',C.text,200);place(dcHT,20,16);docCard.appendChild(dcHT);
const dcB=R(42,22,solid(C.primaryL),11);place(dcB,126,17);docCard.appendChild(dcB);
const dcBT=await T('4 ta',10,'Semi Bold',C.primary,38);dcBT.textAlignHorizontal='CENTER';place(dcBT,128,21);docCard.appendChild(dcBT);

const dCols=[{label:'SHIFOKOR',w:220},{label:'MUTAXASSISLIK',w:130},{label:"BO'LIM",w:120},{label:'ALOQA',w:210},{label:'LITSENZIYA',w:120},{label:'ISH VAQTI',w:120},{label:'AMALLAR',w:80}];
await makeTableHeader(docCard,dCols,50);

const docRows=[
  [{type:'avatar',initials:'SJ',name:'Dr. Sarah Johnson',bg:'#dbeafe',fg:C.primary},{type:'badge',text:'Kardiologiya',bg:'#dbeafe',fg:C.primary},{type:'text',text:'Kardiologiya'},{type:'text',text:'+1-555-0101',sub:'sarah.johnson@caretrack.com'},{type:'text',text:'MD-2019-0045'},{type:'text',text:'Du-Ju 09-17'},{type:'text',text:'✏  🗑'}],
  [{type:'avatar',initials:'MC',name:'Dr. Michael Chen',bg:'#d1fae5',fg:C.success},{type:'badge',text:'Nevrologiya',bg:'#d1fae5',fg:C.success},{type:'text',text:'Nevrologiya'},{type:'text',text:'+1-555-0102',sub:'michael.chen@caretrack.com'},{type:'text',text:'MD-2017-0123'},{type:'text',text:'Du-Pa 08-16'},{type:'text',text:'✏  🗑'}],
  [{type:'avatar',initials:'AP',name:'Dr. Aisha Patel',bg:'#ede9fe',fg:C.purple},{type:'badge',text:'Dermatologiya',bg:'#ede9fe',fg:C.purple},{type:'text',text:'Dermatologiya'},{type:'text',text:'+1-555-0103',sub:'aisha.patel@caretrack.com'},{type:'text',text:'MD-2020-0067'},{type:'text',text:'Se-Sha 10-18'},{type:'text',text:'✏  🗑'}],
  [{type:'avatar',initials:'DM',name:'Dr. David Martinez',bg:'#fef3c7',fg:C.accent},{type:'badge',text:'Ortopediya',bg:'#fef3c7',fg:C.accent},{type:'text',text:'Ortopediya'},{type:'text',text:'+1-555-0104',sub:'david.martinez@caretrack.com'},{type:'text',text:'MD-2016-0089'},{type:'text',text:'Du-Ju 08-16'},{type:'text',text:'✏  🗑'}],
];
for(let i=0;i<docRows.length;i++){await makeTableRow(docCard,docRows[i],92+i*100,dCols);}

// ════════════════════════════════════════════════════════════════════════════
//  04 — BEMORLAR
// ════════════════════════════════════════════════════════════════════════════
const p4=figma.createPage();p4.name='04 — Bemorlar';
const patPage=FR('Patients Page',1440,900,solid(C.bg));
place(patPage,0,0);p4.appendChild(patPage);
await makeSidebar(patPage,'patients');
await makeTopbar(patPage,'Bemorlar');

const ppT=await T("Bemorlar ro'yxati",22,'Extra Bold',C.text,500);place(ppT,288,86);patPage.appendChild(ppT);
const ppS=await T("Klinikada ro'yxatdan o'tgan barcha bemorlar",14,'Regular',C.textMuted,500);place(ppS,288,114);patPage.appendChild(ppS);
const addP=R(186,36,solid(C.primary),8);place(addP,1222,96);patPage.appendChild(addP);
const addPT=await T("+ Bemor ro'yxatga olish",13,'Semi Bold',C.surface,172);addPT.textAlignHorizontal='CENTER';place(addPT,1222,107);patPage.appendChild(addPT);

const pSrch=R(360,42,solid(C.surface),10,[{type:'SOLID',color:rgb(C.border)}]);place(pSrch,288,148);patPage.appendChild(pSrch);
const pST=await T("Ism, email yoki sug'urta raqami…",13,'Regular',C.textFaint,320);place(pST,312,160);patPage.appendChild(pST);
const pf1=R(148,42,solid(C.surface),10,[{type:'SOLID',color:rgb(C.border)}]);place(pf1,660,148);patPage.appendChild(pf1);
const pf1T=await T('Barcha shifokorlar',11,'Regular',C.textMuted,130);place(pf1T,672,160);patPage.appendChild(pf1T);
const pf2=R(126,42,solid(C.surface),10,[{type:'SOLID',color:rgb(C.border)}]);place(pf2,820,148);patPage.appendChild(pf2);
const pf2T=await T('Barcha jinslar',11,'Regular',C.textMuted,115);place(pf2T,832,160);patPage.appendChild(pf2T);
const pf3=R(130,42,solid(C.surface),10,[{type:'SOLID',color:rgb(C.border)}]);place(pf3,958,148);patPage.appendChild(pf3);
const pf3T=await T('Qon guruhlari',11,'Regular',C.textMuted,118);place(pf3T,970,160);patPage.appendChild(pf3T);

const patCard=makeCard(patPage,288,210,1120,560,'Patients Table');
const phT=await T("Bemorlar ro'yxati",14,'Bold',C.text,260);place(phT,20,16);patCard.appendChild(phT);
const pBadge=R(42,22,solid(C.teal),11);place(pBadge,178,17);patCard.appendChild(pBadge);
const pBadgeT=await T('4 ta',10,'Semi Bold',C.tealText,38);pBadgeT.textAlignHorizontal='CENTER';place(pBadgeT,180,21);patCard.appendChild(pBadgeT);

const pCols=[{label:'BEMOR',w:200},{label:'YOSH / JINS',w:110},{label:'QON',w:60},{label:'SHIFOKOR',w:170},{label:'TELEFON',w:120},{label:"SUG'URTA",w:110},{label:'SANA',w:90},{label:'AMALLAR',w:80}];
await makeTableHeader(patCard,pCols,50);

const patRows=[
  [{type:'avatar',initials:'SL',name:'Susan Lee',sub:'susan.lee@email.com',bg:'#ede9fe',fg:C.purple},{type:'text',text:'58 yosh / Ayol'},{type:'badge',text:'AB+',bg:'#ede9fe',fg:C.purple},{type:'text',text:'Dr. Aisha Patel'},{type:'text',text:'+1-555-1007'},{type:'text',text:'INS-2024-004'},{type:'text',text:'15 Mar 24'},{type:'text',text:'👁 ✏ 🗑'}],
  [{type:'avatar',initials:'RG',name:'Robert Garcia',sub:'robert@email.com',bg:'#d1fae5',fg:C.success},{type:'text',text:'35 yosh / Erkak'},{type:'badge',text:'B+',bg:'#d1fae5',fg:C.success},{type:'text',text:'Dr. Michael Chen'},{type:'text',text:'+1-555-1005'},{type:'text',text:'INS-2024-003'},{type:'text',text:'10 Mar 24'},{type:'text',text:'👁 ✏ 🗑'}],
  [{type:'avatar',initials:'LT',name:'Linda Thompson',sub:'linda@email.com',bg:'#fee2e2',fg:C.danger},{type:'text',text:'53 yosh / Ayol'},{type:'badge',text:'O-',bg:'#fee2e2',fg:C.danger},{type:'text',text:'Dr. Sarah Johnson'},{type:'text',text:'+1-555-1003'},{type:'text',text:'INS-2024-002'},{type:'text',text:'5 Mar 24'},{type:'text',text:'👁 ✏ 🗑'}],
  [{type:'avatar',initials:'JW',name:'James Wilson',sub:'james@email.com',bg:'#dbeafe',fg:C.primary},{type:'text',text:'41 yosh / Erkak'},{type:'badge',text:'A+',bg:'#dbeafe',fg:C.primary},{type:'text',text:'Dr. Sarah Johnson'},{type:'text',text:'+1-555-1001'},{type:'text',text:'INS-2024-001'},{type:'text',text:'1 Mar 24'},{type:'text',text:'👁 ✏ 🗑'}],
];
for(let i=0;i<patRows.length;i++){await makeTableRow(patCard,patRows[i],92+i*100,pCols);}

// ════════════════════════════════════════════════════════════════════════════
//  05 — BEMOR PROFILI
// ════════════════════════════════════════════════════════════════════════════
const p5=figma.createPage();p5.name='05 — Bemor Profili';
const profPage=FR('Patient Profile',1440,960,solid(C.bg));
place(profPage,0,0);p5.appendChild(profPage);
await makeSidebar(profPage,'patients');
await makeTopbar(profPage,'Bemor profili');

const bcT=await T("Bemorlar  ›  James Wilson",12,'Regular',C.textMuted,300);place(bcT,288,78);profPage.appendChild(bcT);

// Hero
const hero=FR('Hero Banner',1120,128,solid(C.sidebarBg));
hero.cornerRadius=14;place(hero,288,102);profPage.appendChild(hero);
const hAv=R(68,68,solid(C.primary,0.28),16);place(hAv,24,30);hero.appendChild(hAv);
const hAvT=await T('JW',22,'Extra Bold',C.surface,68);hAvT.textAlignHorizontal='CENTER';place(hAvT,24,50);hero.appendChild(hAvT);
const hNm=await T('James Wilson',24,'Extra Bold',C.surface,400);place(hNm,108,26);hero.appendChild(hNm);
const hG=R(58,24,solid(C.surface,0.18),12);place(hG,108,58);hero.appendChild(hG);
const hGT=await T('Erkak',11,'Semi Bold',C.surface,54);hGT.textAlignHorizontal='CENTER';place(hGT,110,62);hero.appendChild(hGT);
const hBl=R(38,24,solid(C.primaryL,0.18),12);place(hBl,174,58);hero.appendChild(hBl);
const hBlT=await T('A+',11,'Semi Bold',C.surface,34);hBlT.textAlignHorizontal='CENTER';place(hBlT,176,62);hero.appendChild(hBlT);
const hMeta=await T('🗓 1985 yil 15 mart (41 yosh)    📞 +1-555-1001    ✉ james.wilson@email.com',12,'Regular','#94a3b8',700);place(hMeta,108,90);hero.appendChild(hMeta);
const addDxB=R(160,34,solid(C.surface,0.15),8);place(addDxB,936,48);hero.appendChild(addDxB);
const addDxBT=await T("+ Tashxis qo'shish",12,'Semi Bold',C.surface,148);addDxBT.textAlignHorizontal='CENTER';place(addDxBT,938,58);hero.appendChild(addDxBT);

// Left col
// Personal info
const piCard=makeCard(profPage,288,252,728,160,"Shaxsiy ma'lumotlar");
const piT=await T("Shaxsiy ma'lumotlar",14,'Bold',C.text,300);place(piT,20,16);piCard.appendChild(piT);
const editB=R(90,28,solid(C.bgAlt),8);place(editB,618,16);piCard.appendChild(editB);
const editBT=await T('✏ Tahrirlash',11,'Semi Bold',C.textSec,84);editBT.textAlignHorizontal='CENTER';place(editBT,620,20);piCard.appendChild(editBT);
const piDiv=R(728,1,solid(C.divider));place(piDiv,0,50);piCard.appendChild(piDiv);
const piFs=[
  {l:"SUG'URTA RAQAMI",v:'INS-2024-001',x:20,y:62},
  {l:"RO'YXATGA OLINGAN",v:'1 Mar 2024',x:240,y:62},
  {l:'MANZIL',v:'123 Oak Street, Springfield',x:20,y:106},
  {l:'FAVQULODDA ALOQA',v:'Mary Wilson - +1-555-1002',x:360,y:106},
];
for(const f of piFs){
  const fl=await T(f.l,9,'Bold',C.textMuted,200);place(fl,f.x,f.y);piCard.appendChild(fl);
  const fv=await T(f.v,13,'Regular',C.text,280);place(fv,f.x,f.y+16);piCard.appendChild(fv);
}

// Diagnoses
const dxCard2=makeCard(profPage,288,432,728,400,'Tashxislar tarixi');
const dxT2=await T('Tashxislar tarixi',14,'Bold',C.text,280);place(dxT2,20,16);dxCard2.appendChild(dxT2);
const dxS2=await T("Bemorga qo'yilgan barcha tashxislar",12,'Regular',C.textMuted,360);place(dxS2,20,36);dxCard2.appendChild(dxS2);
const dxB2=R(72,22,solid(C.amber),11);place(dxB2,636,17);dxCard2.appendChild(dxB2);
const dxBT2=await T('2 ta yozuv',10,'Semi Bold',C.amberText,68);dxBT2.textAlignHorizontal='CENTER';place(dxBT2,638,21);dxCard2.appendChild(dxBT2);
const dx2Cols=[{label:'ICD KODI',w:80},{label:'TASHXIS',w:260},{label:"OG'IRLIK",w:90},{label:'HOLAT',w:130},{label:'SANA',w:90}];
await makeTableHeader(dxCard2,dx2Cols,60);
const dx2Rows=[
  [{type:'text',text:'I10'},{type:'text',text:'Essential (primary) hypertension',sub:'Amlodipine 5mg daily'},{type:'badge',text:"O'rtacha",bg:'#fef3c7',fg:C.amberText},{type:'badge',text:'Davom etmoqda',bg:'#fef3c7',fg:C.amberText},{type:'text',text:'2 Mar 2024'}],
  [{type:'text',text:'E11'},{type:'text',text:'Type 2 diabetes mellitus',sub:'Metformin 500mg twice daily'},{type:'badge',text:'Yengil',bg:'#dcfce7',fg:C.success},{type:'badge',text:'Davom etmoqda',bg:'#fef3c7',fg:C.amberText},{type:'text',text:'15 Mar 2024'}],
];
for(let i=0;i<dx2Rows.length;i++){await makeTableRow(dxCard2,dx2Rows[i],100+i*130,dx2Cols);}

// Right col
const dcCard=makeCard(profPage,1034,252,378,230,"Mas'ul shifokor");
const dcT2=await T("Mas'ul shifokor",14,'Bold',C.text,280);place(dcT2,20,16);dcCard.appendChild(dcT2);
const dcDiv=R(378,1,solid(C.divider));place(dcDiv,0,48);dcCard.appendChild(dcDiv);
const dcAv=R(56,56,solid(C.primaryL),14);place(dcAv,161,66);dcCard.appendChild(dcAv);
const dcAvT=await T('SJ',18,'Extra Bold',C.primary,56);dcAvT.textAlignHorizontal='CENTER';place(dcAvT,161,78);dcCard.appendChild(dcAvT);
const dcNm=await T('Dr. Sarah Johnson',14,'Bold',C.text,338);dcNm.textAlignHorizontal='CENTER';place(dcNm,20,132);dcCard.appendChild(dcNm);
const dcSp=R(90,24,solid(C.primaryL),12);place(dcSp,144,154);dcCard.appendChild(dcSp);
const dcSpT=await T('Kardiologiya',10,'Semi Bold',C.primary,86);dcSpT.textAlignHorizontal='CENTER';place(dcSpT,146,158);dcCard.appendChild(dcSpT);
const dcMt=await T('📞 +1-555-0101\n✉ sarah.johnson@caretrack.com',12,'Regular',C.textMuted,338);dcMt.textAlignHorizontal='CENTER';dcMt.lineHeight={value:180,unit:'PERCENT'};place(dcMt,20,186);dcCard.appendChild(dcMt);

const hsCard=makeCard(profPage,1034,498,378,200,"Sog'liq xulosasi");
const hsT2=await T("Sog'liq xulosasi",14,'Bold',C.text,280);place(hsT2,20,16);hsCard.appendChild(hsT2);
const hsDiv=R(378,1,solid(C.divider));place(hsDiv,0,48);hsCard.appendChild(hsDiv);
const hsIs=[{l:'Yengil',c:'0',col:C.success},{l:"O'rtacha",c:'1',col:C.accent},{l:"Og'ir",c:'1',col:C.danger},{l:'Kritik',c:'0',col:C.purple}];
for(let i=0;i<hsIs.length;i++){
  const hi=hsIs[i];const hy=60+i*26;
  const hl=await T(hi.l,12,'Regular',C.text,150);place(hl,20,hy);hsCard.appendChild(hl);
  const hc=await T(hi.c,13,'Bold',hi.col,40);hc.textAlignHorizontal='RIGHT';place(hc,318,hy);hsCard.appendChild(hc);
}
const hsBig=R(338,52,solid(C.primaryL),10);place(hsBig,20,170);hsCard.appendChild(hsBig);
const hsBigN=await T('2',24,'Extra Bold',C.primary,338);hsBigN.textAlignHorizontal='CENTER';place(hsBigN,20,177);hsCard.appendChild(hsBigN);
const hsBigL=await T('Jami tashxislar',12,'Regular',C.textMuted,338);hsBigL.textAlignHorizontal='CENTER';place(hsBigL,20,208);hsCard.appendChild(hsBigL);

// ════════════════════════════════════════════════════════════════════════════
//  06 — TASHXISLAR
// ════════════════════════════════════════════════════════════════════════════
const p6=figma.createPage();p6.name='06 — Tashxislar';
const dxPage=FR('Diagnoses Page',1440,960,solid(C.bg));
place(dxPage,0,0);p6.appendChild(dxPage);
await makeSidebar(dxPage,'diseases');
await makeTopbar(dxPage,'Tashxislar');

const txT2=await T('Tashxis va kasallik yozuvlari',22,'Extra Bold',C.text,600);place(txT2,288,86);dxPage.appendChild(txT2);
const txS2=await T("Barcha bemorlarning kasallik tarixi va tashxislari",14,'Regular',C.textMuted,600);place(txS2,288,114);dxPage.appendChild(txS2);
const addTx=R(164,36,solid(C.primary),8);place(addTx,1244,96);dxPage.appendChild(addTx);
const addTxT=await T("+ Tashxis qo'shish",13,'Semi Bold',C.surface,152);addTxT.textAlignHorizontal='CENTER';place(addTxT,1244,107);dxPage.appendChild(addTxT);

const txSrch=R(350,42,solid(C.surface),10,[{type:'SOLID',color:rgb(C.border)}]);place(txSrch,288,148);dxPage.appendChild(txSrch);
const txST=await T("Tavsif, ICD kodi yoki belgilar bo'yicha qidirish…",13,'Regular',C.textFaint,310);place(txST,312,160);dxPage.appendChild(txST);
const txf1=R(150,42,solid(C.surface),10,[{type:'SOLID',color:rgb(C.border)}]);place(txf1,650,148);dxPage.appendChild(txf1);
const txf1T=await T("Barcha og'irlik darajalari",11,'Regular',C.textMuted,138);place(txf1T,662,160);dxPage.appendChild(txf1T);
const txf2=R(128,42,solid(C.surface),10,[{type:'SOLID',color:rgb(C.border)}]);place(txf2,812,148);dxPage.appendChild(txf2);
const txf2T=await T('Barcha holatlar',11,'Regular',C.textMuted,116);place(txf2T,824,160);dxPage.appendChild(txf2T);
const txf3=R(130,42,solid(C.surface),10,[{type:'SOLID',color:rgb(C.border)}]);place(txf3,952,148);dxPage.appendChild(txf3);
const txf3T=await T('Barcha bemorlar',11,'Regular',C.textMuted,118);place(txf3T,964,160);dxPage.appendChild(txf3T);

const txCard2=makeCard(dxPage,288,210,1120,600,'Diagnoses Table');
const txHT=await T('Tashxis yozuvlari',14,'Bold',C.text,280);place(txHT,20,16);txCard2.appendChild(txHT);
const txBadge=R(42,22,solid(C.amber),11);place(txBadge,178,17);txCard2.appendChild(txBadge);
const txBadgeT=await T('5 ta',10,'Semi Bold',C.amberText,38);txBadgeT.textAlignHorizontal='CENTER';place(txBadgeT,180,21);txCard2.appendChild(txBadgeT);

const txCols=[{label:'ICD KODI',w:76},{label:'TASHXIS',w:268},{label:'BEMOR',w:136},{label:"OG'IRLIK",w:88},{label:'HOLAT',w:126},{label:'SANA',w:88},{label:'AMALLAR',w:78}];
await makeTableHeader(txCard2,txCols,50);

const txRows=[
  [{type:'text',text:'I10'},{type:'text',text:'Essential (primary) hypertension',sub:'Headache, dizziness, shortness of breath'},{type:'text',text:'James Wilson',bold:true},{type:'badge',text:"O'rtacha",bg:'#fef3c7',fg:C.amberText},{type:'badge',text:'Davom etmoqda',bg:'#fef3c7',fg:C.amberText},{type:'text',text:'2 Mar 2024'},{type:'text',text:'👁 ✏ 🗑'}],
  [{type:'text',text:'E11'},{type:'text',text:'Type 2 diabetes mellitus',sub:'Frequent urination, increased thirst'},{type:'text',text:'James Wilson',bold:true},{type:'badge',text:'Yengil',bg:'#dcfce7',fg:C.success},{type:'badge',text:'Davom etmoqda',bg:'#fef3c7',fg:C.amberText},{type:'text',text:'15 Mar 2024'},{type:'text',text:'👁 ✏ 🗑'}],
  [{type:'text',text:'I25'},{type:'text',text:'Chronic ischaemic heart disease',sub:'Chest pain, fatigue, palpitations'},{type:'text',text:'Linda Thompson',bold:true},{type:'badge',text:"Og'ir",bg:'#fee2e2',fg:C.danger},{type:'badge',text:'Davom etmoqda',bg:'#fef3c7',fg:C.amberText},{type:'text',text:'6 Mar 2024'},{type:'text',text:'👁 ✏ 🗑'}],
  [{type:'text',text:'G43'},{type:'text',text:'Migraine',sub:'Severe headache, nausea, photophobia'},{type:'text',text:'Robert Garcia',bold:true},{type:'badge',text:"O'rtacha",bg:'#fef3c7',fg:C.amberText},{type:'badge',text:'Qaytuvchi',bg:'#dbeafe',fg:C.primary},{type:'text',text:'11 Mar 2024'},{type:'text',text:'👁 ✏ 🗑'}],
  [{type:'text',text:'L20'},{type:'text',text:'Atopic dermatitis',sub:'Itching, dry skin, rash on arms and neck'},{type:'text',text:'Susan Lee',bold:true},{type:'badge',text:'Yengil',bg:'#dcfce7',fg:C.success},{type:'badge',text:'Surunkali',bg:C.sky,fg:C.skyText},{type:'text',text:'16 Mar 2024'},{type:'text',text:'👁 ✏ 🗑'}],
];
for(let i=0;i<txRows.length;i++){await makeTableRow(txCard2,txRows[i],74+i*100,txCols);}

// ─── Yakunlash ───────────────────────────────────────────────────────────────
figma.currentPage=page1;
figma.viewport.scrollAndZoomIntoView([login]);
figma.notify('✅ CareTrack — barcha 6 ta ekran muvaffaqiyatli yaratildi!', {timeout:5000});
