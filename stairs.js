import * as T from 'three';
export const FLOOR_RISE=3.05;
// Plan-derived L-shaped stairwell; exact riser measurements are approximate.
export const stairOpening=[[6.98,4.74],[8.08,4.74],[8.08,8.02],[7.08,8.02],[7.08,5.68],[6.98,5.68]];
export function createStairs({wood,metal}){
  const stair=new T.Group();stair.name='Laiptai · medinės pakopos ir plieninė sija ≈';
  const rise=FLOOR_RISE/16,thickness=.055,width=.9,x=7.57;
  const add=(geometry,material,pos)=>{const q=new T.Mesh(geometry,material);q.position.set(...pos);q.castShadow=q.receiveShadow=true;stair.add(q);return q;};
  const box=(w,h,d,pos,m)=>add(new T.BoxGeometry(w,h,d),m,pos);
  const bar=(a,b,r,m)=>{const start=new T.Vector3(...a),end=new T.Vector3(...b),v=end.clone().sub(start);const q=add(new T.CylinderGeometry(r,r,v.length(),12),m,start.add(end).multiplyScalar(.5).toArray());q.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),v.normalize());return q;};
  const spine=(a,b)=>{const start=new T.Vector3(...a),end=new T.Vector3(...b),v=end.clone().sub(start);const q=box(.14,v.length(),.2,start.add(end).multiplyScalar(.5).toArray(),metal);q.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),v.normalize());};
  for(let i=0;i<12;i++){
    const y=(i+1)*rise,z=7.925-i*.205;
    const tread=box(width,thickness,.25,[x,y-thickness/2,z],wood);tread.userData.riser=i+1;
    box(.38,.025,.16,[x,y-thickness-.026,z],metal);
    if(i%2===0||i===11){bar([7.145,y,z],[7.145,y+.88,z],.014,metal);bar([7.145,y+.2,z],[7.145,y+.67,z],.024,wood);}
  }
  spine([x,.03,8.04],[x,2.24,5.61]);
  bar([7.145,rise+.9,7.925],[7.145,12*rise+.9,5.67],.033,wood);
  const corner=[7.12,5.66],point=a=>{const c=Math.cos(a),s=Math.sin(a),r=.9/Math.max(c,s);return[corner[0]+r*c,corner[1]-r*s];};
  for(let i=0;i<3;i++){
    const a=i*Math.PI/6,b=(i+1)*Math.PI/6,pts=[corner,point(a)];
    if(a<Math.PI/4&&b>Math.PI/4)pts.push(point(Math.PI/4));
    pts.push(point(b));
    const shape=new T.Shape(pts.map(([xx,z])=>new T.Vector2(xx,-z)));
    const q=add(new T.ExtrudeGeometry(shape,{depth:thickness,bevelEnabled:false}),wood,[0,(13+i)*rise-thickness,0]);q.rotation.x=-Math.PI/2;q.userData.riser=13+i;
  }
  spine([x,2.24,5.61],[7.6,2.56,5.13]);spine([7.6,2.56,5.13],[7.02,2.93,5.13]);
  // Upper exit finishes flush with the second-floor slab.
  box(.2,.055,.9,[7.02,FLOOR_RISE-.0275,5.21],wood);
  const rails=[[8.04,5.61],[8.04,4.79],[7.15,4.79]];
  rails.forEach(([xx,z],i)=>bar([xx,2.45+i*.2,z],[xx,3.68+i*.1,z],.014,metal));
  bar([8.04,3.68,5.61],[8.04,3.78,4.79],.033,wood);bar([8.04,3.78,4.79],[7.15,3.88,4.79],.033,wood);
  return stair;
}
export function createLandingRail({wood,metal}){
  const g=new T.Group();g.name='Laiptų angos apsauginis turėklas';
  const rail=(a,b,r,m)=>{const av=new T.Vector3(...a),bv=new T.Vector3(...b),v=bv.clone().sub(av);const mesh=new T.Mesh(new T.CylinderGeometry(r,r,v.length(),12),m);mesh.position.copy(av.add(bv).multiplyScalar(.5));mesh.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),v.normalize());mesh.castShadow=true;g.add(mesh);};
  for(let i=0;i<7;i++){const z=5.78+i*.35;rail([7.04,.04,z],[7.04,.94,z],.014,metal);rail([7.04,.23,z],[7.04,.7,z],.024,wood);}
  rail([7.04,.96,5.76],[7.04,.96,7.94],.033,wood);
  rail([7.04,.96,7.94],[8.04,.96,7.94],.033,wood);rail([8.04,.04,7.94],[8.04,.94,7.94],.014,metal);
  return g;
}
