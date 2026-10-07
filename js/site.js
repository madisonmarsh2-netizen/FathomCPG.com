// Fathom CPG — header, mobile menu, partner form, testimonial slider, cookie notice.
(function(){
  (function cookieNotice(){
    var KEY='fathom-cookie-notice-seen';
    try{if(localStorage.getItem(KEY))return}catch(e){}
    var el=document.createElement('div');
    el.className='cookie-notice';
    el.innerHTML='<p>This site uses cookies and similar technology, including analytics, to understand how visitors use it. See our <a href="/privacy/">Privacy Policy</a> for details.</p><button type="button" class="pill tomato">Got it</button>';
    document.body.appendChild(el);
    el.querySelector('button').addEventListener('click',function(){try{localStorage.setItem(KEY,'1')}catch(e){}el.remove()});
  })();

  if("IntersectionObserver" in window){var io=new IntersectionObserver(function(es){es.forEach(function(e){e.target.classList.toggle("lit",e.isIntersecting)})},{rootMargin:"-40% 0px -40% 0px"});document.querySelectorAll(".zig li").forEach(function(l){io.observe(l)})}
  var nav=document.getElementById('nav'),burger=document.getElementById('burger');
  var top=document.querySelector('header.top');
  function fitNav(){
    if(window.innerWidth<=1100){top.classList.remove('compact');return}
    top.classList.remove('compact');nav.classList.remove('open');
    var as=[].slice.call(nav.querySelectorAll('a'));if(!as.length)return;
    var t0=as[0].getBoundingClientRect().top,wrapped=as.some(function(a){return Math.abs(a.getBoundingClientRect().top-t0)>2});
    var hdr=top.getBoundingClientRect(),brand=document.querySelector('.top .brand').getBoundingClientRect(),right=document.querySelector('.top .right').getBoundingClientRect(),navr=nav.getBoundingClientRect();
    var center=hdr.left+hdr.width/2,gap=16;
    var crowded=(navr.right>center-brand.width/2-gap)||(right.left<center+brand.width/2+gap);
    if(wrapped||crowded)top.classList.add('compact');
  }
  window.addEventListener('resize',fitNav);
  burger.addEventListener('click',function(){var o=nav.classList.toggle('open');burger.setAttribute('aria-expanded',o)});
  fitNav();if(document.fonts&&document.fonts.ready)document.fonts.ready.then(fitNav);window.addEventListener('load',fitNav);

  function fitHeadingLines(){
    var h2=document.querySelector('.fit-heading');
    if(!h2)return;
    var lines=[].slice.call(h2.querySelectorAll('.fit-line'));
    if(!lines.length)return;
    lines.forEach(function(l){l.style.fontSize='';l.style.whiteSpace=''});
    h2.style.width='';
    if(window.innerWidth<=1100)return;
    lines.forEach(function(l){l.style.whiteSpace='nowrap'});
    var target=h2.getBoundingClientRect().width;
    var groups={};
    lines.forEach(function(l){
      var key=l.closest('em')?'em':'plain';
      (groups[key]=groups[key]||[]).push(l);
    });
    Object.keys(groups).forEach(function(key){
      var groupLines=groups[key];
      var sizes=groupLines.map(function(l){
        var base=parseFloat(getComputedStyle(l).fontSize);
        var w=l.getBoundingClientRect().width;
        return base*target/w;
      });
      var minSize=Math.min.apply(null,sizes);
      groupLines.forEach(function(l){l.style.fontSize=minSize+'px'});
    });
    h2.style.width=target+'px';
  }
  fitHeadingLines();
  if(document.fonts&&document.fonts.ready)document.fonts.ready.then(fitHeadingLines);
  window.addEventListener('load',fitHeadingLines);
  var _fitTO;
  window.addEventListener('resize',function(){clearTimeout(_fitTO);_fitTO=setTimeout(fitHeadingLines,150)});

  var form=document.getElementById('intake');
  if(form){
  var steps=[].slice.call(form.querySelectorAll('.fstep')),prog=[].slice.call(document.querySelectorAll('#prog a'));
  var cur=0,back=document.getElementById('back'),next=document.getElementById('next');
  function show(n){
    cur=n;
    steps.forEach(function(s,i){s.classList.toggle('on',i===n)});
    prog.forEach(function(a,i){a.classList.toggle('on',i===n);a.classList.toggle('done',i<n)});
    back.style.visibility=n===0?'hidden':'visible';
    next.innerHTML=n===steps.length-1?'Send it <span class="arr">→</span>':'Continue <span class="arr">→</span>';
    var top=document.querySelector('.formwrap').getBoundingClientRect().top+window.scrollY-100;
    if(window.scrollY>top)window.scrollTo({top:top,behavior:'smooth'});
  }
  prog.forEach(function(a){a.addEventListener('click',function(e){e.preventDefault();show(+a.dataset.step)})});
  back.addEventListener('click',function(){if(cur>0)show(cur-1)});
  var problem=document.getElementById('problem'),problemErr=document.getElementById('problemErr'),timelineErr=document.getElementById('timelineErr');
  function okProblem(){if(problem.value.trim()){problemErr.classList.remove('on');return true}problemErr.classList.add('on');return false}
  function okTimeline(){if(form.querySelector('input[name="timeline"]:checked')){timelineErr.classList.remove('on');return true}timelineErr.classList.add('on');return false}
  problem.addEventListener('input',function(){if(problem.value.trim())problemErr.classList.remove('on')});
  [].slice.call(form.querySelectorAll('input[name="timeline"]')).forEach(function(r){r.addEventListener('change',function(){timelineErr.classList.remove('on')})});
  next.addEventListener('click',function(){
    if(cur===3&&!okProblem()){problem.focus();return}
    if(cur<steps.length-1){show(cur+1);return}
    if(!okTimeline())return;
    if(!okProblem()){show(3);okProblem();problem.focus();return}
    var email=document.getElementById('email'),err=document.getElementById('emailErr');
    if(!email.value||!/.+@.+\..+/.test(email.value)){err.classList.add('on');email.focus();return}
    err.classList.remove('on');
    var fd=new FormData(form),lines=[],seen={};
    fd.forEach(function(v,k){if(!v)return;seen[k]=seen[k]?seen[k]+', '+v:v});
    ['brand','site','category','team','channels','doors','retailers','distribution','revenue','funding','data','needs','problem','shape','timeline','name','role','email','heard'].forEach(function(k){if(seen[k])lines.push(k.toUpperCase()+': '+seen[k])});
    var fd=new FormData(form);fd.set('summary',lines.join('\n'));
    fetch(location.pathname||'/',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:new URLSearchParams(fd).toString()}).catch(function(){location.href='mailto:madison@fathomcpg.com?subject='+encodeURIComponent('Partner with Fathom: '+(seen.brand||'new brand'))+'&body='+encodeURIComponent(lines.join('\n'))});
    form.style.display='none';document.getElementById('done').classList.add('on');
    var dTop=document.querySelector('.formwrap').getBoundingClientRect().top+window.scrollY-90;window.scrollTo({top:Math.max(0,dTop),behavior:'smooth'});
  });
  show(0);
  }

  var NEWS_KEY='fathom-newsletter-popup',POPUP_AFTER=60; // seconds of visible time on the site before the popup
  function newsDone(){try{localStorage.setItem(NEWS_KEY,'done')}catch(e){}}
  function bindNews(f,onOk){
    var msg=f.querySelector('.news-msg'),btn=f.querySelector('button');
    f.addEventListener('submit',function(e){
      e.preventDefault();
      btn.disabled=true;msg.textContent='';
      fetch('/',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:new URLSearchParams(new FormData(f)).toString()})
        .then(function(r){if(!r.ok)throw 0;f.reset();f.classList.add('done');msg.textContent='✓ You’re subscribed. Thanks for joining!';newsDone();if(onOk)onOk()})
        .catch(function(){msg.textContent='Something went wrong. Please try again or email madison@fathomcpg.com.'})
        .then(function(){btn.disabled=false});
    });
  }
  document.querySelectorAll('form.news-form').forEach(function(f){bindNews(f)});

  (function newsletterPopup(){
    if(document.getElementById('intake'))return;
    var KEY='fathom-time-on-site',secs=0;
    try{if(localStorage.getItem(NEWS_KEY))return;secs=+localStorage.getItem(KEY)||0}catch(e){return}
    function open(){
      if(document.querySelector('.cookie-notice'))return false;
      var prev=document.activeElement;
      var el=document.createElement('div');
      el.className='news-pop';el.setAttribute('role','dialog');el.setAttribute('aria-modal','true');el.setAttribute('aria-labelledby','newsPopTitle');
      el.innerHTML='<div class="news-pop-card"><button type="button" class="news-pop-x" aria-label="Close">×</button><h4 id="newsPopTitle">Get the newsletter</h4><p>Retail data takes and real CPG stories, straight from me.</p><form name="newsletter" method="POST" action="/" class="news-form"><input type="hidden" name="form-name" value="newsletter"><p style="display:none"><label>Company <input name="company" tabindex="-1" autocomplete="off"></label></p><input type="email" name="email" placeholder="you@email.com" aria-label="Email address" autocomplete="email" required><button type="submit" class="pill tomato">Subscribe</button><p class="news-consent">By submitting your email address, you agree to receive our newsletter and other marketing communications from Fathom CPG. You may unsubscribe at any time. See our <a href="/privacy/">Privacy Policy</a> and <a href="/terms/">Terms of Use</a> for more information.</p><p class="news-msg" role="status" aria-live="polite"></p></form></div>';
      document.body.appendChild(el);
      function close(){newsDone();el.remove();document.removeEventListener('keydown',key);if(prev&&prev.focus)prev.focus()}
      function key(e){if(e.key==='Escape')close()}
      document.addEventListener('keydown',key);
      el.addEventListener('click',function(e){if(e.target===el)close()});
      el.querySelector('.news-pop-x').addEventListener('click',close);
      bindNews(el.querySelector('form'),function(){setTimeout(function(){if(el.parentNode)close()},2500)});
      el.querySelector('input[type=email]').focus();
      return true;
    }
    var tick=setInterval(function(){
      if(document.hidden)return;
      secs++;
      if(secs%5===0){try{localStorage.setItem(KEY,secs)}catch(e){}}
      if(secs>=POPUP_AFTER&&open())clearInterval(tick);
    },1000);
  })();

  var t=document.getElementById('testi');
  if(t){var sl=[].slice.call(t.querySelectorAll('.slide')),ci=0;
    t.querySelectorAll('.nav button').forEach(function(b){b.addEventListener('click',function(){sl[ci].classList.remove('on');ci=(ci+(+b.dataset.t)+sl.length)%sl.length;sl[ci].classList.add('on')})})}
})();
