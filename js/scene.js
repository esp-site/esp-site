(function(){
var c=document.getElementById('bg3d');
if(c&&window.THREE){
var T=THREE,type=c.dataset.scene,col=parseInt(c.dataset.color,16);
var r=new T.WebGLRenderer({canvas:c,alpha:true,antialias:true});
r.setPixelRatio(Math.min(devicePixelRatio,2));
var s=new T.Scene(),cam=new T.PerspectiveCamera(60,1,.1,100);cam.position.z=7;
s.add(new T.AmbientLight(0xffffff,.6));
var pl=new T.PointLight(0xffffff,1.2);pl.position.set(5,5,8);s.add(pl);
var mat=function(w){return new T.MeshStandardMaterial({color:col,wireframe:!!w,metalness:.4,roughness:.3})};
var objs=[],g=new T.Group();s.add(g);
function add(geo,w,x,y,z,sc){var o=new T.Mesh(geo,mat(w));o.position.set(x||0,y||0,z||0);if(sc)o.scale.setScalar(sc);g.add(o);objs.push(o)}
function rnd(){return (Math.random()-.5)}
if(type==='shield'){add(new T.IcosahedronGeometry(2.2,1),true,2,0,-1);add(new T.IcosahedronGeometry(1.2,0),false,2,0,-1)}
else if(type==='knot'){add(new T.TorusKnotGeometry(1.6,.5,160,20),false,2.2,0,-1)}
else if(type==='cubes'){for(var i=0;i<22;i++)add(new T.BoxGeometry(1,1,1),i%2,rnd()*14,rnd()*8,-2-Math.random()*4,.4+Math.random()*.8)}
else if(type==='rings'){for(var j=0;j<5;j++)add(new T.TorusGeometry(1+j*.6,.04,12,100),false,2,0,-1)}
else{for(var k=0;k<14;k++)add(new T.OctahedronGeometry(1),k%2,rnd()*14,rnd()*8,-2-Math.random()*4,.3+Math.random()*.7)}
var n=1500,pg=new T.BufferGeometry(),pos=new Float32Array(n*3);
for(var p=0;p<n*3;p++)pos[p]=rnd()*30;
pg.setAttribute('position',new T.BufferAttribute(pos,3));
var pts=new T.Points(pg,new T.PointsMaterial({color:0xffffff,size:.04}));s.add(pts);
var mx=0,my=0;
addEventListener('mousemove',function(e){mx=e.clientX/innerWidth-.5;my=e.clientY/innerHeight-.5});
function rs(){r.setSize(innerWidth,innerHeight);cam.aspect=innerWidth/innerHeight;cam.updateProjectionMatrix()}
addEventListener('resize',rs);rs();
var t=0;
(function loop(){requestAnimationFrame(loop);t+=.01;
objs.forEach(function(o,i){
if(type==='rings'){o.rotation.x=t*(.3+i*.15);o.rotation.y=t*.2*(i%2?1:-1)}
else{o.rotation.x+=.004+i*.0004;o.rotation.y+=.006}
if(type==='cubes'||type==='dust')o.position.y+=Math.sin(t+i)*.005});
pts.rotation.y=t*.05;
g.rotation.y+=(mx*1.2-g.rotation.y)*.04;g.rotation.x+=(my*.8-g.rotation.x)*.04;
r.render(s,cam)})();
}
var io=new IntersectionObserver(function(e){e.forEach(function(x){if(x.isIntersecting)x.target.classList.add('in')})},{threshold:.15});
document.querySelectorAll('.reveal').forEach(function(el){io.observe(el)});
document.querySelectorAll('.card').forEach(function(cd){
cd.addEventListener('mousemove',function(e){var b=cd.getBoundingClientRect(),x=(e.clientX-b.left)/b.width-.5,y=(e.clientY-b.top)/b.height-.5;cd.style.transform='perspective(700px) rotateY('+x*14+'deg) rotateX('+(-y*14)+'deg) translateZ(10px)'});
cd.addEventListener('mouseleave',function(){cd.style.transform=''})});
})();
