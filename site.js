(()=>{
  const root=document.documentElement;
  root.classList.add('has-js');
  const toggle=document.querySelector('.site-menu-toggle');
  const menu=document.querySelector('.site-nav');
  const closeMenu=()=>{
    if(!toggle||!menu)return;
    toggle.setAttribute('aria-expanded','false');
    menu.classList.remove('is-open');
  };
  if(toggle&&menu){
    toggle.addEventListener('click',()=>{
      const opening=toggle.getAttribute('aria-expanded')!=='true';
      toggle.setAttribute('aria-expanded',String(opening));
      menu.classList.toggle('is-open',opening);
    });
    menu.querySelectorAll('a').forEach(link=>link.addEventListener('click',closeMenu));
    document.addEventListener('keydown',event=>{
      if(event.key==='Escape'&&toggle.getAttribute('aria-expanded')==='true'){
        closeMenu();toggle.focus();
      }
    });
    document.addEventListener('click',event=>{
      if(toggle.getAttribute('aria-expanded')==='true'&&!menu.contains(event.target)&&!toggle.contains(event.target))closeMenu();
    });
  }
  const motionPreference=window.matchMedia('(prefers-reduced-motion: reduce)');
  let userReduced=false;
  try{userReduced=sessionStorage.getItem('bon-reduced-motion')==='true';}catch{}
  let reduce=motionPreference.matches||userReduced;
  const revealItems=[...document.querySelectorAll('.portfolio-page .reveal')];
  if(!reduce&&'IntersectionObserver' in window){
    const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
      if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target);}
    }),{rootMargin:'0px 0px -40px 0px',threshold:.05});
    revealItems.forEach(item=>observer.observe(item));
    root.classList.add('motion-ready');
  }else revealItems.forEach(item=>item.classList.add('is-visible'));
  const home=document.querySelector('.overview-page');
  const hero=home?.querySelector('.overview-hero');
  const stage=home?.querySelector('.overview-stage');
  const panel=home?.querySelector('.overview-panel');
  const motionToggle=home?.querySelector('.overview-motion-toggle');
  const fields=home?.querySelector('.overview-fields');
  const fieldGrid=fields?.querySelector('.field-grid');
  const cards=[...home?.querySelectorAll('.field-card')||[]];
  const proof=home?.querySelector('.proof-strip');
  const route=home?.querySelector('.overview-route');
  const routePath=route?.querySelector('.overview-route-ink');
  const routeDot=route?.querySelector('.overview-route-dot');
  const bridge=home?.querySelector('.overview-bridge');
  const routeLength=routePath?.getTotalLength()||0;
  const clamp=value=>Math.max(0,Math.min(1,value));
  const settle=value=>1-Math.pow(1-clamp(value),3);
  const set=(element,name,value)=>element.style.setProperty(name,value);
  let ticking=false;
  const scheduleUpdate=()=>{
    if(!ticking){ticking=true;requestAnimationFrame(update);}
  };
  const configureMotion=()=>{
    if(!home)return;
    root.classList.toggle('home-motion',!reduce);
    root.classList.toggle('home-pin',!reduce&&window.innerWidth>760&&window.innerHeight>=780&&panel.offsetHeight+126<=window.innerHeight-70);
    if(motionToggle){
      motionToggle.hidden=false;
      motionToggle.setAttribute('aria-pressed',String(reduce));
      motionToggle.querySelector('span').textContent=reduce?'Motion reduced':'Motion on';
      motionToggle.disabled=motionPreference.matches;
      motionToggle.title=motionPreference.matches?'Following your device’s reduced-motion preference':'';
    }
  };
  const updateHome=()=>{
    if(!home||!hero||!stage||!fields||!fieldGrid||!proof||!route||!bridge)return;
    if(reduce){set(proof,'--proof-progress','1');return;}

    // Read the untransformed containers first so the choreography never measures itself.
    const vh=window.innerHeight;
    const compact=window.innerWidth<=760;
    const heroBox=hero.getBoundingClientRect();
    const stageHeight=stage.offsetHeight;
    const fieldsBox=fields.getBoundingClientRect();
    const gridBox=fieldGrid.getBoundingClientRect();
    const cardTops=cards.map(card=>gridBox.top+card.offsetTop);
    const proofBox=proof.getBoundingClientRect();
    const routeBox=route.getBoundingClientRect();
    const bridgeBox=bridge.getBoundingClientRect();
    const pinned=root.classList.contains('home-pin');
    const heroProgress=clamp((70-heroBox.top)/(pinned?Math.max(1,heroBox.height-stageHeight):heroBox.height*.8));

    if(heroBox.bottom>0&&heroBox.top<vh){
      set(stage,'--hero-progress',heroProgress.toFixed(4));
      set(stage,'--hero-art-x',`${(-32*heroProgress).toFixed(2)}px`);
      set(stage,'--hero-art-y',`${(46*heroProgress).toFixed(2)}px`);
      set(stage,'--hero-art-scale',(1.045+.075*heroProgress).toFixed(4));
      set(stage,'--hero-panel-y',`${(-46*heroProgress).toFixed(2)}px`);
      set(stage,'--hero-panel-scale',(1-.025*heroProgress).toFixed(4));
    }
    set(proof,'--proof-progress',settle((vh*.96-proofBox.top)/(vh*.3)).toFixed(4));

    const titleProgress=settle((vh*.9-fieldsBox.top)/(vh*.28));
    set(fields,'--fields-title-mask',`${((1-titleProgress)*100).toFixed(2)}%`);
    set(fields,'--fields-title-y',`${((1-titleProgress)*22).toFixed(2)}px`);
    cards.forEach((card,index)=>{
      const arrival=settle((vh*.98-cardTops[index]-(compact?0:index*18))/(vh*.38));
      const remaining=1-arrival;
      set(card,'--field-x',`${(compact?0:remaining*(index-1.5)*12).toFixed(2)}px`);
      set(card,'--field-y',`${(remaining*(compact?24:68)).toFixed(2)}px`);
      set(card,'--field-angle',`${(compact?0:remaining*(index-1.5)*1.5).toFixed(3)}deg`);
      set(card,'--field-opacity',(.35+.65*arrival).toFixed(4));
    });

    const routeProgress=clamp((vh*.94-routeBox.top)/(vh*.7));
    set(route,'--route-offset',(1-routeProgress).toFixed(4));
    if(routePath&&routeDot){
      const point=routePath.getPointAtLength(routeLength*Math.max(.028,Math.min(.972,routeProgress)));
      routeDot.style.left=`${point.x/1440*100}%`;
      routeDot.style.top=`${point.y/85*100}%`;
    }
    const bridgeProgress=settle((vh*.92-bridgeBox.top)/(vh*.32));
    set(bridge,'--bridge-title-mask',`${((1-bridgeProgress)*100).toFixed(2)}%`);
    set(bridge,'--bridge-title-x',`${((1-bridgeProgress)*-16).toFixed(2)}px`);
  };
  const update=()=>{
    const max=Math.max(1,document.documentElement.scrollHeight-window.innerHeight);
    root.style.setProperty('--site-progress',String(Math.max(0,Math.min(1,window.scrollY/max))));
    updateHome();
    ticking=false;
  };
  if(home){
    configureMotion();
    if('IntersectionObserver' in window){
      const activeScene=new IntersectionObserver(entries=>entries.forEach(entry=>entry.target.classList.toggle('is-motion-active',entry.isIntersecting)));
      activeScene.observe(stage);
    }
    home.querySelector('img')?.addEventListener('load',()=>{configureMotion();scheduleUpdate();},{once:true});
    document.fonts?.ready.then(()=>{configureMotion();scheduleUpdate();});
    motionToggle?.addEventListener('click',()=>{
      userReduced=!userReduced;
      reduce=motionPreference.matches||userReduced;
      try{sessionStorage.setItem('bon-reduced-motion',String(userReduced));}catch{}
      configureMotion();
      scheduleUpdate();
    });
  }
  motionPreference.addEventListener('change',()=>{
    reduce=motionPreference.matches||userReduced;
    configureMotion();
    scheduleUpdate();
  });
  window.addEventListener('scroll',scheduleUpdate,{passive:true});
  window.addEventListener('resize',()=>{configureMotion();scheduleUpdate();},{passive:true});
  window.addEventListener('pageshow',scheduleUpdate);
  update();
})();
