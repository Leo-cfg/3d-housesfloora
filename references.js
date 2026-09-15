import * as T from 'three';
import {RoundedBoxGeometry} from 'three/addons/geometries/RoundedBoxGeometry.js';
import {boundary,annex,groundOutline,upperOutline,balconyOutline} from './site-data.js';
export const roomNames={'1-4':'Svetainė, virtuvė ir valgomasis','1-3':'Pagalbinė patalpa ≈','1-1':'Prieškambaris','1-2':'Holas ir laiptai','1-5':'Pagalbinė patalpa ≈','1-6':'Ūkinė patalpa / WC','G-1':'Garažas','1-8':'Darbo kambarys ≈','1-9':'Miegamasis ≈','1-7':'Antro aukšto holas','1-11':'Vonios kambarys','1-14':'Drabužinė','1-13':'Kambarys 1-13 ≈','1-12':'Kambarys 1-12 ≈'};
export const furnitureNames={'Sofa':'Kampinė sofa','Coffee table':'Žurnalinis staliukas','Dining table':'Valgomojo stalas','Desk':'Rašomasis stalas','Chair':'Kėdė','Wardrobe':'Spinta','Kitchen counter':'Virtuvės spintelė','Bath':'Vonia','Shower':'Dušas','WC':'Unitazas','Plant':'Augalas','Garage storage':'Garažo lentynos'};
// Procedural material patterns only; dimensions and finishes remain reference estimates.
function texture(kind,a,b){const c=document.createElement('canvas');c.width=c.height=256;const x=c.getContext('2d');x.fillStyle=a;x.fillRect(0,0,256,256);x.fillStyle=b;
if(kind==='brick'){for(let row=0;row<8;row++){x.fillRect(0,row*32,256,3);for(let col=-1;col<5;col++)x.fillRect(col*64+(row%2)*32,row*32,3,32);}}
if(kind==='tile'||kind==='check'){for(let i=0;i<4;i++)for(let j=0;j<4;j++){if(kind==='check'&&(i+j)%2)x.fillRect(i*64,j*64,64,64);x.strokeStyle='#9e968955';x.lineWidth=1;x.strokeRect(i*64,j*64,64,64);}}
if(kind==='wood'){for(let i=0;i<12;i++){x.fillRect(i*22,0,1,256);for(let j=0;j<8;j++){x.globalAlpha=.1;x.fillRect(i*22+3+(j*7)%17,0,1,256);x.globalAlpha=1;}x.fillRect(i*22,(i%3)*83,22,1);}}
if(kind==='stripes'){for(let i=0;i<8;i++)x.fillRect(i*32,0,16,256);}
if(kind==='stucco'||kind==='grass'){let seed=13;for(let i=0;i<5000;i++){seed=(seed*1664525+1013904223)>>>0;const xx=seed%256;seed=(seed*1664525+1013904223)>>>0;x.globalAlpha=.17;x.fillRect(xx,seed%256,2,2);}x.globalAlpha=1;}
const t=new T.CanvasTexture(c);t.wrapS=t.wrapT=T.RepeatWrapping;t.colorSpace=T.SRGBColorSpace;t.anisotropy=4;return t;}
export function enhanceHouse({scene,floors,rooms,walls,furniture,box,cylinder,mat,white,wood,metal,glass}){
const material=(color,pattern,other)=>{const m=mat(color);if(pattern){m.map=texture(pattern,color,other);m.color.set('#ffffff');}return m;};
const oak=material('#bf8a47','wood','#86552e'),walnut=material('#64442e','wood','#3d291c'),brick=material('#a9512d','brick','#c89b76'),stucco=material('#aeb45b','stucco','#687036'),cream=mat('#e7d7bb'),linen=mat('#c9ab7d'),brown=mat('#655043'),steel=mat('#90999a'),frame=mat('#3d3024'),stone=material('#95836b','brick','#c0ac90'),bathTile=material('#d4c8b4','tile','#a39d93'),darkTile=material('#746c60','tile','#a29a8c');
wood.copy(oak);metal.copy(steel);
const roomStyle={'1-4':material('#e5ddca','tile','#b9b5a5'),'1-2':material('#e7d9bb','check','#bc976c'),'1-1':material('#e7d9bb','check','#bc976c'),'1-11':darkTile};
rooms.forEach(r=>{r.surface.material=roomStyle[r.id]||(r.f===1?oak:material('#d9d3c4','tile','#b8b1a0'));r.groups.forEach(g=>g.traverse(q=>{if(!q.isMesh)return;if(walls.includes(q))q.material=r.id==='1-11'?bathTile:r.id==='1-2'?material('#d4ac72','stucco','#a57d50'):cream;else if(q.material===white)q.material=frame;}));});
const fixed=[new T.Group(),new T.Group()];fixed.forEach((g,i)=>floors[i].add(g));
function round(g,w,h,d,x,y,z,m=cream,r=.07){const q=new T.Mesh(new RoundedBoxGeometry(w,h,d,2,Math.min(r,w/3,h/3,d/3)),m);q.position.set(x,y,z);q.castShadow=q.receiveShadow=true;g.add(q);return q;}
function beam(g,a,b,r,m){const av=new T.Vector3(...a),bv=new T.Vector3(...b);const q=new T.Mesh(new T.CylinderGeometry(r,r,av.distanceTo(bv),10),m);q.position.copy(av).add(bv).multiplyScalar(.5);q.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),bv.sub(av).normalize());q.castShadow=true;g.add(q);return q;}
function furnitureGroup(f,label,x,z,w,d,rot=0){const g=new T.Group();g.position.set(x,0,z);g.rotation.y=rot;g.userData={type:label,label,f,w,d,initial:[x,z,rot]};floors[f].add(g);furniture.push(g);return g;}
function tag(g){g.traverse(q=>{if(q.isMesh)q.userData.furniture=g;});}
function table(g,w,d,h=.46){box(g,w,.085,d,0,h,0,walnut);for(const a of[-1,1])for(const b of[-1,1])box(g,.065,h,.065,a*(w/2-.09),h/2,b*(d/2-.09),walnut);}
function sofa(g,w=2.65,d=.92){round(g,w,.35,d,0,.35,0,brown);round(g,w,.52,.22,0,.69,-d/2+.06,brown);for(let i=0;i<3;i++){round(g,w/3-.08,.18,d*.7,-w/3+i*w/3,.57,.04,brown);round(g,w/3-.08,.38,.2,-w/3+i*w/3,.83,-.25,brown);}for(const a of[-1,1])round(g,.19,.42,d,a*(w/2-.08),.6,0,brown);round(g,.72,.39,1.7,w/2-.4,.34,.57,brown);round(g,.65,.13,1.1,w/2-.4,.58,.7,brown);const cushion=round(g,.34,.34,.13,-w/2+.37,.84,-.14,mat('#c9a546'));cushion.rotation.z=.25;}
// Replace the generic living furniture and the provisional bedroom used as an office.
for(let i=furniture.length-1;i>=0;i--){const p=furniture[i];const {f,type}=p.userData;if((f===0&&['Sofa','Coffee table'].includes(type))||(f===1&&['Bed · bedroom 1','Desk','Chair'].includes(type))||(f===1&&['Bath','Kitchen counter'].includes(type))){p.removeFromParent();furniture.splice(i,1);continue;}p.userData.label=furnitureNames[type]||(type.startsWith('Bed')?'Lova · orientacinė':'Baldas · orientacinis');if(type==='Desk'||type==='Dining table'||type==='Coffee table')p.traverse(q=>{if(q.isMesh&&q.material===wood)q.material=walnut;});if(type==='Wardrobe')p.traverse(q=>{if(q.isMesh)q.material=oak;});}
let g=furnitureGroup(0,'Rudas minkštas kampas · vieta ≈',4.5,1.3,2.65,2.1);sofa(g);tag(g);
g=furnitureGroup(0,'Tamsaus medžio staliukas',4.25,2.8,1.05,.66);table(g,1.05,.66);tag(g);
g=furnitureGroup(1,'Medinis rašomasis stalas · vieta ≈',3.8,2.4,1.65,.78);table(g,1.65,.78,.76);box(g,.92,.012,.45,0,.813,.02,mat('#35302a'));beam(g,[.59,.81,-.2],[.68,1.3,-.22],.018,frame);const shade=new T.Mesh(new T.ConeGeometry(.14,.17,16),frame);shade.rotation.z=.4;shade.position.set(.55,1.32,-.22);g.add(shade);tag(g);
g=furnitureGroup(1,'Darbo kėdė',3.8,3.16,.6,.6,Math.PI);round(g,.52,.12,.5,0,.51,0,brown);round(g,.5,.65,.1,0,.85,-.2,brown);cylinder(g,.055,.4,0,.25,0,steel);for(let i=0;i<5;i++){const a=i*Math.PI*2/5;beam(g,[0,.12,0],[Math.sin(a)*.31,.08,Math.cos(a)*.31],.025,frame);}tag(g);
g=furnitureGroup(1,'Šviesus poilsio krėslas · vieta ≈',1.8,3.1,.82,.9,-.35);round(g,.75,.18,.8,0,.5,0,linen);const back=round(g,.73,.9,.18,0,.95,-.3,linen);back.rotation.x=-.15;for(const a of[-1,1])round(g,.13,.35,.65,a*.4,.7,0,linen);cylinder(g,.34,.07,0,.13,0,steel);tag(g);
function fireplace(parent,x,z,rot=0,office=false){const q=new T.Group();q.position.set(x,0,z);q.rotation.y=rot;parent.add(q);box(q,1.03,1.03,.5,0,.57,0,office?oak:stone);box(q,.67,.48,.035,0,.65,.27,frame);box(q,1.16,.08,.61,0,1.1,0,darkTile);box(q,.92,.9,.45,0,1.6,-.025,office?stucco:cream);box(q,.52,.07,.015,0,1.9,.21,frame);}
fireplace(fixed[0],1.75,1.5,Math.PI/2);fireplace(fixed[1],1.05,1.05,Math.PI/2,true);
box(fixed[0],1.7,.68,.43,2.35,.39,.7,walnut);box(fixed[0],1.53,.85,.06,2.35,1.15,.68,frame);
// Aquarium and warm wooden cabinet visible beyond the stair hall.
box(fixed[0],1.25,.72,.5,6.3,.42,.76,oak);box(fixed[0],1.25,.55,.47,6.3,1.06,.76,glass);box(fixed[0],1.28,.04,.5,6.3,1.35,.76,frame);for(let i=0;i<8;i++){const leaf=new T.Mesh(new T.ConeGeometry(.055,.25+(i%3)*.05,6),mat('#356b43'));leaf.position.set(5.82+i*.13,1.03,.76+(i%2)*.12);fixed[0].add(leaf);}
// Striped office wall is a finish, not a change to its polygon.
const office=rooms.find(r=>r.id==='1-8');office.groups[0].traverse(q=>{if(q.isMesh&&walls.includes(q))q.material=material('#dcd4c7','stripes','#7a7060');});
function curtains(parent,x,z,w,rot=0){const q=new T.Group();q.position.set(x,0,z);q.rotation.y=rot;parent.add(q);for(const side of[-1,1])for(let i=0;i<6;i++)cylinder(q,.035,2.35,side*w/2+i*.055,1.27,.12,linen);}
curtains(fixed[0],7.92,.62,1.5);curtains(fixed[1],2.15,4.3,2.2);curtains(fixed[1],4.62,8,1.15,Math.PI/2);
// Rounded corner bathtub, wall-hung basin, mirror and towel warmer.
g=furnitureGroup(1,'Kampinė vonia · proporcijos ≈',10.65,6.13,1.1,1.7);round(g,1.05,.58,1.7,0,.34,0,white,.2);round(g,.83,.035,1.42,0,.64,0,mat('#c2d5d3'),.2);tag(g);
const bath=fixed[1];box(bath,1.15,.11,.53,9.9,.81,8.55,darkTile);round(bath,.65,.19,.38,9.9,.95,8.57,white);box(bath,.64,1,.055,9.9,1.65,8.79,mat('#b5c3c6',.08));for(let i=0;i<12;i++)beam(bath,[10.8,.65+i*.065,8.75],[11.25,.65+i*.065,8.75],.018,white);beam(bath,[10.8,.61,8.75],[10.8,1.5,8.75],.024,white);beam(bath,[11.25,.61,8.75],[11.25,1.5,8.75],.024,white);
box(fixed[1],.95,2.25,.43,5.02,1.17,6.1,oak);box(fixed[1],.025,2.25,.015,5.02,1.17,6.33,steel);
const exterior=new T.Group();exterior.visible=false;scene.add(exterior);const roof=new T.Group();exterior.add(roof);const shell=new T.Group();exterior.add(shell);
function polygon(parent,p,y,m,thickness=.12){const shape=new T.Shape(p.map(([x,z])=>new T.Vector2(x,-z)));const geo=new T.ExtrudeGeometry(shape,{depth:thickness,bevelEnabled:false});const mesh=new T.Mesh(geo,m);mesh.rotation.x=-Math.PI/2;mesh.position.y=y;mesh.receiveShadow=true;mesh.castShadow=true;parent.add(mesh);return mesh;}
polygon(exterior,boundary,-.19,material('#6f854c','grass','#365630'),.12);
// Boundary, street and driveway use the site image transform. No pool inferred.
function railing(parent,a,b,y,h=.95,fence=false){const len=Math.hypot(b[0]-a[0],b[1]-a[1]);const n=Math.ceil(len/(fence?2:1.05));for(let i=0;i<=n;i++){const t=i/n;beam(parent,[a[0]+(b[0]-a[0])*t,y,a[1]+(b[1]-a[1])*t],[a[0]+(b[0]-a[0])*t,y+h,a[1]+(b[1]-a[1])*t],fence?.055:.025,fence?cream:steel);}for(let j=1;j<=(fence?6:4);j++){const yy=y+j*h/(fence?6:4);beam(parent,[a[0],yy,a[1]],[b[0],yy,b[1]],fence?.045:.018,fence?mat('#72745a'):steel);}}
boundary.forEach((p,i)=>{const next=boundary[(i+1)%4];if(i===1){const at=t=>[p[0]+(next[0]-p[0])*t,p[1]+(next[1]-p[1])*t];railing(exterior,p,at(.2),-.05,1.25,true);railing(exterior,at(.53),next,-.05,1.25,true);railing(exterior,at(.2),at(.53),-.05,.85);return;}railing(exterior,p,next,-.05,1.25,true);});
polygon(exterior,[[-8.2,18.1],[17.2,18.7],[17.2,21.7],[-8.2,21.1]],-.18,mat('#89918e'),.03);
const paving=material('#a6a399','tile','#797b75');polygon(exterior,[[4.1,15.45],[10.9,15.45],[11.25,17.75],[3.8,17.55]],-.06,paving,.07);
polygon(exterior,[[-.7,-.35],[.12,-.1],[4.5,15.5],[3.55,15.52]],-.04,paving,.06);polygon(exterior,[[11.08,4.1],[13.05,4.1],[13.05,10.1],[10.95,10.1]],-.04,paving,.06);
function facade(poly,y,finish,openings){poly.forEach((a,i)=>{const b=poly[(i+1)%poly.length],len=Math.hypot(b[0]-a[0],b[1]-a[1]),q=new T.Group();q.position.set(a[0],y,a[1]);q.rotation.y=-Math.atan2(b[1]-a[1],b[0]-a[0]);shell.add(q);const spans=openings[i]||[];let last=0;const panel=(from,to,hh,yy)=>{if(to-from>.001)box(q,to-from,hh,.22,(to+from)/2,yy,0,finish);};for(const [t,u,kind]of spans){const start=t*len,end=u*len,sill=kind==='door'||kind==='large'?.06:.8,top=kind==='garage'?2.35:2.55;panel(last,start,3.05,1.525);panel(start,end,sill,sill/2);panel(start,end,3.05-top,(3.05+top)/2);if(kind==='garage'){box(q,end-start,top,.08,(end+start)/2,top/2,0,frame);for(let k=1;k<8;k++)box(q,end-start,.025,.1,(end+start)/2,k*top/8,0,steel);}else{box(q,end-start,top-sill,.045,(end+start)/2,(top+sill)/2,0,kind==='door'?oak:glass);for(const xx of[start,end])box(q,.065,top-sill,.13,xx,(top+sill)/2,0,frame);for(const yy of[sill,top])box(q,end-start,.065,.13,(end+start)/2,yy,0,frame);box(q,.045,top-sill,.13,(start+end)/2,(sill+top)/2,0,frame);}last=end;}panel(last,len,3.05,1.525);});}
facade(groundOutline,0,brick,{0:[[.66,.81,'window']],2:[],3:[[.3,.5,'door'],[.65,.75,'window']],5:[[.5,.67,'window']],6:[[.18,.82,'garage']],7:[[.22,.29,'door'],[.45,.52,'window'],[.58,.66,'window'],[.82,.92,'large']]});
facade(upperOutline,3.05,stucco,{0:[[.66,.79,'window']],3:[[.25,.37,'window'],[.59,.69,'window']],6:[[.25,.55,'window']],7:[[.3,.58,'window']],9:[[.17,.53,'large']],11:[[.15,.95,'large']]});
polygon(roof,upperOutline,6.1,mat('#666e66'),.12);upperOutline.forEach((a,i)=>{const b=upperOutline[(i+1)%upperOutline.length];const q=new T.Group();q.position.set((a[0]+b[0])/2,6.18,(a[1]+b[1])/2);q.rotation.y=-Math.atan2(b[1]-a[1],b[0]-a[0]);roof.add(q);box(q,Math.hypot(b[0]-a[0],b[1]-a[1]),.28,.18,0,.1,0,stucco);box(q,Math.hypot(b[0]-a[0],b[1]-a[1])+.04,.04,.22,0,.26,0,frame);});
for(const [x,z]of[[1.2,1.1],[3.3,10.1]]){cylinder(roof,.1,.95,x,6.65,z,steel);cylinder(roof,.16,.05,x,7.13,z,frame);}
// Balcony remains attached to the upper floor in every floor mode.
polygon(floors[1],balconyOutline,-.07,paving,.12);for(const i of[0,2,3])railing(floors[1],balconyOutline[i],balconyOutline[(i+1)%4],.06);
const outdoorFurniture=new T.Group();outdoorFurniture.position.set(2.35,0,6.45);floors[1].add(outdoorFurniture);cylinder(outdoorFurniture,.35,.04,0,.74,0,glass);for(let i=0;i<3;i++){const a=i*2.094;beam(outdoorFurniture,[Math.sin(a)*.25,.04,Math.cos(a)*.25],[0,.72,0],.019,frame);}round(outdoorFurniture,.52,.1,.5,.1,.48,1.02,brown);round(outdoorFurniture,.52,.55,.12,.1,.79,1.24,brown);for(const x of[-.12,.32])for(const z of[.8,1.24])beam(outdoorFurniture,[x,.05,z],[x,.47,z],.019,frame);
// Existing ancillary footprint: wooden sauna and covered sitting zone are approximate assignments.
polygon(exterior,annex,-.04,oak,.15);const sauna=new T.Group();sauna.position.set(.5,0,-2.15);exterior.add(sauna);box(sauna,3,.14,3.3,0,.07,0,oak);box(sauna,3,2.6,.15,0,1.3,-1.6,oak);box(sauna,.15,2.6,3.3,1.45,1.3,0,oak);box(sauna,3,2.6,.15,0,1.3,1.6,oak);box(sauna,.14,.75,3.3,-1.45,.4,0,oak);box(sauna,.08,1.12,1,-1.5,1.43,-.45,glass);for(let i=0;i<7;i++){box(sauna,2.3,.055,.09,-.1,.58,.8+i*.105,oak);box(sauna,2.3,.055,.09,-.1,1.08,.8+i*.105,oak);}box(sauna,.55,.6,.55,-.82,.37,-1.03,frame);for(let i=0;i<7;i++){const rock=new T.Mesh(new T.DodecahedronGeometry(.09),mat('#4d514e'));rock.position.set(-1.0+(i%3)*.12,.73,-1.2+Math.floor(i/3)*.12);sauna.add(rock);}polygon(roof,annex,2.7,frame,.14);
const terrace=new T.Group();terrace.position.set(-3,0,2.25);exterior.add(terrace);const patioSofa=new T.Group();patioSofa.rotation.y=-Math.PI/2;patioSofa.position.set(.4,.14,-.1);terrace.add(patioSofa);sofa(patioSofa,2.35,.8);const coffee=new T.Group();coffee.position.set(-.65,.14,-.25);terrace.add(coffee);table(coffee,.65,1.15,.46);
const awning=new T.Group();awning.position.set(-3,2.6,2.25);awning.rotation.z=.12;roof.add(awning);box(awning,4.1,.045,4.3,0,0,0,material('#c7a66b','stripes','#3b3027'));box(awning,.035,.25,4.3,-2.04,-.12,0,material('#c7a66b','stripes','#3b3027'));for(const z of[.2,4.3])beam(exterior,[-5.05,.13,z],[-5.05,2.4,z],.035,frame);
function tree(parent,x,z,h=2.8,kind='thuja'){const group=new T.Group();group.position.set(x,-.01,z);parent.add(group);cylinder(group,.08,h*.45,0,h*.2,0,walnut);for(let i=0;i<4;i++){const geo=new T.ConeGeometry((kind==='spruce'?.72:.37)*(1-i*.17),h*.48,9);const m=new T.Mesh(geo,mat(kind==='spruce'?'#537970':'#426137'));m.position.y=h*.33+i*h*.15;m.castShadow=true;group.add(m);}return group;}
for(let i=0;i<8;i++)tree(exterior,-6.2+i*.17,1.4+i*1.75,2.5+(i%3)*.25);tree(exterior,-4.6,3.2,3.8,'spruce');tree(exterior,-3.4,12.8,3.2,'spruce');for(let i=0;i<5;i++)tree(exterior,-.5+i*.38,5+i*1.48,2.4);for(let i=0;i<8;i++)tree(exterior,14.3,1+i*1.8,1.7);
// Low garden beds and warm path lights visible in the supplied photographs.
polygon(exterior,[[-6.8,1],[-5.5,1],[-3.8,14.6],[-5.1,14.6]],-.005,mat('#6b5740'),.04);
for(let i=0;i<18;i++){const x=-5.7+i*.1,z=1.4+i*.72;const shrub=new T.Mesh(new T.IcosahedronGeometry(.26,1),mat(i%3===0?'#b595ba':'#647849'));shrub.position.set(x,.25,z);exterior.add(shrub);}
const glow=new T.MeshStandardMaterial({color:'#ffdd92',emissive:'#ffb743',emissiveIntensity:1.8});for(let i=0;i<9;i++){const x=-.65+i*.37,z=1.4+i*1.5;cylinder(exterior,.07,.28,x,.14,z,frame);cylinder(exterior,.07,.04,x,.3,z,glow);}for(let i=0;i<12;i++){const bulb=new T.Mesh(new T.SphereGeometry(.035,8,6),glow);bulb.position.set(-5.02,2.35,-4+i*.35);exterior.add(bulb);}
function siteLabel(text,x,z){const c=document.createElement('canvas');c.width=640;c.height=100;const ctx=c.getContext('2d');ctx.fillStyle='#354238';ctx.textAlign='center';ctx.font='24px Arial';ctx.fillText(text,320,56);const q=new T.Mesh(new T.PlaneGeometry(5,.78),new T.MeshBasicMaterial({map:new T.CanvasTexture(c),transparent:true,depthWrite:false}));q.rotation.x=-Math.PI/2;q.position.set(x,.15,z);exterior.add(q);}
siteLabel('ZŪBIŠKIŲ GATVĖ',4,20);siteLabel('VEJA IR ŽELDINIAI ≈',-2.8,10);siteLabel('TERASA / PIRTIS ≈',-1.7,-5);siteLabel('ĮVAŽIAVIMAS ≈',7.3,17);
// Additional supplied photos: finish and furnishing refinements only.
const bedroom=rooms.find(r=>r.id==='1-9');
bedroom.surface.material=material('#cfc1a7','stucco','#a39885');
const ochre=mat('#c4a249'),upholstery=mat('#8a8277'),cover=material('#e2d9c7','stucco','#c4baa8');
bedroom.groups.forEach(w=>w.traverse(q=>{if(q.isMesh&&walls.includes(q))q.material=ochre;}));
// UV crop of the actual wallpaper, avoiding the bed, frame and lamp.
const wallpaper=new T.Texture();wallpaper.colorSpace=T.SRGBColorSpace;
wallpaper.offset.set(1120/1448,1-515/1086);wallpaper.repeat.set(310/1448,345/1086);
const wallpaperMaterial=mat('#c4a249');
if(typeof Image!=='undefined'){const photo=new Image();photo.onload=()=>{wallpaper.image=photo;wallpaper.needsUpdate=true;wallpaperMaterial.map=wallpaper;wallpaperMaterial.color.set('#ffffff');wallpaperMaterial.needsUpdate=true;};photo.src='nuotraukos/miegamasis-diena.png';}
bedroom.groups[1]?.traverse(q=>{if(q.isMesh&&walls.includes(q))q.material=wallpaperMaterial;});
for(let i=furniture.length-1;i>=0;i--){const p=furniture[i];if((p.userData.f===1&&p.userData.type==='Bed · bedroom 2')||(p.userData.f===0&&['Desk','Chair'].includes(p.userData.type)&&p.position.x<5)||(p.userData.f===0&&p.userData.type==='Kitchen counter')){p.removeFromParent();furniture.splice(i,1);}}
g=furnitureGroup(1,'Minkšta lova · miegamojo vieta ≈',9.2,2.22,1.65,2.05,-Math.PI/2);
round(g,1.65,.32,2.05,0,.25,0,upholstery);round(g,1.72,1.05,.16,0,.72,-1.02,upholstery);
round(g,1.6,.22,1.98,0,.5,.02,cover);box(g,1.64,.035,1.55,0,.633,.27,cover);
for(const s of[-1,1]){round(g,.65,.12,.45,s*.39,.67,-.59,cream);const pillow=round(g,.48,.31,.13,s*.28,.79,-.62,upholstery);pillow.rotation.x=-.15;}
tag(g);
function bedside(parent){box(parent,.5,.56,.43,0,.3,0,oak);box(parent,.46,.018,.02,0,.37,.23,walnut);cylinder(parent,.09,.025,0,.605,0,walnut);beam(parent,[0,.62,0],[0,.9,0],.014,walnut);const lamp=new T.Mesh(new T.CylinderGeometry(.11,.16,.2,18),mat('#f3e3bd'));lamp.position.set(0,.98,0);parent.add(lamp);}
for(const z of[1.06,3.38]){g=furnitureGroup(1,'Medinė naktinė spintelė su šviestuvu',9.88,z,.5,.43,-Math.PI/2);bedside(g);tag(g);}
box(fixed[1],1.25,.53,.12,8.03,.42,.56,white);for(let i=0;i<16;i++)box(fixed[1],.025,.47,.15,7.46+i*.077,.42,.56,white);
for(const x of[7.15,9.07])for(let i=0;i<6;i++)cylinder(fixed[1],.03,2.3,x+i*.048,1.25,.62,upholstery);
// Local reference image in a framed artwork, with a separate UV crop.
const art=new T.Texture();art.colorSpace=T.SRGBColorSpace;art.offset.set(830/1448,1-533/1086);art.repeat.set(220/1448,218/1086);const artMat=mat('#aca28c');
if(typeof Image!=='undefined'){const img=new Image();img.onload=()=>{art.image=img;art.needsUpdate=true;artMat.map=art;artMat.color.set('#ffffff');artMat.needsUpdate=true;};img.src='nuotraukos/miegamasis-diena.png';}
box(fixed[1],.07,.77,.94,10.45,1.85,2.22,cream);box(fixed[1],.075,.64,.81,10.405,1.85,2.22,artMat);
// The new living-room image confirms open-plan wooden kitchen cabinetry.
const kitchen=fixed[0];for(let i=0;i<5;i++){const x=7.35+i*.6;box(kitchen,.58,.81,.58,x,.45,.83,walnut);box(kitchen,.61,.055,.62,x,.89,.83,cream);box(kitchen,.58,.6,.29,x,1.91,.66,walnut);box(kitchen,.14,.025,.025,x,1.72,.82,steel);}
for(let i=0;i<3;i++){box(kitchen,.58,.81,.58,10.1,.45,1.4+i*.58,walnut);box(kitchen,.63,.055,.59,10.1,.89,1.4+i*.58,cream);}
box(kitchen,.52,.012,.38,10.1,.93,2.02,frame);for(const x of[9.96,10.23])for(const z of[1.91,2.14])cylinder(kitchen,.075,.013,x,.946,z,steel);
box(kitchen,.55,.025,.36,8.0,.925,.83,steel);beam(kitchen,[8,.94,.68],[8,1.17,.68],.018,steel);beam(kitchen,[8,1.17,.68],[8,1.17,.83],.018,steel);
// Four pendant shades above the existing dining table; ceiling remains absent.
for(let i=0;i<4;i++){const x=7.63+i*.36;beam(kitchen,[x,2.65,2.25],[x,1.98,2.25],.007,steel);const light=new T.Mesh(new T.ConeGeometry(.08,.2,16),mat('#efe7d8'));light.position.set(x,1.91,2.25);kitchen.add(light);}
// Shelving in 1-3 is an approximate photo-to-room match; its walls are untouched.
rooms.find(r=>r.id==='1-3').name='Biblioteka / saugojimo kambarys ≈';
const shelf=new T.Group();shelf.position.set(3.79,0,4.99);fixed[0].add(shelf);const shelfWood=mat('#996738');
box(shelf,2.55,2.28,.045,0,1.19,-.2,shelfWood);for(const x of[-1.28,-.43,.43,1.28])box(shelf,.045,2.28,.43,x,1.19,0,shelfWood);
for(let i=0;i<6;i++)box(shelf,2.6,.045,.43,0,.15+i*.43,0,shelfWood);
const bookColors=['#443d32','#ded2ae','#535d53','#405763','#775448'];
for(let row=1;row<5;row++)for(let i=0;i<23;i++){const x=-1.2+i*.105;if(Math.abs(x-.43)<.09||Math.abs(x+.43)<.09)continue;box(shelf,.072,.25+(i%3)*.026,.18,x,.2+row*.43+.13,.04,mat(bookColors[(i+row)%5]));}
box(shelf,.77,1.85,.018,-.85,1.28,.225,glass);box(shelf,.77,1.85,.018,.85,1.28,.225,glass);
// Cabinet styling seen in the new office angle.
box(fixed[1],1.6,.68,.4,3.5,.4,.85,walnut);for(let i=0;i<3;i++)box(fixed[1],.035,.025,.025,3+i*.5,.49,1.06,steel);

