(function(){
  'use strict';
  var menu=document.querySelector('.menu');
  var nav=document.getElementById('nav');
  if(menu&&nav){
    menu.addEventListener('click',function(){
      var opened=nav.classList.toggle('open');
      menu.setAttribute('aria-expanded',String(opened));
      menu.textContent=opened?'Close':'Menu';
    });
    nav.querySelectorAll('a').forEach(function(link){
      link.addEventListener('click',function(){
        nav.classList.remove('open');
        menu.setAttribute('aria-expanded','false');
        menu.textContent='Menu';
      });
    });
  }

  var header=document.querySelector('header');
  if(header){
    var onScroll=function(){header.classList.toggle('is-scrolled',window.scrollY>12);};
    window.addEventListener('scroll',onScroll,{passive:true});onScroll();
  }


  // Light / dark switch: clicking the header logo toggles the theme (logo image swaps via CSS).
  var logo=document.querySelector('header .logo');
  if(logo){
    var root=document.documentElement;
    var isDark=function(){return root.dataset.theme==='dark';};
    var sync=function(){
      logo.setAttribute('role','button');
      logo.setAttribute('aria-pressed',String(isDark()));
      logo.title=isDark()?'Switch to light mode':'Switch to dark mode';
    };
    logo.addEventListener('click',function(e){
      e.preventDefault();
      var next=isDark()?'light':'dark';
      root.dataset.theme=next;
      try{localStorage.setItem('vx-theme',next);}catch(err){}
      logo.classList.remove('flip');void logo.offsetWidth;logo.classList.add('flip');
      var m=document.querySelector('meta[name=theme-color]');if(m)m.content=next==='dark'?'#0A0A0A':'#F7F5EF';
      sync();
    });
    sync();
  }

  // Reveal sections as they enter the viewport; retain content for reduced-motion users.
  var reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(!reduce&&'IntersectionObserver' in window){
    var targets=document.querySelectorAll('main section:not(.hero) .wrap > *:not(form), .work > a, .feature-card');
    var observer=new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){entry.target.classList.add('in-view');observer.unobserve(entry.target);}
      });
    },{threshold:.12,rootMargin:'0px 0px -35px 0px'});
    targets.forEach(function(el){el.classList.add('reveal');observer.observe(el);});
  }

  // Only the contact page has a form. It prepares a WhatsApp enquiry;
  // the visitor reviews it and explicitly presses Send in WhatsApp.
  var form=document.getElementById('enquiry');
  if(!form)return;
  var query=new URLSearchParams(window.location.search).get('service');
  var sel=form.elements.namedItem('service');
  if(query&&sel){
    var q=query.trim().toLowerCase(),match='';
    Array.prototype.forEach.call(sel.options,function(o){if(o.value&&o.value.toLowerCase()===q)match=o.value;});
    if(!match){
      var map=[['search engine','SEO'],['seo','SEO'],['website','Website Development'],['app','App Development'],
        ['performance','Performance Marketing'],['social','Social Media Growth'],['marketing','Digital Marketing'],
        ['engineering','Website Development'],['brand','Branding and Design'],['creative','Branding and Design'],
        ['video','Video Editing and Production'],['automation','Business Automation'],['consult','Growth Consulting'],
        ['recruit','Recruitment and HR Solutions'],['hr','Recruitment and HR Solutions']];
      for(var i=0;i<map.length;i++){if(q.indexOf(map[i][0])>-1){match=map[i][1];break;}}
    }
    sel.value=match||'Other';
  }
  var rules={
    name:[function(v){return v.trim().length>=2;},'Please enter your name.'],
    email:[function(v){return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());},'Please enter a valid email address.'],
    phone:[function(v){return v.replace(/\D/g,'').length>=8;},'Please enter a valid phone number.'],
    service:[function(v){return v.trim()!=='';},'Please select a service.'],
    details:[function(v){return v.trim().length>=10;},'Please add at least 10 characters about your project.']
  };
  function validate(key){
    var field=form.elements.namedItem(key);
    if(!field)return true;
    var result=rules[key][0](field.value);
    field.setAttribute('aria-invalid',String(!result));
    var error=document.getElementById('e-'+key);
    if(error)error.textContent=result?'':rules[key][1];
    return result;
  }
  Object.keys(rules).forEach(function(key){
    var field=form.elements.namedItem(key);
    if(field){
      field.addEventListener('blur',function(){validate(key);});
      field.addEventListener('input',function(){
        if(field.getAttribute('aria-invalid')==='true')validate(key);
      });
    }
  });
  form.addEventListener('submit',function(event){
    event.preventDefault();
    var status=document.getElementById('msg');
    var invalid=Object.keys(rules).filter(function(key){return !validate(key);});
    if(invalid.length){
      if(status){status.className='bad';status.textContent='Please check the highlighted fields before continuing.';}
      form.elements.namedItem(invalid[0]).focus();
      return;
    }
    // Quietly discard bot submissions caught by the honeypot.
    var trap=form.elements.namedItem('website');
    if(trap&&trap.value.trim())return;

    var data={
      name:form.elements.namedItem('name').value.trim(),
      email:form.elements.namedItem('email').value.trim(),
      phone:form.elements.namedItem('phone').value.trim(),
      company:form.elements.namedItem('company').value.trim(),
      service:form.elements.namedItem('service').value,
      details:form.elements.namedItem('details').value.trim(),
      page:window.location.href
    };
    var message=[
      'Hello Vertex Web Studio, I would like to discuss a project.',
      '',
      'Name: '+data.name,
      'Email: '+data.email,
      'Phone: '+data.phone,
      'Company: '+(data.company||'Not provided'),
      'Service: '+data.service,
      '',
      'Project details:',
      data.details,
      '',
      'Source: '+data.page
    ].join('\n');
    var number=(window.VX&&VX.wa)||'919953752331';
    var waUrl='https://wa.me/'+number+'?text='+encodeURIComponent(message);
    var email=(window.VX&&VX.email)||'infovertexwebstudio@gmail.com';
    var endpoint=(window.VX&&VX.endpoint)||'';
    var button=form.querySelector('button[type=submit]');

    function show(cls,text,linkText,linkHref){
      if(!status)return;
      status.className=cls;status.textContent=text;clearTimeout(window.__vxT);window.__vxT=setTimeout(function(){try{status.scrollIntoView({block:'center',behavior:'smooth'});}catch(e){}},150);
      if(linkText){
        status.appendChild(document.createTextNode(' '));
        var a=document.createElement('a');a.href=linkHref;a.target='_blank';a.rel='noopener';a.textContent=linkText;
        status.appendChild(a);
      }
    }
    function viaWhatsApp(){
      show('ok','Your enquiry is prepared. WhatsApp will open; review the message and press Send there to complete your enquiry.');
      var popup=window.open(waUrl,'_blank');
      if(popup)popup.opener=null;else window.location.href=waUrl;
    }

    var sheet=(window.VX&&VX.sheet)||'';

    // No backend configured: fall back to a prefilled WhatsApp message.
    if(!endpoint&&!sheet){viaWhatsApp();return;}

    if(button){button.disabled=true;button.textContent='Sending...';}
    show('ok','Sending your enquiry...');
    var service=data.service;

    function withTimeout(fn){
      var c=window.AbortController?new AbortController():null;
      var t=c?setTimeout(function(){c.abort();},20000):null;
      return fn(c?c.signal:undefined).then(function(r){if(t)clearTimeout(t);return r;},function(e){if(t)clearTimeout(t);throw e;});
    }
    // Email delivery (FormSubmit or any JSON endpoint).
    function sendEmail(){
      if(!endpoint)return Promise.resolve(false);
      var payload={
        name:data.name,email:data.email,phone:data.phone,company:data.company||'Not provided',
        service:data.service,details:data.details,page:data.page,
        _subject:'New enquiry from vertexwebstudio.in: '+data.service,
        _replyto:data.email,_template:'table',_captcha:'false'
      };
      return withTimeout(function(signal){
        return fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify(payload),signal:signal});
      }).then(function(res){
        return res.json().catch(function(){return {};}).then(function(body){
          return res.ok&&body.success!==false&&body.success!=='false';
        });
      }).catch(function(){return false;});
    }
    // Google Sheet row (Apps Script web app). no-cors is required by Apps Script;
    // the response is opaque, so a completed request counts as delivered.
    function sendSheet(){
      if(!sheet)return Promise.resolve(false);
      var body=new URLSearchParams({
        name:data.name,email:data.email,phone:data.phone,company:data.company,
        service:data.service,details:data.details,page:data.page,
        website:form.elements.namedItem('website')?form.elements.namedItem('website').value:''
      });
      return withTimeout(function(signal){
        return fetch(sheet,{method:'POST',mode:'no-cors',body:body,signal:signal});
      }).then(function(){return true;}).catch(function(){return false;});
    }

    Promise.all([sendEmail(),sendSheet()]).then(function(r){
      if(!r[0]&&!r[1])throw new Error('failed');
      form.reset();
      Object.keys(rules).forEach(function(k){var f=form.elements.namedItem(k);if(f)f.removeAttribute('aria-invalid');});
      show('ok','Thank you. Your enquiry has been sent and we will reply to '+data.email+' soon. In a hurry?','Message us on WhatsApp',waUrl);
    }).catch(function(){
      show('bad','We could not send your enquiry just now. Please send it on WhatsApp instead, or email '+email+'.','Open WhatsApp with my message',waUrl);
    }).then(function(){
      if(button){button.disabled=false;button.textContent='Send enquiry';}
    });
  });
})();