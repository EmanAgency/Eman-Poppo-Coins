'use strict';
// Merchant's fixed shop rate, preserved from the existing website. Not a live FX feed.
const CoinPricing = {
 ttdPerUsd: 7,
 usd(app, amount) {
  if (!Number.isSafeInteger(amount)) return null;
  if (app==='eman' || app==='comet') return amount>=1000 && amount<=7000000 ? amount/7000 : null;
  if (amount<1 || amount>80) return null;
  if (app==='poppo') return (20+(amount-1)*14)/7;
  if (app==='glow') return amount*8/7;
  return null;
 },
 due(usd, currency) {
  if (!Number.isFinite(usd) || usd<=0 || !['USD','TTD','CRYPTO'].includes(currency)) return null;
  return (usd * (currency==='TTD'?7:1)).toFixed(2);
 },
 display(usd,currency) {
  const amount=this.due(usd,currency);
  return amount===null ? 'Choose a valid coin amount' : currency==='TTD'?`TT$${amount} TTD`:currency==='CRYPTO'?`${amount} USDT`:`US$${amount} USD`;
 }
};
if(typeof window!=='undefined')window.CoinPricing=CoinPricing;
if(typeof module!=='undefined')module.exports=CoinPricing;
