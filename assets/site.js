(() => {
  'use strict';
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const revealTargets = document.querySelectorAll('.project-row, .approach-grid article, .certificate-card, .trajectory-preview, .research-grid article, .metrics, .sport-figure');
  if ('IntersectionObserver' in window && !reducedMotion.matches) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {entry.target.classList.add('is-visible'); observer.unobserve(entry.target);}
      });
    }, {threshold: 0.08});
    revealTargets.forEach((target, i) => {target.classList.add('reveal'); target.style.setProperty('--reveal-delay', `${i % 3 * 65}ms`); observer.observe(target);});
    reducedMotion.addEventListener('change', e => {if(e.matches) {revealTargets.forEach(t => t.classList.add('is-visible')); observer.disconnect();}});
  }
  const progress = document.createElement('div');
  progress.className = 'reading-progress'; progress.setAttribute('aria-hidden', 'true'); document.body.append(progress);
  let scheduled = false;
  const updateProgress = () => {
    const total = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.transform = `scaleX(${total > 0 ? Math.min(1, window.scrollY / total) : 0})`;
    scheduled = false;
  };
  window.addEventListener('scroll', () => {if(!scheduled) {scheduled=true; window.requestAnimationFrame(updateProgress);}}, {passive:true});
  window.addEventListener('resize', updateProgress); updateProgress();
  const certificateSearch = document.querySelector('#certificate-search');
  if (certificateSearch) {
    const normalize = s => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
    certificateSearch.addEventListener('input', () => {
      const query = normalize(certificateSearch.value.trim()); let count = 0;
      document.querySelectorAll('.certificate-card').forEach(card => {
        card.hidden = !normalize(card.textContent).includes(query);
        if(!card.hidden) {count++; card.classList.add('is-visible');}
      });
      document.querySelector('#certificate-status').textContent = `${count} certificados encontrados`;
    });
  }
  const menu = document.querySelector('.menu-toggle');
  const nav = document.querySelector('#site-nav');
  if (menu && nav) {
    const close = () => {menu.setAttribute('aria-expanded', 'false'); nav.classList.remove('is-open');};
    menu.addEventListener('click', () => {const open = menu.getAttribute('aria-expanded') !== 'true'; menu.setAttribute('aria-expanded', String(open)); nav.classList.toggle('is-open', open);});
    nav.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
    document.addEventListener('keydown', e => {if(e.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') {close(); menu.focus();}});
  }
  document.querySelectorAll('.filter').forEach(button => button.addEventListener('click', () => {
    document.querySelectorAll('.filter').forEach(b => b.setAttribute('aria-pressed', String(b === button)));
    let count = 0;
    document.querySelectorAll('.project-row').forEach(row => {row.hidden = button.dataset.filter !== 'all' && !row.dataset.category.split(' ').includes(button.dataset.filter); if (!row.hidden) {count++; row.classList.add('is-visible');}});
    document.querySelector('#filter-status').textContent = `${count} proyectos visibles`;
  }));
  // P(X <= c) for X ~ Binomial(n,p), calculated directly by recurrence.
  function acceptance(n, c, p) {
    if(p === 0) return 1; if(p === 1) return c >= n ? 1 : 0;
    let term = Math.pow(1-p,n), sum = term;
    for(let k=1;k<=Math.min(c,n);k++){term *= (n-k+1)/k*p/(1-p); sum += term;}
    return Math.max(0, Math.min(1, sum));
  }
  document.querySelectorAll('[data-sampling-lab]').forEach(lab => {
    const nInput=lab.querySelector('[data-n]'), cInput=lab.querySelector('[data-c]');
    const render = () => {
      const n=Number(nInput.value), c=Number(cInput.value);
      lab.querySelector('[data-n-label]').textContent=n;
      lab.querySelector('[data-c-label]').textContent=c;
      const points=Array.from({length:121},(_,i)=>{const p=i/120*.15;return [45+p/.15*370,200-acceptance(n,c,p)*170];});
      const path=points.map((pt,i)=>`${i?'L':'M'}${pt[0].toFixed(2)},${pt[1].toFixed(2)}`).join(' ');
      lab.querySelector('[data-curve]').setAttribute('d',path);
      lab.querySelector('[data-area]').setAttribute('d',`${path} L415,200 L45,200 Z`);
      const pa=acceptance(n,c,.05);
      lab.querySelector('[data-prob]').textContent=`${(pa*100).toFixed(1).replace('.',',')} %`;
      lab.querySelector('[data-marker]').setAttribute('cy',200-pa*170);
      lab.querySelector('svg').setAttribute('aria-label',`Curva binomial para n=${n}, Ac=${c}. Con 5 % de unidades no conformes, la probabilidad de aceptar es ${(pa*100).toFixed(1)} %.`);
    };
    nInput.addEventListener('input',render);cInput.addEventListener('input',render);render();
  });
})();
