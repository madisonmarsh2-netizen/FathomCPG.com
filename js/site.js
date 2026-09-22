// Fathom CPG — header, mobile menu, partner form, testimonial slider.
(function(){
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
  fitNav();

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
  next.addEventListener('click',function(){
    if(cur<steps.length-1){show(cur+1);return}
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

  var t=document.getElementById('testi');
  if(t){var sl=[].slice.call(t.querySelectorAll('.slide')),ci=0;
    t.querySelectorAll('.nav button').forEach(function(b){b.addEventListener('click',function(){sl[ci].classList.remove('on');ci=(ci+(+b.dataset.t)+sl.length)%sl.length;sl[ci].classList.add('on')})})}
})();
