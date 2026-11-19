'use strict';
function emanQuote(coins) {
  if (!Number.isSafeInteger(coins) || coins < 1000 || coins > 7000000) return null;
  return (coins / 7000).toFixed(2);
}
function glowPackage(index) {
  if (!Number.isInteger(index) || index < 1 || index > 80) return null;
  return {coins: 70000 * index, ttd: 8 * index};
}
if (typeof module !== 'undefined') module.exports = {emanQuote, glowPackage};
if (typeof document !== 'undefined') {
  const el = id => document.getElementById(id);
  for(let i=1;i<=80;i++) {
    const p=glowPackage(i), option=document.createElement('option');
    option.value=i; option.textContent=`${p.coins.toLocaleString()} coins — TT$${p.ttd}`;
    el('glow-package').appendChild(option);
  }
  function updateGlow() {
    const p=glowPackage(Number(el('glow-package').value));
    el('glow-coins').textContent=p.coins.toLocaleString();
    el('glow-price').textContent=`TT$${p.ttd.toFixed(2)}`;
    el('glow-order').href='https://wa.me/18683876714?text='+encodeURIComponent(`Glow Live coin order\nGlow ID: ${el('glow-id').value.trim() || '(please confirm)'}\nCoins: ${p.coins}\nPrice: TT$${p.ttd.toFixed(2)}\nPlease confirm payment and delivery details.`);
  }
  function updateEman() {
    const coins=Number(el('eman-amount').value), quote=emanQuote(coins);
    el('eman-price').textContent=quote===null?'Enter 1,000–7,000,000 whole coins':`${quote} USDT`;
    el('eman-coins').textContent=quote===null?'—':coins.toLocaleString();
    const a=el('eman-order'); a.setAttribute('aria-disabled',String(quote===null));
    if(quote===null) a.removeAttribute('href');
    else a.href='https://wa.me/18683876714?text='+encodeURIComponent(`Eman Live coin order\nEman ID: ${el('eman-id').value.trim() || '(please confirm)'}\nCoins: ${coins}\nPrice: ${quote} USDT\nPlease confirm payment and delivery details.`);
  }
  el('glow-package').addEventListener('change',updateGlow);el('glow-id').addEventListener('input',updateGlow);
  el('eman-amount').max='7000000';el('eman-amount').addEventListener('input',updateEman);el('eman-id').addEventListener('input',updateEman);
  document.querySelectorAll('[data-coins]').forEach(b=>b.addEventListener('click',()=>{el('eman-amount').value=b.dataset.coins;updateEman();}));
  updateGlow();updateEman();
}
