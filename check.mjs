import assert from 'node:assert/strict';
import {readFile,access} from 'node:fs/promises';
import * as T from 'three';
import {enhanceHouse} from '../src/references.js';
import {boundary,annex} from '../src/site-data.js';
const source=await readFile('src/main.js','utf8'),html=await readFile('dist/index.html','utf8');
const geometry=[...source.matchAll(/room\((\d),'([^']+)','[^']+','([^']+)',(\[\[.*?\]\])/g)].map(m=>({floor:+m[1],id:m[2],area:m[3],polygon:JSON.parse(m[4])}));
assert.deepEqual(geometry,JSON.parse(await readFile('scripts/geometry-baseline.json','utf8')),'Pakeista pirminė aukštų geometrija');
for(const match of html.matchAll(/(?:src|href)="([^"]+)"/g)){const path=match[1];if(path.startsWith('data:')||path.startsWith('#'))continue;if(path.startsWith('https://wa.me/')){assert(path.startsWith('https://wa.me/37061628580?text='));continue;}assert(!/^https?:/.test(path),'Išorinis turinio URL: '+path);await access('dist/'+path);}
assert(html.includes('SUSISIEKITE'));assert(html.includes('205,30 m²'));assert(html.includes('class="listing"'));
assert(html.includes('lang="lt"'));for(const m of source.matchAll(/\$\('#([^']+)'\)/g))assert(html.includes('id="'+m[1]+'"'),'Trūksta valdiklio '+m[1]);
// Construct the photo-derived model with real Three.js geometry, without a GPU.
// Canvas stubs only supply material canvases; this is not a visual browser test.
globalThis.document={createElement:()=>({width:256,height:256,getContext:()=>({fillRect(){},strokeRect(){},fillText(){}})})};
const scene=new T.Scene(),floors=[new T.Group(),new T.Group()],walls=[],furniture=[];floors.forEach(f=>scene.add(f));
const mat=(color,roughness=.8)=>new T.MeshStandardMaterial({color,roughness}),white=mat('#ffffff'),wood=mat('#bda58a'),metal=mat('#6d777a'),glass=mat('#a0c7d4');
function box(parent,w,h,d,x,y,z,m=white){const q=new T.Mesh(new T.BoxGeometry(w,h,d),m);q.position.set(x,y,z);parent.add(q);return q;}
function cylinder(parent,r,h,x,y,z,m){const q=new T.Mesh(new T.CylinderGeometry(r,r,h,12),m);q.position.set(x,y,z);parent.add(q);return q;}
const rooms=geometry.map(r=>{const g=new T.Group();floors[r.floor].add(g);const wall=box(g,1,1,.13,0,.5,0);walls.push(wall);return{id:r.id,f:r.floor,groups:[g],surface:box(floors[r.floor],1,.1,1,0,0,0)};});
const model=enhanceHouse({scene,floors,rooms,walls,furniture,box,cylinder,mat,white,wood,metal,glass});
model.setCutaway(true,1.1);model.setCutaway(false,2.8);scene.updateMatrixWorld(true);let meshes=0;
scene.traverse(q=>{if(q.isMesh){meshes++;const bounds=new T.Box3().setFromObject(q);assert([...bounds.min.toArray(),...bounds.max.toArray()].every(Number.isFinite),'Neteisingos modelio koordinatės');}});
assert(meshes>100);assert(furniture.length>=5);assert.equal(boundary.length,4);assert.equal(annex.length,4);assert(model.roof.parent===model.exterior);
console.log('GERAI: 14 pirminių patalpų poligonų ir plotų nepakeisti.');
console.log('GERAI: visi HTML šaltinių failai vietiniai, lietuviška sąsaja ir valdiklių ID sutampa.');
console.log(`GERAI: sklypo bei interjero papildymai sukurti (${meshes} geometrijos objektų), koordinatės baigtinės.`);
console.log('Ši patikra netikrina naršyklės vaizdo ar PNG kokybės.');
