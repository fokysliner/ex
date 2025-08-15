function splitChars(el){
  if(!el || el.dataset.splitReady) return;
  el.dataset.splitReady = '1';
  const t = el.textContent; el.textContent = '';
  [...t].forEach((ch,i)=>{
    const s=document.createElement('span');
    s.className='char'; s.textContent=ch;
    s.style.animationDelay=(i*0.03)+'s';
    el.appendChild(s);
  });
  requestAnimationFrame(()=> el.querySelectorAll('.char').forEach(c=>c.classList.add('revealed')));
}
function splitWords(el){
  if(!el || el.dataset.splitReady) return;
  el.dataset.splitReady = '1';
  const words = el.textContent.split(' ');
  el.innerHTML = words.map(w=>`<span class="word" style="display:inline-block; transform:translateY(14px); opacity:0; transition:all .5s ease">${w}&nbsp;</span>`).join('');
  requestAnimationFrame(()=> el.querySelectorAll('.word').forEach((w,i)=>{
    w.style.transitionDelay=(i*0.04)+'s';
    w.style.opacity=1; w.style.transform='none';
  }));
}

const preloader = document.getElementById('preloader');
let ready = false;
function done(){
  if(ready) return; ready = true;
  preloader?.classList.add('hide');
  splitChars(document.querySelector('[data-fx="chars"]'));
  splitWords(document.querySelector('[data-fx="words"]'));
  buildTicker();
}
window.addEventListener('load', ()=> setTimeout(done, 500));
document.addEventListener('DOMContentLoaded', ()=> setTimeout(done, 900));
setTimeout(done, 4000); // парашут

(() => {
  const btn = document.querySelector('.cta');
  if(!btn) return;
  btn.addEventListener('pointermove', e=>{
    const r = btn.getBoundingClientRect();
    const x = (e.clientX - r.left - r.width/2)/r.width;
    const y = (e.clientY - r.top - r.height/2)/r.height;
    btn.style.transform = `translate(${x*8}px, ${y*6}px)`;
  });
  btn.addEventListener('pointerleave', ()=> btn.style.transform='translate(0,0)');
})();

function buildTicker(){
  const data = [
    {pair:'BTC/USDT', px:'121 576.5504', dir:'down'},
    {pair:'ETH/USDT', px:'4 726.0324', dir:'up'},

  ];
  const track = document.getElementById('tickerTrack');
  if(!track) return;

  function renderOnce(){
    return data.map(d => 
      `<span class="tick"><b>${d.pair}</b> ${d.px} <span class="ind ${d.dir}">${d.dir==='up'?'▲':'▼'}</span></span>`
    ).join(' • ');
  }
  track.innerHTML = renderOnce() + ' • ' + renderOnce();
}

const yEl = document.getElementById('year');
if (yEl) yEl.textContent = new Date().getFullYear();

(function setupLeadTrigger(){
  const btn = document.getElementById('tgBtn');
  if (!btn) return;

  btn.addEventListener('click', () => {
    const payload = {
      event: 'tg_lead',              // назва події для GTM
      cta_id: 'tgBtn',
      placement: btn.dataset.placement || 'unknown',
      href: btn.href,
      page: location.pathname + location.search,
      ts: new Date().toISOString(),
      ua: navigator.userAgent
    };

    try {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push(payload);
    } catch (e) {}

    if (typeof window.gtag === 'function') {
      window.gtag('event', 'generate_lead', {
        method: 'telegram_cta',
        value: 1
      });
    }

   
  });
})();
