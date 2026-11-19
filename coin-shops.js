'use strict';
function emanQuote(coins){const usd=CoinPricing.usd('eman',coins);return usd===null?null:usd.toFixed(2);}
function glowPackage(index){return Number.isInteger(index)&&index>=1&&index<=80?{coins:70000*index,ttd:8*index}:null;}
if(typeof document!=='undefined'){
 const el=id=>document.getElementById(id);
 for(let i=1;i<=80;i++){
  const p=glowPackage(i),option=document.createElement('option');option.value=i;
  option.textContent=`${p.coins.toLocaleString()} coins — US$${CoinPricing.usd('glow',i).toFixed(2)} USD`;el('glow-package').appendChild(option);
 }
 function update(app){
  const amount=Number(el(app==='glow'?'glow-package':`${app}-amount`).value);
  const usd=CoinPricing.usd(app,amount);
  const coins=app==='glow'?glowPackage(amount)?.coins:amount;
  const currency=el(`${app}-currency`).value;
  el(`${app}-price`).textContent=usd===null?'Enter 1,000–7,000,000 whole coins':`US$${usd.toFixed(2)} USD`;
  el(`${app}-coins`).textContent=usd===null?'—':coins.toLocaleString();
  el(`${app}-due`).textContent=CoinPricing.display(usd,currency);
  const a=el(`${app}-order`);a.setAttribute('aria-disabled',String(usd===null));
  if(usd===null){a.removeAttribute('href');return;}
  const label={glow:'Glow Live',eman:'Eman Live',comet:'Comet Live'}[app];
  a.href='https://wa.me/18683876714?text='+encodeURIComponent(`${label} coin order\n${label} ID: ${el(`${app}-id`).value.trim()||'(please confirm)'}\nCoins: ${coins}\nPrice: US$${usd.toFixed(2)} USD\nPay in: ${currency==='CRYPTO'?'Crypto (USDT)':currency}\nAmount to pay: ${CoinPricing.display(usd,currency)}\nShop rate: US$1 = TT$7; 1 USDT quoted per US$1.\nPlease confirm payment details and the USDT network, if applicable, before I pay.`);
 }
 for(const app of ['glow','eman','comet']){
  const input=el(app==='glow'?'glow-package':`${app}-amount`);
  input.addEventListener('input',()=>update(app));input.addEventListener('change',()=>update(app));
  el(`${app}-currency`).addEventListener('change',()=>update(app));el(`${app}-id`).addEventListener('input',()=>update(app));
  if(app!=='glow'){
   input.max='7000000';
   el(`${app}-panel`).querySelectorAll('[data-coins]').forEach(b=>b.addEventListener('click',()=>{input.value=b.dataset.coins;update(app);}));
  }
  update(app);
 }
}
