/* Matemáticas III: una animación por tema */
(function(){var M=window.MANIM;if(!M)return;var U=M.util,C=M.C,nf=U.nf,lerp=U.lerp,ease=U.ease,seg=U.seg,clamp=U.clamp,RG=U.RG,W=640;

/* T1 raíces n-ésimas de la unidad */
M.reg('mat3-t1',M.base({title:'Raíces n-ésimas de la unidad',H:540,dur:20,caps:[[6,'Las soluciones de <i>zⁿ = 1</i> son <i>z_k = e^{2πik/n}</i>, k = 0, …, n − 1: todas tienen módulo 1.'],[13,'Están repartidas uniformemente en la circunferencia unidad: forman un polígono regular de n lados con un vértice en z = 1.'],[99,'Para hallar las raíces de cualquier complejo <i>w</i>: módulo <i>|w|^{1/n}</i> y argumentos <i>(arg w + 2πk)/n</i>. Siempre hay exactamente n raíces.']]},
 function(D,t){var n=3+Math.min(5,Math.floor(t/3.2)),cx=220,cy=290,R=140,rot=ease(seg(t%3.2,0,1.2));
  D.line(cx-R-30,cy,cx+R+30,cy,C.ax,1.2);D.line(cx,cy-R-30,cx,cy+R+30,C.ax,1.2);D.ring(cx,cy,R,C.grid,1.4);
  var pts=[];for(var k=0;k<n;k++){var a=2*Math.PI*k/n*rot;pts.push([cx+R*Math.cos(a),cy-R*Math.sin(a)]);}
  D.path(pts.concat([pts[0]]),C.m,2,RG(C.m,.12));pts.forEach(function(p,k){D.line(cx,cy,p[0],p[1],C.mut,1,[3,3]);D.dot(p[0],p[1],7,k?C.m:C.hl);D.text('z'+String.fromCharCode(8320+k),p[0]+(p[0]>cx?8:-26),p[1]-8,{s:15,c:C.m});});
  D.text('z^{'+n+'} = 1',520,220,{it:true,s:30,a:'center',c:C.m,bold:true});D.text(n+' raíces',520,262,{s:20,a:'center'});D.text('cada '+nf(360/n,1)+'°',520,296,{s:18,a:'center',c:C.mut});}));

/* T2 transformación conforme w = z² */
M.reg('mat3-t2',M.base({title:'Aplicación conforme: w = z²',H:560,dur:18,caps:[[6,'Una cuadrícula del primer cuadrante del plano z se transforma con <i>w = z²</i>. Las rectas horizontales y verticales se convierten en parábolas.'],[12,'Las parábolas se siguen cortando en ángulo recto: una función holomorfa con derivada no nula es <b>conforme</b> (conserva ángulos).'],[99,'En z = 0 la derivada se anula y el ángulo se duplica: el cuadrante de 90° se abre en un semiplano de 180°.']]},
 function(D,t){var u=U.pp(t,18),cx=320,cy=430,s=95,map=function(x,y){var X=x*x-y*y,Y=2*x*y;return [lerp(x,X,u),lerp(y,Y,u)];};
  D.line(40,cy,600,cy,C.ax,1.2);D.line(cx,cy+20,cx,90,C.ax,1.2);var c=D.ctx;c.save();c.beginPath();c.rect(30,80,580,370);c.clip();
  for(var i=0;i<=8;i++){var v=i*0.2,p1=[],p2=[];for(var j=0;j<=60;j++){var w=j/60*1.6,a=map(v,w),b=map(w,v);p1.push([cx+s*a[0],cy-s*a[1]]);p2.push([cx+s*b[0],cy-s*b[1]]);}D.path(p1,C.f,1.6,null,0.85);D.path(p2,C.g,1.6,null,0.85);}c.restore();
  D.text(u<0.05?'plano z':(u>0.95?'plano w = z²':'deformando…'),W/2,490,{s:20,a:'center',c:C.m,bold:true});D.text('f′(z) = 2z ≠ 0  ⇒  los ángulos se conservan',W/2,524,{s:18,a:'center'});}));

/* T3 teorema de los residuos */
M.reg('mat3-t3',M.base({title:'Teorema de los residuos',H:560,dur:18,caps:[[6,'<i>f(z) = z/((z − 0,6)(z + 1,5))</i> tiene polos en 0,6 y −1,5. Integramos sobre una circunferencia de radio R que va creciendo.'],[12,'Mientras no encierra polos la integral es 0 (Cauchy). Al englobar el polo de 0,6 vale <i>2πi·Res = 2πi·0,286</i>.'],[99,'Con los dos polos dentro, <i>∮ f dz = 2πi·(0,286 + 0,714) = 2πi</i>. Solo cuentan los residuos de los polos encerrados.']]},
 function(D,t){var R=lerp(0.3,2.1,ease(seg(t,1,16))),cx=300,cy=275,s=80;D.line(cx-2.6*s,cy,cx+2.4*s,cy,C.ax,1.2);D.line(cx,cy-2*s,cx,cy+2*s,C.ax,1.2);
  [[0.6,0.2857],[-1.5,0.7143]].forEach(function(p){var inn=Math.abs(p[0])<R;D.cross(cx+s*p[0],cy,8,inn?C.hl:C.mut);D.text('Res = '+nf(p[1],3),cx+s*p[0],cy+28,{s:14,a:'center',c:inn?C.hl:C.mut});});
  D.ring(cx,cy,s*R,C.m,2.6);var a=t*1.5;D.head(cx+s*R*Math.cos(a),cy-s*R*Math.sin(a),-a-Math.PI/2,C.m,11);
  var sum=(R>0.6?0.2857:0)+(R>1.5?0.7143:0);D.text('R = '+nf(R,2)+'      ∮ f dz = 2πi·'+nf(sum,3)+' = '+nf(2*Math.PI*sum,3)+' i',W/2,520,{it:true,s:22,a:'center',c:C.m});}));

/* T4 transformada de Fourier de un pulso */
M.reg('mat3-t4',M.curva({title:'Transformada de Fourier de un pulso',H:560,dur:18,p:[2,0.4],ax:{xr:[-12,12],yr:[-0.5,2.2],xt:[-10,-5,5,10],yt:[1,2],xd:0,yd:0,xl:'ω',yl:'X(ω)'},h:280,ghost:true,
 f:function(w,tau){return Math.abs(w)<1e-6?tau:2*Math.sin(w*tau/2)/w;},
 extra:function(D,A,tau){var x0=470,y0=150,s=40;D.line(x0-80,y0,x0+80,y0,C.ax,1);D.path([[x0-80,y0],[x0-s*tau/2,y0],[x0-s*tau/2,y0-40],[x0+s*tau/2,y0-40],[x0+s*tau/2,y0],[x0+80,y0]],C.g,2.4);D.text('x(t): pulso de ancho τ',x0,y0+20,{s:13,a:'center',c:C.g});
   D.line(A.X(2*Math.PI/tau),A.Y(0),A.X(2*Math.PI/tau),A.Y(-0.4),C.hl,1.6);D.text('2π/τ',A.X(2*Math.PI/tau),A.Y(-0.48)+14,{s:13,a:'center',c:C.hl});},
 read:function(tau){return ['τ = '+nf(tau,2)+'    primer cero en ω = 2π/τ = '+nf(2*Math.PI/tau,2),'X(ω) = τ·sinc(ωτ/2):  pulso estrecho ⇔ espectro ancho'];},
 caps:[[6,'Un pulso rectangular de duración τ tiene como transformada de Fourier una función seno cardinal: <i>X(ω) = 2 sen(ωτ/2)/ω</i>.'],[12,'Al estrechar el pulso, el espectro se ensancha: el primer cero está en <i>ω = 2π/τ</i>.'],[99,'Es el principio de incertidumbre tiempo-frecuencia: no se puede tener a la vez una señal muy corta y un espectro muy estrecho.']]}));

/* T5 regiones de Laurent */
M.reg('mat3-t5',M.base({title:'Series de Laurent: una función, tres desarrollos',H:560,dur:18,caps:[[6,'<i>f(z) = 1/((z − 1)(z − 2))</i> tiene polos en 1 y 2. Cada corona entre singularidades admite un desarrollo distinto.'],[12,'En <i>1 &lt; |z| &lt; 2</i> el desarrollo tiene potencias negativas y positivas: es una serie de Laurent propiamente dicha.'],[99,'Para <i>|z| &gt; 2</i> solo hay potencias negativas: es lo que usa la transformada Z con ROC exterior, la de una secuencia causal.']]},
 function(D,t){var k=Math.min(2,Math.floor(t/6)),cx=240,cy=285,s=62,c=D.ctx;
  var rg=[[0,1],[1,2],[2,2.95]][k];c.save();c.fillStyle=RG(C.m,.22);c.beginPath();c.arc(cx,cy,s*rg[1],0,6.283);if(rg[0]>0)c.arc(cx,cy,s*rg[0],0,6.283,true);c.fill('evenodd');c.restore();
  D.line(cx-3.2*s,cy,cx+3.2*s,cy,C.ax,1.2);D.line(cx,cy-3*s,cx,cy+3*s,C.ax,1.2);D.ring(cx,cy,s,C.mut,1,[4,4]);D.ring(cx,cy,2*s,C.mut,1,[4,4]);D.cross(cx+s,cy,8,C.hl);D.cross(cx+2*s,cy,8,C.hl);
  var txt=[['|z| < 1','serie de Taylor: Σ (1 − 2^{−n−1}) zⁿ'],['1 < |z| < 2','Laurent: −Σ z^{−n−1} − Σ zⁿ/2^{n+1}'],['|z| > 2','solo potencias negativas: Σ (2ⁿ − 1) z^{−n−1}']][k];
  D.text(txt[0],520,250,{it:true,s:24,a:'center',c:C.m,bold:true});D.text(txt[1],W/2,500,{it:true,s:19,a:'center'});}));

/* T6 ecuación del calor en diferencias finitas */
var NX=21,U6=null,last6=-1;
M.reg('mat3-t6',M.base({title:'Ecuación del calor con diferencias finitas',H:560,dur:18,caps:[[6,'Barra con los extremos a 0 °C y un punto caliente en el centro. Ecuación: <i>u<sub>t</sub> = α u<sub>xx</sub></i>.'],[12,'Esquema explícito: <i>uᵢ^{n+1} = uᵢⁿ + r(uᵢ₊₁ⁿ − 2uᵢⁿ + uᵢ₋₁ⁿ)</i>, con <i>r = αΔt/Δx²</i>. El calor se reparte hacia los vecinos.'],[99,'El esquema explícito solo es estable si <i>r ≤ 1/2</i>; con r mayor aparecen oscilaciones que crecen sin control. Aquí r = 0,4.']]},
 function(D,t){var steps=Math.floor(Math.pow(seg(t,1,16),1.5)*60);if(!U6||steps<last6){U6=[];for(var i=0;i<NX;i++)U6.push(i===10?100:(i===9||i===11?50:0));last6=0;}
  while(last6<steps){var nu=U6.slice();for(var j=1;j<NX-1;j++)nu[j]=U6[j]+0.4*(U6[j+1]-2*U6[j]+U6[j-1]);U6=nu;last6++;}
  var A=U.axes(D,{xr:[0,20],yr:[0,105],xt:[0,5,10,15,20],yt:[25,50,75,100],xd:0,yd:0,xl:'nodo i',yl:'u (°C)'},{x:80,y:96,w:480,h:300,grid:true});
  D.path(U6.map(function(v,i){return [A.X(i),A.Y(v)];}),C.m,2.6);U6.forEach(function(v,i){D.dot(A.X(i),A.Y(v),4.5,C.m);});
  D.text('paso n = '+steps+'    r = αΔt/Δx² = 0,4 ≤ 1/2  (estable)',W/2,470,{it:true,s:20,a:'center',c:C.m});D.text('máx = '+nf(Math.max.apply(null,U6),1)+' °C',W/2,504,{s:18,a:'center'});}));
})();
