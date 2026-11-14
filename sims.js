/* Figuras interactivas de Matemáticas III. Vanilla JS + canvas. */
(function(){
const C = {};
function paleta(el){const cs=getComputedStyle(el);const v=n=>cs.getPropertyValue(n).trim();
  C.bg=v('--surface')||'#fff';C.grid=v('--line')||'#d5dcd9';C.text=v('--fg')||'#16211d';C.muted=v('--muted')||'#56635e';
  C.a=v('--tc')||v('--accent')||'#b4232f';C.b=v('--warn')||'#b8730c';C.c=v('--c6')||'#2c8a52';C.d=v('--c5')||'#c43d63';C.e=v('--c4')||'#b8730c';C.f=v('--c2')||'#3a63c4';}
const F=n=>Number.isInteger(n)?String(n):(Math.abs(n)<1e-9?'0':n.toFixed(2).replace('.',','));

function build(el, spec){
  el.classList.add('sim-box');paleta(el);
  const ctrls=document.createElement('div'); ctrls.className='ctrl sim-ctrls';
  const cv=document.createElement('canvas'); cv.width=spec.w||640; cv.height=spec.h||360; cv.className='sim-cv';
  const out=document.createElement('div'); out.className='readout sim-out';
  el.append(ctrls,cv,out);
  const st={};
  (spec.sliders||[]).forEach(s=>{st[s.k]=s.v;const lab=document.createElement('label');const sp=document.createElement('span');sp.textContent=`${s.l}: ${F(s.v)} ${s.u||''}`;
    const inp=document.createElement('input');inp.type='range';inp.min=s.min;inp.max=s.max;inp.step=s.step||0.01;inp.value=s.v;
    inp.oninput=()=>{st[s.k]=parseFloat(inp.value);sp.textContent=`${s.l}: ${F(st[s.k])} ${s.u||''}`;draw();};lab.append(sp,inp);ctrls.append(lab);});
  (spec.selects||[]).forEach(s=>{st[s.k]=s.v;const lab=document.createElement('label');const sp=document.createElement('span');sp.textContent=s.l;
    const sel=document.createElement('select');s.opts.forEach(o=>{const op=document.createElement('option');op.value=o[0];op.textContent=o[1];if(o[0]===s.v)op.selected=true;sel.append(op);});
    sel.onchange=()=>{st[s.k]=sel.value;draw();};lab.append(sp,sel);ctrls.append(lab);});
  const g=cv.getContext('2d');
  const api={st,cv,g,out,W:cv.width,H:cv.height,
    clear(){paleta(el);g.fillStyle=C.bg;g.fillRect(0,0,cv.width,cv.height);},
    txt(s,x,y,col,sz,al){g.fillStyle=col||C.text;g.font=(sz||13)+'px system-ui';g.textAlign=al||'left';g.fillText(s,x,y);},
    arrow(x1,y1,x2,y2,col,wd){g.strokeStyle=g.fillStyle=col;g.lineWidth=wd||2.5;g.beginPath();g.moveTo(x1,y1);g.lineTo(x2,y2);g.stroke();const a=Math.atan2(y2-y1,x2-x1),L=10;g.beginPath();g.moveTo(x2,y2);g.lineTo(x2-L*Math.cos(a-0.4),y2-L*Math.sin(a-0.4));g.lineTo(x2-L*Math.cos(a+0.4),y2-L*Math.sin(a+0.4));g.closePath();g.fill();},
    line(x1,y1,x2,y2,col,wd,dash){g.strokeStyle=col;g.lineWidth=wd||1.5;g.setLineDash(dash||[]);g.beginPath();g.moveTo(x1,y1);g.lineTo(x2,y2);g.stroke();g.setLineDash([]);},
    circ(x,y,r,col,fill){g.beginPath();g.arc(x,y,r,0,Math.PI*2);if(fill){g.fillStyle=col;g.fill();}else{g.strokeStyle=col;g.lineWidth=2;g.stroke();}},
    html(h){out.innerHTML=h;},
    // sistema de ejes cartesiano
    axes(cx,cy,u,xmin,xmax,ymin,ymax){for(let i=Math.ceil(xmin);i<=xmax;i++)api.line(cx+i*u,cy-ymax*u,cx+i*u,cy-ymin*u,C.grid,1);for(let j=Math.ceil(ymin);j<=ymax;j++)api.line(cx+xmin*u,cy-j*u,cx+xmax*u,cy-j*u,C.grid,1);api.line(cx+xmin*u,cy,cx+xmax*u,cy,C.muted,1.5);api.line(cx,cy-ymax*u,cx,cy-ymin*u,C.muted,1.5);}
  };
  function draw(){spec.draw(api);}
  draw(); return api;
}
const SIMS={};

/* ---- Matemáticas III (Variable Compleja y Transformadas): figuras interactivas ---- */
const N2=x=>(Math.abs(x)<1e-10?0:x).toFixed(2).replace('.',',');
const N3=x=>(Math.abs(x)<1e-10?0:x).toFixed(3).replace('.',',');
const N4=x=>(Math.abs(x)<1e-10?0:x).toFixed(4).replace('.',',');
const Cx=(re,im)=>({re,im});
const cadd=(a,b)=>Cx(a.re+b.re,a.im+b.im);
const csub=(a,b)=>Cx(a.re-b.re,a.im-b.im);
const cmul=(a,b)=>Cx(a.re*b.re-a.im*b.im,a.re*b.im+a.im*b.re);
const cdiv=(a,b)=>{const d=b.re*b.re+b.im*b.im;return Cx((a.re*b.re+a.im*b.im)/d,(a.im*b.re-a.re*b.im)/d);};
const cexp=a=>Cx(Math.exp(a.re)*Math.cos(a.im),Math.exp(a.re)*Math.sin(a.im));
const csin=a=>Cx(Math.sin(a.re)*Math.cosh(a.im),Math.cos(a.re)*Math.sinh(a.im));
const cabs=a=>Math.hypot(a.re,a.im);
const carg=a=>Math.atan2(a.im,a.re);
const cfmt=a=>`${N3(a.re)} ${a.im>=0?'+':'−'} ${N3(Math.abs(a.im))}i`;
const Eje=(a,x0,y0,w,h,xlab,ylab)=>{a.line(x0,y0,x0+w,y0,C.muted,1.5);a.line(x0,y0,x0,y0-h,C.muted,1.5);
  if(xlab)a.txt(xlab,x0+w/2,y0+30,C.muted,12,'center');if(ylab)a.txt(ylab,x0-6,y0-h-10,C.muted,12);};
const PlanoC=(a,cx,cy,SC,R)=>{
  a.line(cx-R,cy,cx+R,cy,C.muted,1.4);a.line(cx,cy-R,cx,cy+R,C.muted,1.4);
  a.txt('Re',cx+R+6,cy+4,C.muted,11);a.txt('Im',cx-6,cy-R-6,C.muted,11,'right');
  for(let i=-5;i<=5;i++){if(!i)continue;const X=cx+i*SC,Y=cy-i*SC;
    if(Math.abs(i*SC)<R){a.line(X,cy-4,X,cy+4,C.muted,1);a.line(cx-4,Y,cx+4,Y,C.muted,1);}}};

/* T1 · Plano complejo: operaciones, potencias y raíces */
SIMS.complejos=el=>build(el,{w:660,h:420,
 selects:[{k:'op',v:'raiz',l:'operación',opts:[['suma','z₁ + z₂'],['prod','z₁ · z₂'],['div','z₁ / z₂'],['pot','z₁ elevado a n'],['raiz','raíces n-ésimas de z₁'],['conj','conjugado e inverso de z₁']]}],
 sliders:[{k:'r1',v:2,min:0.2,max:3,step:0.05,l:'módulo de z₁',u:''},{k:'a1',v:0.25,min:-1,max:1,step:0.01,l:'argumento de z₁ (×π)',u:''},
  {k:'r2',v:1.2,min:0.2,max:3,step:0.05,l:'módulo de z₂',u:''},{k:'a2',v:0.5,min:-1,max:1,step:0.01,l:'argumento de z₂ (×π)',u:''},
  {k:'n',v:4,min:2,max:8,step:1,l:'n (potencia o raíces)',u:''}],
 draw(a){a.clear();
  const z1=Cx(a.st.r1*Math.cos(a.st.a1*Math.PI),a.st.r1*Math.sin(a.st.a1*Math.PI));
  const z2=Cx(a.st.r2*Math.cos(a.st.a2*Math.PI),a.st.r2*Math.sin(a.st.a2*Math.PI));
  const n=Math.round(a.st.n);
  const cx=230,cy=210,R=190,SC=R/3.4;
  PlanoC(a,cx,cy,SC,R);
  const P=z=>[cx+z.re*SC,cy-z.im*SC];
  const punto=(z,col,lab,gr)=>{const [X,Y]=P(z);
    a.line(cx,cy,X,Y,col,1.2,[4,3]);a.circ(X,Y,gr||6,col,true);
    if(lab)a.txt(lab,X+9,Y-8,col,13);};
  // circunferencia de referencia
  a.circ(cx,cy,SC,C.muted,false);
  let res=null,txt='',extra='';
  punto(z1,C.a,'z₁');
  if(a.st.op!=='pot'&&a.st.op!=='raiz'&&a.st.op!=='conj')punto(z2,C.f,'z₂');
  if(a.st.op==='suma'){res=cadd(z1,z2);
    const [X1,Y1]=P(z1),[X2,Y2]=P(z2),[XR,YR]=P(res);
    a.line(X1,Y1,XR,YR,C.muted,1.2,[3,3]);a.line(X2,Y2,XR,YR,C.muted,1.2,[3,3]);
    punto(res,C.c,'z₁+z₂');txt='La suma es la <b>regla del paralelogramo</b>: componente a componente, como vectores.';}
  else if(a.st.op==='prod'){res=cmul(z1,z2);punto(res,C.c,'z₁·z₂');
    txt=`<b>Los módulos se multiplican y los argumentos se suman</b>: |z₁·z₂| = ${N3(cabs(z1))}·${N3(cabs(z2))} = ${N3(cabs(res))} y arg = ${N3(carg(z1))} + ${N3(carg(z2))} = ${N3(carg(res))} rad.`;}
  else if(a.st.op==='div'){res=cdiv(z1,z2);punto(res,C.c,'z₁/z₂');
    txt=`Al dividir, los módulos se dividen y los argumentos se restan: |z₁/z₂| = ${N3(cabs(res))}, arg = ${N3(carg(res))} rad.`;}
  else if(a.st.op==='pot'){let z=Cx(1,0);const pts=[];
    for(let k=1;k<=n;k++){z=cmul(z,z1);pts.push(z);}
    pts.forEach((p,i)=>{const col=i===n-1?C.c:C.e;const [X,Y]=P(p);
      if(cabs(p)<3.4){a.circ(X,Y,i===n-1?7:4,col,true);if(i===n-1)a.txt('z₁^'+n,X+9,Y-8,col,13);}});
    res=pts[n-1];
    txt=`<b>De Moivre</b>: z₁ⁿ = rⁿ·e^(inθ) ⇒ |z₁^${n}| = ${N3(cabs(z1))}^${n} = ${N3(cabs(res))} y el argumento se multiplica por ${n}: ${N3(carg(z1)*n)} rad (los puntos intermedios dibujan una espiral logarítmica).`;}
  else if(a.st.op==='raiz'){const r=Math.pow(cabs(z1),1/n), th=carg(z1)/n;
    a.circ(cx,cy,r*SC,C.c,false);
    const raices=[];
    for(let k=0;k<n;k++){const w=Cx(r*Math.cos(th+2*Math.PI*k/n),r*Math.sin(th+2*Math.PI*k/n));raices.push(w);
      const [X,Y]=P(w);a.circ(X,Y,6,C.c,true);a.txt('w'+k,X+8,Y-8,C.c,12);}
    a.g.strokeStyle=C.c;a.g.lineWidth=1.4;a.g.beginPath();
    raices.forEach((w,i)=>{const [X,Y]=P(w);i===0?a.g.moveTo(X,Y):a.g.lineTo(X,Y);});
    a.g.closePath();a.g.stroke();
    res=raices[0];
    extra=raices.map((w,i)=>`w<sub>${i}</sub> = ${cfmt(w)}`).join(' · ');
    txt=`Las <b>${n} raíces</b> tienen módulo ${N3(r)} = ⁿ√${N3(cabs(z1))} y argumentos θ/n + 2kπ/n: forman un <b>polígono regular</b> de ${n} lados.`;}
  else {res=Cx(z1.re,-z1.im);punto(res,C.c,'z̄₁');
    const inv=cdiv(Cx(1,0),z1);punto(inv,C.e,'1/z₁',5);
    txt=`El conjugado es la reflexión respecto del eje real. El inverso 1/z₁ = z̄₁/|z₁|² tiene módulo ${N3(cabs(inv))} = 1/${N3(cabs(z1))} y argumento opuesto: es la <b>inversión</b> respecto de la circunferencia unidad seguida de una reflexión.`;}
  // panel
  const bx=460,by=70;
  a.txt('z₁ = '+cfmt(z1),bx,by,C.a,13);
  a.txt('|z₁| = '+N3(cabs(z1))+'   arg = '+N3(carg(z1)),bx,by+22,C.muted,12);
  a.txt('= '+N3(cabs(z1))+'·e^('+N3(carg(z1))+'i)',bx,by+42,C.muted,12);
  if(a.st.op!=='pot'&&a.st.op!=='raiz'&&a.st.op!=='conj'){
    a.txt('z₂ = '+cfmt(z2),bx,by+78,C.f,13);
    a.txt('|z₂| = '+N3(cabs(z2))+'   arg = '+N3(carg(z2)),bx,by+100,C.muted,12);}
  if(res){a.txt('resultado',bx,by+150,C.text,12);a.txt(cfmt(res),bx,by+172,C.c,14);
    a.txt('|·| = '+N3(cabs(res))+'   arg = '+N3(carg(res)),bx,by+194,C.muted,12);}
  a.html(`${txt}<br>${extra?extra+'<br>':''}
  <span class="hint">Multiplicar por un complejo = girar su argumento y escalar su módulo. Esa es toda la intuición que hace falta para fasores, impedancias y transformadas.</span>`);}});

/* T2 · Transformación conforme y Cauchy-Riemann */
SIMS.conforme=el=>build(el,{w:660,h:420,
 selects:[{k:'f',v:'z2',l:'función w = f(z)',opts:[['z2','f(z) = z²'],['exp','f(z) = e^z'],['inv','f(z) = 1/z'],['mob','f(z) = (z−1)/(z+1)  (Möbius)'],['sen','f(z) = sen z'],['conj','f(z) = z̄  (NO holomorfa)']]}],
 sliders:[{k:'px',v:1,min:-2,max:2,step:0.05,l:'parte real del punto',u:''},{k:'py',v:0.6,min:-2,max:2,step:0.05,l:'parte imaginaria',u:''}],
 draw(a){a.clear();
  const F={z2:[z=>cmul(z,z),'z²',z=>Cx(2*z.re,2*z.im),true],
   exp:[z=>cexp(z),'e^z',z=>cexp(z),true],
   inv:[z=>cdiv(Cx(1,0),z),'1/z',z=>cdiv(Cx(-1,0),cmul(z,z)),true],
   mob:[z=>cdiv(csub(z,Cx(1,0)),cadd(z,Cx(1,0))),'(z−1)/(z+1)',z=>cdiv(Cx(2,0),cmul(cadd(z,Cx(1,0)),cadd(z,Cx(1,0)))),true],
   sen:[z=>csin(z),'sen z',z=>Cx(Math.cos(z.re)*Math.cosh(z.im),-Math.sin(z.re)*Math.sinh(z.im)),true],
   conj:[z=>Cx(z.re,-z.im),'z̄',null,false]};
  const [f,nom,df,holo]=F[a.st.f];
  const cx1=160,cy=210,R=140,SC=R/2.2;
  const cx2=500;
  [[cx1,'plano z'],[cx2,'plano w = '+nom]].forEach(([cc,lab])=>{
    PlanoC(a,cc,cy,SC,R);a.txt(lab,cc,cy-R-18,C.text,13,'center');});
  const P1=z=>[cx1+z.re*SC,cy-z.im*SC], P2=z=>[cx2+z.re*SC*0.55,cy-z.im*SC*0.55];
  // malla
  const draw1=(pts,col,wd,plano)=>{a.g.strokeStyle=col;a.g.lineWidth=wd;a.g.beginPath();
    pts.forEach((z,i)=>{const [X,Y]=plano(z);i===0?a.g.moveTo(X,Y):a.g.lineTo(X,Y);});a.g.stroke();};
  for(let k=-4;k<=4;k++){
    const u=k*0.5;
    const horiz=[],vert=[];
    for(let t=-2.2;t<=2.2;t+=0.04){horiz.push(Cx(t,u));vert.push(Cx(u,t));}
    a.g.save();a.g.beginPath();a.g.rect(cx1-R,cy-R,2*R,2*R);a.g.clip();
    draw1(horiz,C.a,Math.abs(u)<1e-9?2:1,P1);draw1(vert,C.f,Math.abs(u)<1e-9?2:1,P1);a.g.restore();
    a.g.save();a.g.beginPath();a.g.rect(cx2-R,cy-R,2*R,2*R);a.g.clip();
    draw1(horiz.map(f),C.a,Math.abs(u)<1e-9?2:1,P2);draw1(vert.map(f),C.f,Math.abs(u)<1e-9?2:1,P2);a.g.restore();}
  const z0=Cx(a.st.px,a.st.py), w0=f(z0);
  const [X1,Y1]=P1(z0);a.circ(X1,Y1,7,C.c,true);
  const [X2,Y2]=P2(w0);a.circ(X2,Y2,7,C.c,true);
  a.txt('z',X1+9,Y1-8,C.c,13);a.txt('w',X2+9,Y2-8,C.c,13);
  // C-R numerico
  const h=1e-4;
  const fx=csub(f(Cx(z0.re+h,z0.im)),f(Cx(z0.re-h,z0.im)));
  const fy=csub(f(Cx(z0.re,z0.im+h)),f(Cx(z0.re,z0.im-h)));
  const ux=fx.re/(2*h), vx=fx.im/(2*h), uy=fy.re/(2*h), vy=fy.im/(2*h);
  const cr1=Math.abs(ux-vy)<1e-3, cr2=Math.abs(uy+vx)<1e-3;
  const dz=df?df(z0):null;
  a.html(`<b>w = ${nom}</b> · z = ${cfmt(z0)} ⇒ w = <b>${cfmt(w0)}</b>${dz?` · f′(z) = ${cfmt(dz)}`:''}.<br>
  Cauchy-Riemann en ese punto: u<sub>x</sub> = ${N3(ux)}, v<sub>y</sub> = ${N3(vy)} ⇒ ${cr1?'<b>u<sub>x</sub> = v<sub>y</sub> ✓</b>':'<b>u<sub>x</sub> ≠ v<sub>y</sub> ✗</b>'} · u<sub>y</sub> = ${N3(uy)}, −v<sub>x</sub> = ${N3(-vx)} ⇒ ${cr2?'<b>✓</b>':'<b>✗</b>'}.<br>
  ${holo?'La función es <b>holomorfa</b> aquí: las dos familias de líneas (horizontales y verticales) siguen cortándose <b>en ángulo recto</b> tras la transformación (aplicación conforme), salvo donde f′(z) = 0.':'<b>f(z) = z̄ no es holomorfa</b>: no cumple Cauchy-Riemann en ningún punto. Fíjate en que la malla se refleja y la orientación se invierte.'}<br>
  <span class="hint">${a.st.f==='z2'?'z² duplica los ángulos respecto del origen: por eso en z = 0 (donde f′ = 0) se pierde la conformidad.':(a.st.f==='mob'?'Una transformación de Möbius lleva rectas y circunferencias en rectas y circunferencias.':'Mueve el punto y compara su posición en los dos planos.')}</span>`);}});

/* T3 · Teorema de los residuos */
SIMS.residuos=el=>build(el,{w:660,h:420,
 selects:[{k:'f',v:'p2',l:'función',opts:[['p1','f(z) = 1/(z²+1)'],['p2','f(z) = (z−2)cos((z−2)μ)/(z²−4z+5)'],['p3','f(z) = e^z/(z²(z−1))'],['p4','f(z) = 1/(z²+1)²']]}],
 sliders:[{k:'cx',v:1,min:-3,max:4,step:0.1,l:'centro del contorno (Re)',u:''},{k:'cy',v:0,min:-3,max:3,step:0.1,l:'centro (Im)',u:''},{k:'r',v:2.5,min:0.3,max:4,step:0.05,l:'radio del contorno',u:''},{k:'mu',v:1,min:0,max:2,step:0.05,l:'parámetro μ',u:''}],
 draw(a){a.clear();
  const mu=a.st.mu;
  const INFO={
   p1:{polos:[{z:Cx(0,1),ord:1,res:()=>Cx(0,-0.5),et:'i'},{z:Cx(0,-1),ord:1,res:()=>Cx(0,0.5),et:'−i'}],nom:'1/(z²+1)',
     nota:'Polos simples en ±i. Cerrando por el semiplano superior se obtiene ∫dx/(1+x²) = π.'},
   p2:{polos:[{z:Cx(2,1),ord:1,res:()=>Cx(Math.cosh(mu)/2,0),et:'2+i'},{z:Cx(2,-1),ord:1,res:()=>Cx(Math.cosh(mu)/2,0),et:'2−i'}],nom:'(z−2)cos((z−2)μ)/(z²−4z+5)',
     nota:'Es el problema 4 del control 2: la suma de los dos residuos da cosh μ, así que la integral dividida por 2πi vale cosh μ.'},
   p3:{polos:[{z:Cx(0,0),ord:2,res:()=>Cx(-2,0),et:'0 (doble)'},{z:Cx(1,0),ord:1,res:()=>Cx(Math.E,0),et:'1'}],nom:'e^z/(z²(z−1))',
     nota:'Polo doble en 0 (residuo −2) y simple en 1 (residuo e).'},
   p4:{polos:[{z:Cx(0,1),ord:2,res:()=>Cx(0,-0.25),et:'i (doble)'},{z:Cx(0,-1),ord:2,res:()=>Cx(0,0.25),et:'−i (doble)'}],nom:'1/(z²+1)²',
     nota:'Polos dobles en ±i: hay que derivar una vez para el residuo. Con el semiplano superior, ∫dx/(1+x²)² = π/2.'}};
  const inf=INFO[a.st.f];
  const cx=220,cy=210,R=190,SC=R/4.2;
  PlanoC(a,cx,cy,SC,R);
  const P=z=>[cx+z.re*SC,cy-z.im*SC];
  // contorno
  const C0=Cx(a.st.cx,a.st.cy), r=a.st.r;
  a.g.strokeStyle=C.a;a.g.lineWidth=2.6;a.g.beginPath();
  a.g.arc(cx+C0.re*SC,cy-C0.im*SC,r*SC,0,Math.PI*2);a.g.stroke();
  a.g.fillStyle=C.a;a.g.globalAlpha=0.08;a.g.fill();a.g.globalAlpha=1;
  // flecha de orientacion
  const ang=0.6;const XA=cx+C0.re*SC+r*SC*Math.cos(ang), YA=cy-C0.im*SC-r*SC*Math.sin(ang);
  a.arrow(XA,YA,XA-18*Math.sin(ang),YA-18*Math.cos(ang),C.a,2.5);
  a.txt('γ',cx+C0.re*SC+r*SC+8,cy-C0.im*SC,C.a,14);
  // polos
  let suma=Cx(0,0),dentro=[];
  inf.polos.forEach(p=>{const [X,Y]=P(p.z);
    const d=cabs(csub(p.z,C0))<r;
    if(d){dentro.push(p);suma=cadd(suma,p.res());}
    a.g.strokeStyle=d?C.b:C.muted;a.g.lineWidth=2.5;
    a.line(X-7,Y-7,X+7,Y+7,d?C.b:C.muted,2.5);a.line(X-7,Y+7,X+7,Y-7,d?C.b:C.muted,2.5);
    a.txt(p.et,X+10,Y-9,d?C.b:C.muted,12);});
  const integ=cmul(Cx(0,2*Math.PI),suma);
  // panel
  const bx=440,by=70;
  a.txt('Polos y residuos',bx,by-14,C.text,13);
  inf.polos.forEach((p,i)=>{const d=cabs(csub(p.z,C0))<r;
    a.txt((d?'● dentro':'○ fuera')+'  z = '+p.et,bx,by+i*46,d?C.b:C.muted,12);
    a.txt('Res = '+cfmt(p.res()),bx+12,by+i*46+20,d?C.text:C.muted,12);});
  a.txt('Σ Res (dentro) = '+cfmt(suma),bx,by+140,C.c,13);
  a.txt('∮ f dz = 2πi·ΣRes',bx,by+172,C.text,13);
  a.txt('= '+cfmt(integ),bx,by+194,C.a,14);
  a.html(`<b>f(z) = ${inf.nom}</b> · contorno |z − (${N2(C0.re)} ${C0.im>=0?'+':'−'} ${N2(Math.abs(C0.im))}i)| = ${N2(r)}, orientado positivamente.<br>
  Quedan <b>${dentro.length} polo(s) dentro</b> ⇒ ∮<sub>γ</sub> f dz = 2πi·(${cfmt(suma)}) = <b>${cfmt(integ)}</b>${dentro.length===0?' (teorema de Cauchy-Goursat: sin singularidades dentro, la integral es 0)':''}.<br>
  ${inf.nota}<br>
  <span class="hint">Mueve el centro y el radio: lo único que cambia la integral es QUÉ polos quedan dentro. Deformar la curva sin cruzar un polo no altera el valor.</span>`);}});

/* T4 · Laplace: polos, respuesta temporal y EDO */
SIMS.laplace=el=>build(el,{w:660,h:420,
 selects:[{k:'f',v:'osc',l:'F(s)',opts:[['exp','F = 1/(s−a)  →  e^(at)'],['osc','F = ω/((s−a)²+ω²)  →  e^(at)·sen ωt'],['t2','F = 2/(s−a)³  →  t²e^(at)'],['edo','EDO: y″ + 2ζω y′ + ω²y = 1  (escalón)']]}],
 sliders:[{k:'a',v:-0.5,min:-2,max:1,step:0.05,l:'a (parte real del polo)',u:''},{k:'w',v:3,min:0.2,max:8,step:0.1,l:'ω',u:''},{k:'z',v:0.3,min:0,max:1.5,step:0.02,l:'amortiguamiento ζ (sólo EDO)',u:''}],
 draw(a){a.clear();
  const A=a.st.a,W=a.st.w,Z=a.st.z;
  // plano s
  const cx=150,cy=180,R=130,SC=R/2.6;
  PlanoC(a,cx,cy,SC,R);
  a.txt('plano s',cx,cy-R-18,C.text,13,'center');
  a.g.fillStyle=C.c;a.g.globalAlpha=0.08;a.g.fillRect(cx-R,cy-R,R,2*R);a.g.globalAlpha=1;
  a.txt('estable',cx-R+6,cy+R-6,C.c,10);
  let polos=[],nom='',ft=null,tmax=10;
  if(a.st.f==='exp'){polos=[Cx(A,0)];nom='1/(s−a)';ft=t=>Math.exp(A*t);}
  else if(a.st.f==='osc'){polos=[Cx(A,W),Cx(A,-W)];nom='ω/((s−a)²+ω²)';ft=t=>Math.exp(A*t)*Math.sin(W*t);}
  else if(a.st.f==='t2'){polos=[Cx(A,0)];nom='2/(s−a)³';ft=t=>t*t*Math.exp(A*t);}
  else {const wn=W,ze=Z;
    if(ze<1){const wd=wn*Math.sqrt(1-ze*ze);polos=[Cx(-ze*wn,wd),Cx(-ze*wn,-wd),Cx(0,0)];
      ft=t=>1-Math.exp(-ze*wn*t)*(Math.cos(wd*t)+ze/Math.sqrt(1-ze*ze)*Math.sin(wd*t));}
    else {const r1=-wn*(ze-Math.sqrt(ze*ze-1)),r2=-wn*(ze+Math.sqrt(ze*ze-1));polos=[Cx(r1,0),Cx(r2,0),Cx(0,0)];
      ft=t=>1-(r1*Math.exp(r2*t)-r2*Math.exp(r1*t))/(r1-r2);}
    nom='ω²/(s(s²+2ζωs+ω²))';tmax=Math.max(6,10/ (Z*W+0.3));}
  polos.forEach((p,i)=>{const X=cx+p.re*SC,Y=cy-p.im*SC;
    const col=(a.st.f==='edo'&&i===2)?C.e:(p.re<0?C.c:C.b);
    a.line(X-7,Y-7,X+7,Y+7,col,2.5);a.line(X-7,Y+7,X+7,Y-7,col,2.5);});
  if(a.st.f==='edo'&&Z<1){const X=cx-Z*W*SC,Y=cy-W*Math.sqrt(1-Z*Z)*SC;
    a.line(cx,cy,X,Y,C.muted,1.2,[4,3]);a.txt('ωn = '+N2(W),X-6,Y-10,C.muted,11,'right');}
  // respuesta temporal
  const x0=330,y0=330,wv=290,hv=250;
  Eje(a,x0,y0-hv/2,wv,0,'t','');
  a.line(x0,y0,x0,y0-hv,C.muted,1.5);
  const ys=[];for(let i=0;i<=300;i++)ys.push(ft(tmax*i/300));
  const M=Math.max(1e-6,...ys.map(Math.abs))*1.15;
  const py=v=>y0-hv/2-v/M*hv/2;
  a.line(x0,py(0),x0+wv,py(0),C.muted,1.2);
  if(a.st.f==='edo'){a.line(x0,py(1),x0+wv,py(1),C.e,1.4,[5,4]);a.txt('referencia',x0+wv-4,py(1)-6,C.e,11,'right');}
  a.g.strokeStyle=C.a;a.g.lineWidth=2.8;a.g.beginPath();
  ys.forEach((v,i)=>{const X=x0+wv*i/300,Y=py(v);i===0?a.g.moveTo(X,Y):a.g.lineTo(X,Y);});a.g.stroke();
  a.txt('respuesta f(t)',x0+4,y0-hv+14,C.text,12);
  a.txt('0',x0-8,py(0)+4,C.muted,10,'right');
  a.txt(N2(tmax),x0+wv,y0-hv/2+18,C.muted,10,'center');
  const estable=polos.every(p=>p.re<1e-9);
  let txt='';
  if(a.st.f==='edo'){const sob=Z<1?Math.exp(-Math.PI*Z/Math.sqrt(1-Z*Z))*100:0;
    txt=`Sistema de segundo orden con ω<sub>n</sub> = ${N2(W)} y ζ = ${N2(Z)}: ${Z<1?`<b>subamortiguado</b>, sobreimpulso ${N2(sob)} % y frecuencia amortiguada ω<sub>d</sub> = ${N2(W*Math.sqrt(1-Z*Z))}`:(Z>1?'<b>sobreamortiguado</b>: dos polos reales, sin oscilación':'<b>amortiguamiento crítico</b>: la respuesta más rápida sin oscilar')}. Tiempo de establecimiento ≈ 4/(ζω<sub>n</sub>) = ${Z*W>0.01?N2(4/(Z*W)):'∞'} s.`;}
  else txt=`F(s) = ${nom} con a = ${N2(A)}${a.st.f==='osc'?` y ω = ${N2(W)}`:''} ⇒ f(t) = ${a.st.f==='exp'?'e^('+N2(A)+'t)':(a.st.f==='osc'?'e^('+N2(A)+'t)·sen('+N2(W)+'t)':'t²e^('+N2(A)+'t)')}.`;
  a.html(`${txt}<br>
  <b>Los polos mandan</b>: parte real ${A<0||a.st.f==='edo'?'negativa ⇒ la respuesta <b>decae</b>':'positiva ⇒ la respuesta <b>crece sin límite</b>'}; parte imaginaria ⇒ oscilación de esa frecuencia. ${estable?'Todos los polos están en el semiplano izquierdo: sistema <b>estable</b>.':'Hay polos en el semiplano derecho: sistema <b>inestable</b>.'}<br>
  <span class="hint">Esta es la lectura que se usará en Regulación Automática: la posición de los polos de F(s) determina por completo la forma de f(t).</span>`);}});

/* T5 · Series de Laurent y clasificación de singularidades */
SIMS.laurent=el=>build(el,{w:660,h:400,
 selects:[{k:'f',v:'sen',l:'función',opts:[['sen','f(z) = z¹²·sen(1/z)  (control 2)'],['exp','f(z) = e^(1/z)'],['pol','f(z) = 1/(z(z−1))'],['evit','f(z) = sen(z)/z']]}],
 sliders:[{k:'N',v:6,min:1,max:14,step:1,l:'términos mostrados',u:''}],
 draw(a){a.clear();
  const N=Math.round(a.st.N);
  const fact=n=>{let r=1;for(let i=2;i<=n;i++)r*=i;return r;};
  let terms=[],tipo='',residuo='',nota='',nom='';
  if(a.st.f==='sen'){nom='z¹²·sen(1/z)';
    for(let k=0;k<N;k++)terms.push({exp:11-2*k,coef:(k%2?-1:1)/fact(2*k+1),txt:`z^${11-2*k}/${2*k+1}!`});
    tipo='esencial';residuo='1/13! = 1,606·10⁻¹⁰';nota='Infinitos términos de exponente negativo ⇒ singularidad esencial. El residuo es el coeficiente de z⁻¹, que aparece para k = 6.';}
  else if(a.st.f==='exp'){nom='e^(1/z)';
    for(let k=0;k<N;k++)terms.push({exp:-k,coef:1/fact(k),txt:`z^${-k}/${k}!`});
    tipo='esencial';residuo='1 (coeficiente de z⁻¹, k = 1)';nota='e^(1/z) = Σ z⁻ⁿ/n!: infinitos términos negativos ⇒ esencial, con residuo 1.';}
  else if(a.st.f==='pol'){nom='1/(z(z−1))';
    terms.push({exp:-1,coef:-1,txt:'−z⁻¹'});
    for(let k=0;k<N-1;k++)terms.push({exp:k,coef:-1,txt:`−z^${k}`});
    tipo='polo simple';residuo='−1 en z = 0 (y +1 en z = 1)';nota='En la corona 0 < |z| < 1: 1/(z(z−1)) = −1/z·(1/(1−z)) = −z⁻¹ − 1 − z − z² − … Un solo término negativo ⇒ polo simple.';}
  else {nom='sen(z)/z';
    for(let k=0;k<N;k++)terms.push({exp:2*k,coef:(k%2?-1:1)/fact(2*k+1),txt:`z^${2*k}/${2*k+1}!`});
    tipo='evitable';residuo='0 (no hay parte principal)';nota='sen z/z = 1 − z²/3! + z⁴/5! − … : sin parte principal ⇒ singularidad evitable (basta definir f(0) = 1).';}
  // dibujo de los terminos sobre un eje de exponentes
  const x0=60,y0=170,wv=560;
  const exps=terms.map(t=>t.exp);
  const lo=Math.min(-3,...exps), hi=Math.max(3,...exps);
  const px=e=>x0+(e-lo)/(hi-lo)*wv;
  a.line(x0,y0,x0+wv,y0,C.muted,1.5);
  a.txt('exponente n del término aₙ·zⁿ',x0+wv/2,y0+56,C.muted,12,'center');
  for(let e=lo;e<=hi;e++){const X=px(e);
    a.line(X,y0-4,X,y0+4,C.muted,1);
    if((hi-lo)<28||e%2===0)a.txt(String(e),X,y0+20,C.muted,10,'center');}
  a.g.fillStyle=C.a;a.g.globalAlpha=0.10;a.g.fillRect(x0,y0-110,px(-0.5)-x0,110);a.g.globalAlpha=1;
  a.txt('parte singular (n < 0)',x0+6,y0-96,C.a,11);
  a.txt('parte regular (n ≥ 0)',px(0.5)+6,y0-96,C.f,11);
  terms.forEach(t=>{const X=px(t.exp);const col=t.exp<0?C.a:C.f;
    const h=Math.min(70,14+Math.abs(Math.log10(Math.abs(t.coef)+1e-18))*7);
    a.line(X,y0,X,y0-h,col,3);a.circ(X,y0-h,5,col,true);
    if(t.exp===-1){a.txt('RESIDUO',X,y0-h-14,C.b,12,'center');a.circ(X,y0-h,9,C.b,false);}});
  a.txt('f(z) = '+nom,x0,y0-130,C.text,15);
  // etiquetas de terminos
  a.txt(terms.slice(0,6).map((t,i)=>(t.coef<0?'−':(i?'+':''))+t.txt.replace('−','')).join(' '),x0,y0+90,C.muted,12);
  a.html(`<b>f(z) = ${nom}</b>, desarrollo de Laurent alrededor de z₀ = 0.<br>
  Tipo de singularidad: <b>${tipo}</b> · Residuo: <b>${residuo}</b>.<br>
  ${nota}<br>
  <span class="hint">La clasificación se lee en la parte principal: ninguno (evitable), finitos (polo de ese orden), infinitos (esencial). Y el residuo es SIEMPRE el coeficiente de z⁻¹.</span>`);}});

/* T6 · Diferencias finitas para la ecuación del calor */
SIMS.edp=el=>build(el,{w:660,h:420,
 selects:[{k:'ini',v:'sen',l:'condición inicial',opts:[['sen','u(x,0) = sen(πx)'],['pulso','pulso centrado'],['rampa','rampa']]}],
 sliders:[{k:'lam',v:0.4,min:0.05,max:0.9,step:0.01,l:'λ = αk/h²  (estabilidad: ≤ 0,5)',u:''},{k:'nx',v:20,min:6,max:40,step:1,l:'nodos en x',u:''},{k:'pasos',v:40,min:1,max:300,step:1,l:'pasos de tiempo',u:''}],
 draw(a){a.clear();
  const nx=Math.round(a.st.nx), lam=a.st.lam, M=Math.round(a.st.pasos);
  const h=1/nx;
  let u=[];
  for(let i=0;i<=nx;i++){const x=i*h;
    u.push(a.st.ini==='sen'?Math.sin(Math.PI*x):(a.st.ini==='pulso'?(x>0.35&&x<0.65?1:0):(x<0.5?2*x:2-2*x)));}
  u[0]=0;u[nx]=0;
  const hist=[u.slice()];
  for(let j=0;j<M;j++){
    const v=u.slice();
    for(let i=1;i<nx;i++)v[i]=lam*u[i+1]+(1-2*lam)*u[i]+lam*u[i-1];
    v[0]=0;v[nx]=0;u=v;hist.push(u.slice());
    if(Math.max(...u.map(Math.abs))>1e6)break;}
  const x0=70,y0=300,wv=540,hv=240;
  const maxv=Math.max(1.2,...hist[hist.length-1].map(Math.abs));
  const esc=Math.min(maxv,6);
  const px=x=>x0+x*wv, py=v=>y0-hv/2-v/esc*hv/2;
  Eje(a,x0,y0-hv/2,wv,0,'x','');
  a.line(x0,y0,x0,y0-hv,C.muted,1.5);
  a.line(x0,py(0),x0+wv,py(0),C.muted,1.2);
  a.txt('u',x0-10,py(1)+4,C.muted,11,'right');
  // historico
  const paso=Math.max(1,Math.floor(hist.length/12));
  for(let j=0;j<hist.length;j+=paso){
    const alpha=0.18+0.6*j/Math.max(1,hist.length-1);
    a.g.strokeStyle=C.f;a.g.globalAlpha=alpha*0.5;a.g.lineWidth=1.2;a.g.beginPath();
    hist[j].forEach((v,i)=>{const X=px(i*h),Y=py(v);i===0?a.g.moveTo(X,Y):a.g.lineTo(X,Y);});
    a.g.stroke();a.g.globalAlpha=1;}
  a.g.strokeStyle=C.a;a.g.lineWidth=3;a.g.beginPath();
  hist[hist.length-1].forEach((v,i)=>{const X=px(i*h),Y=py(v);i===0?a.g.moveTo(X,Y):a.g.lineTo(X,Y);});a.g.stroke();
  hist[hist.length-1].forEach((v,i)=>{if(nx<=24)a.circ(px(i*h),py(v),3,C.a,true);});
  // malla
  for(let i=0;i<=nx;i+=Math.max(1,Math.round(nx/10)))a.line(px(i*h),y0,px(i*h),y0-hv,C.grid,1);
  const k=lam*h*h;
  const t=M*k;
  const exacta=a.st.ini==='sen'?Math.exp(-Math.PI*Math.PI*t):null;
  const num=Math.max(...hist[hist.length-1]);
  const inestable=lam>0.5;
  a.g.fillStyle=inestable?C.b:C.c;a.g.globalAlpha=0.12;a.g.fillRect(x0,y0+14,wv,40);a.g.globalAlpha=1;
  a.g.strokeStyle=inestable?C.b:C.c;a.g.lineWidth=2;a.g.strokeRect(x0,y0+14,wv,40);
  a.txt(inestable?'λ > 0,5  ⇒  ESQUEMA INESTABLE: la solución oscila y explota':'λ ≤ 0,5  ⇒  esquema estable',x0+wv/2,y0+40,inestable?C.b:C.c,14,'center');
  a.html(`Ecuación del calor u<sub>t</sub> = u<sub>xx</sub> en [0,1] con u(0,t) = u(1,t) = 0, esquema <b>explícito</b>: u<sub>i</sub><sup>j+1</sup> = λu<sub>i+1</sub> + (1−2λ)u<sub>i</sub> + λu<sub>i−1</sub>.<br>
  h = ${N3(h)} · λ = ${N2(lam)} ⇒ k = λh² = <b>${N4(k)}</b> · tras ${M} pasos, t = <b>${N3(t)}</b> · máximo de u = <b>${N3(num)}</b>${exacta!==null?` frente al exacto e^(−π²t)·sen(πx) ⇒ ${N4(exacta)}`:''}.<br>
  ${inestable?'<b>Fíjate en los dientes de sierra</b>: con λ > 0,5 el esquema amplifica los errores en cada paso aunque el problema físico sea perfectamente estable.':'La solución se aplana: el calor difunde y la amplitud decae exponencialmente.'}<br>
  <span class="hint">Baja λ por debajo de 0,5 y súbelo por encima para ver el salto: esa condición es la respuesta a la pregunta de estabilidad del examen.</span>`);}});

/* Extra · Serie de Fourier y fenómeno de Gibbs */
SIMS.fourier=el=>build(el,{w:660,h:420,
 selects:[{k:'f',v:'cuad',l:'señal periódica',opts:[['cuad','onda cuadrada'],['tri','onda triangular'],['dsierra','diente de sierra'],['rect','pulso rectangular (ciclo 25 %)']]}],
 sliders:[{k:'N',v:7,min:1,max:60,step:1,l:'armónicos N',u:''}],
 draw(a){a.clear();const N=Math.round(a.st.N);
  const F={cuad:[t=>(t%(2*Math.PI)<Math.PI?1:-1),n=>n%2?[0,4/(Math.PI*n)]:[0,0],'cuadrada'],
   tri:[t=>{const u=(t%(2*Math.PI))/Math.PI;return u<1?-1+2*u:3-2*u;},n=>n%2?[-8/(Math.PI*Math.PI*n*n)*(n%4===1?1:-1),0]:[0,0],'triangular'],
   dsierra:[t=>{const u=(t%(2*Math.PI))/Math.PI;return u<2?u-1:0;},n=>[0,-2/(Math.PI*n)*(n%2?1:-1)*(-1)],'diente de sierra'],
   rect:[t=>((t%(2*Math.PI))<Math.PI/2?1:0),n=>[2/(Math.PI*n)*Math.sin(n*Math.PI/2),2/(Math.PI*n)*(1-Math.cos(n*Math.PI/2))],'pulso 25 %']};
  const [f,coef,nom]=F[a.st.f];
  const a0=a.st.f==='rect'?0.25:(a.st.f==='dsierra'?0:0);
  const S=t=>{let s=a0;for(let n=1;n<=N;n++){const [an,bn]=coef(n);s+=an*Math.cos(n*t)+bn*Math.sin(n*t);}return s;};
  const x0=60,y0=250,wv=430,hv=190;
  const T=4*Math.PI;
  const px=t=>x0+t/T*wv, py=v=>y0-hv/2-v/1.6*hv/2;
  Eje(a,x0,y0-hv/2,wv,0,'t','');
  a.line(x0,y0,x0,y0-hv,C.muted,1.5);
  a.line(x0,py(0),x0+wv,py(0),C.muted,1.2);
  a.g.strokeStyle=C.muted;a.g.lineWidth=2;a.g.setLineDash([5,4]);a.g.beginPath();
  for(let i=0;i<=600;i++){const t=T*i/600;const Y=py(f(t));
    if(i>0&&Math.abs(f(T*(i-1)/600)-f(t))>0.5)a.g.moveTo(px(t),Y);else i===0?a.g.moveTo(px(t),Y):a.g.lineTo(px(t),Y);}
  a.g.stroke();a.g.setLineDash([]);
  a.g.strokeStyle=C.a;a.g.lineWidth=2.6;a.g.beginPath();
  let maxS=0;
  for(let i=0;i<=800;i++){const t=T*i/800;const v=S(t);maxS=Math.max(maxS,v);
    i===0?a.g.moveTo(px(t),py(v)):a.g.lineTo(px(t),py(v));}
  a.g.stroke();
  a.txt('suma parcial con N = '+N,x0+4,y0-hv+14,C.a,12);
  a.txt('señal original',x0+4,y0-hv+32,C.muted,12);
  // espectro
  const ex=540,ey=250,ew=90,eh=190;
  a.line(ex,ey,ex+ew,ey,C.muted,1.4);a.line(ex,ey,ex,ey-eh,C.muted,1.4);
  a.txt('espectro',ex,ey-eh-10,C.muted,11);
  a.txt('n',ex+ew,ey+18,C.muted,10,'center');
  let mx=0;const amps=[];
  for(let n=1;n<=Math.min(N,20);n++){const [an,bn]=coef(n);const A=Math.hypot(an,bn);amps.push(A);mx=Math.max(mx,A);}
  amps.forEach((A,i)=>{const X=ex+6+i*(ew-8)/Math.max(amps.length,8);
    a.line(X,ey,X,ey-A/Math.max(mx,1e-9)*eh*0.9,C.f,2.5);});
  const over=(maxS-1)*100;
  a.html(`Serie de Fourier de la onda <b>${nom}</b> con <b>N = ${N}</b> armónicos.<br>
  ${a.st.f==='cuad'?'Sólo hay armónicos impares, con amplitud 4/(πn): el espectro decae como 1/n.':(a.st.f==='tri'?'Armónicos impares con amplitud ∝ 1/n²: converge mucho más rápido porque la señal es continua.':'El espectro muestra la amplitud de cada armónico.')}<br>
  ${a.st.f==='cuad'||a.st.f==='dsierra'||a.st.f==='rect'?`<b>Fenómeno de Gibbs</b>: junto al salto la suma parcial se pasa un <b>${N2(Math.max(0,over))} %</b> por encima, y ese sobreimpulso <b>no desaparece</b> al aumentar N (sólo se estrecha). Es el ≈9 % clásico.`:'Al ser continua, la serie converge uniformemente y no hay fenómeno de Gibbs.'}<br>
  <span class="hint">Cuanto más suave es la señal, más rápido decaen sus armónicos: una discontinuidad cuesta 1/n, un pico 1/n². Esa es la idea que luego se usa en filtrado y muestreo.</span>`);}});

document.querySelectorAll('[data-sim]').forEach(el=>{const f=SIMS[el.dataset.sim];if(f)f(el);});
})();
