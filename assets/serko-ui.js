(function(){'use strict';
var d=document,root=d.documentElement,reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
root.classList.add('js');
// text-roll nav links
d.querySelectorAll('header nav a').forEach(function(a){var t=a.textContent.trim();a.textContent='';var r=d.createElement('span');r.className='r';r.innerHTML='<i></i><i aria-hidden="true"></i>';r.children[0].textContent=t;r.children[1].textContent=t;a.appendChild(r);});
// scroll progress bar
var h=d.querySelector('header');
function sp(){var m=root.scrollHeight-innerHeight;if(h)h.style.setProperty('--p',m>0?Math.min(1,scrollY/m):0);}
addEventListener('scroll',sp,{passive:true});sp();
// seamless marquee
d.querySelectorAll('.marquee .track').forEach(function(t){if(reduce)return;[].slice.call(t.children).forEach(function(li){var c=li.cloneNode(true);c.setAttribute('aria-hidden','true');t.appendChild(c);});});
// staggered reveal
d.querySelectorAll('.svc,.work,.why,.feature-grid,.statements,.steps').forEach(function(g){[].slice.call(g.children).forEach(function(c,i){c.style.setProperty('--d',(i*90)+'ms');});});
// hero parallax (mouse devices only)
var hero=d.querySelector('.hero'),st=d.querySelector('.hero-visual');
if(hero&&st&&!reduce&&matchMedia('(hover:hover) and (pointer:fine)').matches){
  var raf;
  hero.addEventListener('pointermove',function(e){var b=st.getBoundingClientRect(),x=(e.clientX-b.left)/b.width-.5,y=(e.clientY-b.top)/b.height-.5;cancelAnimationFrame(raf);raf=requestAnimationFrame(function(){st.style.setProperty('--px',x.toFixed(3));st.style.setProperty('--py',y.toFixed(3));});});
  hero.addEventListener('pointerleave',function(){st.style.setProperty('--px',0);st.style.setProperty('--py',0);});
}
// chat demo sequence
var chat=d.querySelector('.chat');
if(chat){
  var ms=[].slice.call(chat.querySelectorAll('.m')),typing=chat.querySelector('.typing');
  var show=function(i){if(ms[i])ms[i].classList.add('show');};
  var run=function(){show(0);setTimeout(function(){show(1);},600);setTimeout(function(){typing.classList.remove('show');show(2);},2000);setTimeout(function(){show(3);},2900);setTimeout(function(){chat.classList.add('done');},3800);};
  if(reduce||!('IntersectionObserver' in window)){ms.forEach(function(m){if(m!==typing)m.classList.add('show');});chat.classList.add('done');}
  else{var io=new IntersectionObserver(function(es){if(es[0].isIntersecting){io.disconnect();run();}},{threshold:.45});io.observe(chat);}
}
// smooth FAQ accordion
d.querySelectorAll('.faq-list details').forEach(function(el){
  var s=el.querySelector('summary'),p=el.querySelector('p'),a;
  s.addEventListener('click',function(e){
    if(reduce||!p.animate)return;
    e.preventDefault();if(a)a.cancel();
    var pt=getComputedStyle(p).paddingTop;
    if(!el.open){el.open=true;var hh=p.offsetHeight;a=p.animate({height:['0px',hh+'px'],paddingTop:['0px',pt],opacity:[0,1]},{duration:350,easing:'cubic-bezier(.2,.7,.2,1)'});a.onfinish=function(){a=null;};}
    else{var h2=p.offsetHeight;a=p.animate({height:[h2+'px','0px'],paddingTop:[pt,'0px'],opacity:[1,0]},{duration:280,easing:'ease'});a.onfinish=function(){el.open=false;a=null;};}
  });
});
// mobile menu: CTA inside, scroll lock, Esc + resize close
var nav=d.getElementById('nav'),menu=d.querySelector('.menu');
if(nav&&menu){
  var ul=nav.querySelector('ul');
  if(ul){var li=d.createElement('li');li.className='nav-cta';li.innerHTML='<a class="btn p" href="contact.html">Start a project</a>';ul.appendChild(li);}
  var close=function(){nav.classList.remove('open');menu.setAttribute('aria-expanded','false');menu.textContent='Menu';d.body.classList.remove('nolock');};
  menu.addEventListener('click',function(){d.body.classList.toggle('nolock',nav.classList.contains('open'));});
  d.addEventListener('keydown',function(e){if(e.key==='Escape'&&nav.classList.contains('open')){close();menu.focus();}});
  matchMedia('(min-width:1041px)').addEventListener('change',function(e){if(e.matches)close();});
}
// mobile quick-contact dock (hidden on contact page)
if(!/contact\.html/.test(location.pathname)&&matchMedia('(max-width:680px)').matches){
  var dk=d.createElement('div');dk.className='dock';
  dk.innerHTML='<a class="btn p" href="contact.html">Start a project</a><a class="btn g" href="https://wa.me/'+((window.VX&&VX.wa)||'919953752331')+'" rel="noopener">WhatsApp</a>';
  d.body.appendChild(dk);d.body.classList.add('has-dock');
  var ft=d.querySelector('footer');
  var upd=function(){var near=ft&&ft.getBoundingClientRect().top<innerHeight;dk.classList.toggle('show',scrollY>500&&!near&&!(nav&&nav.classList.contains('open')));};
  addEventListener('scroll',upd,{passive:true});upd();
}
// interactive logo: mark = theme switch (tilt, glow, flip, ripple, tooltip); wordmark = home link
var oldLogo=d.querySelector('header .logo');
if(oldLogo){
  var imgs=[].slice.call(oldLogo.querySelectorAll('img'));
  var brand=d.createElement('div');brand.className='logo brand';
  var btn=d.createElement('button');btn.type='button';btn.className='logo-mark';
  var inner=d.createElement('span');inner.className='mark-in';
  imgs.forEach(function(i){inner.appendChild(i);});
  var badge=d.createElement('span');badge.className='mode-badge';badge.setAttribute('aria-hidden','true');
  badge.innerHTML='<svg class="ic-moon" viewBox="0 0 24 24"><path d="M21 12.8A9 9 0 1111.2 3a7 7 0 009.8 9.8z"/></svg><svg class="ic-sun" viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>';
  btn.appendChild(inner);btn.appendChild(badge);
  var tip=d.createElement('span');tip.className='logo-tip';tip.setAttribute('aria-hidden','true');
  var word=d.createElement('a');word.className='wordmark';word.href=oldLogo.getAttribute('href')||'index.html';word.textContent='Vertex Web Studio';
  brand.appendChild(btn);brand.appendChild(tip);brand.appendChild(word);
  oldLogo.replaceWith(brand); // drops the old whole-logo click handler
  var isDark=function(){return root.dataset.theme==='dark';};
  var sync=function(){
    var next=isDark()?'light':'dark';
    btn.setAttribute('aria-label','Switch to '+next+' mode');
    btn.setAttribute('aria-pressed',String(isDark()));
    tip.textContent='Switch to '+next+' mode';
  };
  sync();
  btn.addEventListener('click',function(){
    var next=isDark()?'light':'dark';
    if(!reduce){root.classList.add('theme-anim');setTimeout(function(){root.classList.remove('theme-anim');},520);}
    root.dataset.theme=next;
    try{localStorage.setItem('vx-theme',next);}catch(err){}
    var m=d.querySelector('meta[name=theme-color]');if(m)m.content=next==='dark'?'#0A0A0A':'#FFFDF8';
    btn.classList.add('seen');sync();
    if(!reduce){
      inner.classList.remove('flip');void inner.offsetWidth;inner.classList.add('flip');
      badge.classList.remove('spin');void badge.offsetWidth;badge.classList.add('spin');
      var rp=d.createElement('span');rp.className='ripple';btn.appendChild(rp);setTimeout(function(){rp.remove();},750);
    }
  });
  btn.addEventListener('pointerenter',function(){btn.classList.add('seen');});
  // 3D tilt that follows the cursor (mouse devices only)
  if(!reduce&&matchMedia('(hover:hover) and (pointer:fine)').matches){
    btn.addEventListener('pointermove',function(e){
      var r=btn.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
      inner.style.setProperty('--ry',(x*34).toFixed(1)+'deg');inner.style.setProperty('--rx',(-y*34).toFixed(1)+'deg');
    });
    btn.addEventListener('pointerleave',function(){inner.style.setProperty('--rx','0deg');inner.style.setProperty('--ry','0deg');});
  }
}
})();