// September reference update. All room polygons remain unchanged.
rooms.find(r=>r.id==='1-5').name='Katilinė ≈';
rooms.find(r=>r.id==='1-6').name='Dušinė ir skalbykla ≈';
rooms.find(r=>r.id==='1-13').name='Vaikų kambarys ≈';
const childRoom=rooms.find(r=>r.id==='1-13'),utility=rooms.find(r=>r.id==='1-5'),showerRoom=rooms.find(r=>r.id==='1-6');
childRoom.surface.material=material('#969797','stucco','#65686c');
for(const [room,finish] of [[childRoom,mat('#b5bd5a')],[utility,material('#a0a29d','tile','#797d78')],[showerRoom,material('#d8c2a1','tile','#9f8668')]]){
room.groups.forEach(group=>group.traverse(q=>{if(walls.includes(q))q.material=finish;}));
}
utility.surface.material=darkTile;showerRoom.surface.material=material('#e0d0b5','check','#a7886b');
for(let i=furniture.length-1;i>=0;i--){const item=furniture[i];if((item.userData.f===1&&item.position.z>10&&item.position.x<6.8)||item.userData.type.startsWith('Kampinė vonia')){item.removeFromParent();furniture.splice(i,1);}}
// Freestanding loft bed, ladder and desk match the child's room reference.
g=furnitureGroup(1,'Paaukštinta vaiko lova su stalu ≈',5.85,12.5,1.25,2.2);
for(const x of[-.55,.55])for(const z of[-1,1])box(g,.09,1.85,.09,x,.98,z,oak);
box(g,1.2,.15,2.15,0,1.64,0,oak);round(g,1.1,.15,2.02,0,1.79,0,mat('#a7c36c'));
box(g,1.1,.055,.62,0,.76,.62,oak);box(g,.42,.64,.5,-.31,.38,.59,white);
for(let i=0;i<3;i++){box(g,1.2,.07,.06,0,1.94+i*.16,-1,oak);box(g,.4,.19,.025,-.31,.2+i*.2,.86,i===0?mat('#98b64e'):white);}
for(const x of[.21,.65])beam(g,[x,.08,1.35],[x,1.79,1.05],.027,oak);
for(let i=0;i<6;i++)box(g,.48,.055,.09,.43,.2+i*.27,1.33-i*.047,oak);
round(g,.65,.47,.65,-.08,.29,-.5,mat('#d7772c'),.2);tag(g);
// Small armchair leaves the room's central circulation open.
g=furnitureGroup(1,'Vaiko kambario krėslas ≈',4.75,11.3,.67,.7);
round(g,.65,.45,.12,0,.62,-.28,cream);round(g,.53,.15,.55,0,.4,0,mat('#8a8b8b'));
for(const x of[-.28,.28])round(g,.12,.35,.61,x,.47,0,cream);tag(g);
// Blue floor-standing boiler, expansion vessel and exposed services.
const blue=mat('#197ba1');box(fixed[0],.75,1.12,.67,9.0,.63,5.42,blue);
round(fixed[0],.7,.23,.38,9,1.29,5.34,blue);cylinder(fixed[0],.22,.46,8.95,1.94,5.05,blue);
for(let i=0;i<4;i++){beam(fixed[0],[9.6+i*.16,.25,5.02],[9.6+i*.16,2.3,5.02],.018,mat('#b5a06d'));beam(fixed[0],[9.0,.8+i*.19,5.02],[10.15,.8+i*.19,5.02],.016,steel);}
box(fixed[0],.6,.9,.62,9.02,.5,8.94,white);box(fixed[0],.56,.04,.58,9.02,.97,8.94,mat('#d4d8d4'));
for(let i=0;i<9;i++)beam(fixed[0],[10.1,.58+i*.075,9.11],[10.68,.58+i*.075,9.11],.022,white);
// Quarter-circle corner bath instead of a generic rounded rectangular block.
g=furnitureGroup(1,'Kampinė hidromasažinė vonia ≈',10.47,5.69,1.55,1.55);
const tubShape=new T.Shape();tubShape.moveTo(-.75,-.75);tubShape.lineTo(.75,-.75);tubShape.absarc(-.75,-.75,1.5,0,Math.PI/2,false);tubShape.lineTo(-.75,-.75);
const tubGeo=new T.ExtrudeGeometry(tubShape,{depth:.58,bevelEnabled:true,bevelSize:.045,bevelThickness:.035,bevelSegments:3,steps:1,curveSegments:24});tubGeo.rotateX(-Math.PI/2);
const tub=new T.Mesh(tubGeo,white);tub.position.y=.1;tub.castShadow=true;g.add(tub);
const inset=new T.Mesh(new T.CircleGeometry(.55,32),mat('#d8e0dc'));inset.rotation.x=-Math.PI/2;inset.position.set(-.18,.722,.18);inset.scale.set(1, .86,1);g.add(inset);tag(g);
// Aerial photo confirms the annex roof covers the indoor lounge; awning is outside.
const lounge=new T.Group();lounge.position.set(-3,0,-2.1);exterior.add(lounge);
box(lounge,3.9,2.6,.12,0,1.3,-1.8,oak);box(lounge,.12,2.6,3.7,-1.95,1.3,0,oak);
const loungeTable=new T.Group();loungeTable.position.set(0,0,.1);lounge.add(loungeTable);table(loungeTable,1.4,.85,.73);
for(const x of[-1.2,1.2]){round(lounge,.65,.18,.7,x,.44,.15,cream);round(lounge,.12,.6,.7,x+(x<0?-.28:.28),.71,.15,cream);}
box(lounge,1.2,.65,.4,.35,.37,-1.4,oak);box(lounge,.7,.48,.34,.35,.96,-1.4,steel);box(lounge,.58,.36,.015,.35,.97,-1.22,frame);
// Low edging and a small covered garden enclosure, visible in the aerial reference.
polygon(exterior,[[-4.9,.1],[-1,.1],[-1,4.45],[-4.9,4.45]],-.03,oak,.08);
const enclosure=new T.Group();enclosure.position.set(-6,0,8);exterior.add(enclosure);
box(enclosure,1.3,.08,1.8,0,1.6,0,frame);
for(const x of[-.62,.62])for(let i=0;i<9;i++)beam(enclosure,[x,0,-.85+i*.21],[x,1.56,-.85+i*.21],.014,steel);
for(let i=0;i<30;i++)box(exterior,.22,.09,.17,-.88+i*.145,.04,4.5+i*.34,paving);

return{exterior,roof,setCutaway(interior,h){fixed.forEach(g=>g.traverse(q=>{if(q.isMesh)q.visible=!interior||q.position.y<Math.max(1.35,h+.3);}));}};
}
