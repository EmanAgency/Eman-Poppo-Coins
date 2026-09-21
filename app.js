const packages=[];
for(let i=1;i<=80;i++)packages.push({coins:21000+(i-1)*14000,price:20+(i-1)*14});
const $=x=>document.getElementById(x), pkg=$('pkg');
packages.forEach((p,i)=>{
  let o=document.createElement('option');
  o.value=i;
  const usd=(p.price/7).toFixed(2);
  o.textContent=`${p.coins.toLocaleString()} coins — TT$${p.price.toLocaleString()} / US$${usd} USDT`;
  pkg.appendChild(o);
});
function update(){
  let p=packages[+pkg.value];
  const usd=(p.price/7).toFixed(2);
  $('coins').textContent=p.coins.toLocaleString();
  $('price').textContent=`TT$${p.price.toLocaleString()} / US$${usd} USDT`;
}
pkg.onchange=update; update();

const paymentInfo={
  'USDT — BEP20 (BNB Smart Chain)':{
    title:'USDT — BNB Smart Chain (BEP20)',
    network:'BNB Smart Chain (BEP20)',
    address:'0xec05bb37867f5e75a706a1face5304fd40a8f54c',
    qr:'usdt-bep20-qr.png',
    hint:'Send USDT using the BNB Smart Chain (BEP20) network only.'
  },
  'USDT — TRC20 (Tron)':{
    title:'USDT — Tron (TRC20)',
    network:'Tron (TRC20)',
    address:'TXcywV3CTM9ZdXAQRcBMWVtaM4TfM2GGzU',
    qr:'usdt-trc20-qr.png',
    hint:'Send USDT using the Tron (TRC20) network only.'
  },
  'USDT — ERC20 (Ethereum)':{
    title:'USDT — Ethereum (ERC20)',
    network:'Ethereum (ERC20)',
    address:'0xec05bb37867f5e75a706a1face5304fd40a8f54c',
    qr:'usdt-erc20-qr.png',
    hint:'Send USDT using the Ethereum (ERC20) network only.'
  }
};

function updatePayment(){
  const selected = $('pay').value;

  let info;

  if(selected === 'USDT — BEP20 (BNB Smart Chain)'){
    info = {
      title:'USDT — BNB Smart Chain (BEP20)',
      network:'BNB Smart Chain (BEP20)',
      address:'0xec05bb37867f5e75a706a1face5304fd40a8f54c',
      qr:'usdt-bep20-qr.png',
      hint:'Send USDT using the BNB Smart Chain (BEP20) network only.'
    };
  }

  else if(selected === 'USDT — TRC20 (Tron)'){
    info = {
      title:'USDT — Tron (TRC20)',
      network:'Tron (TRC20)',
      address:'TXcywV3CTM9ZdXAQRcBMWVtaM4TfM2GGzU',
      qr:'usdt-trc20-qr.png',
      hint:'Send USDT using the Tron (TRC20) network only.'
    };
  }

  else if(selected === 'USDT — ERC20 (Ethereum)'){
    info = {
      title:'USDT — Ethereum (ERC20)',
      network:'Ethereum (ERC20)',
      address:'0xec05bb37867f5e75a706a1face5304fd40a8f54c',
      qr:'usdt-erc20-qr.png',
      hint:'Send USDT using the Ethereum (ERC20) network only.'
    };
  }

  if(!info) return;

  $('paymentTitle').textContent = info.title;
  $('paymentNetwork').textContent = info.network;
  $('walletAddress').textContent = info.address;
  $('paymentHint').textContent = info.hint;

  $('paymentQr').src = info.qr;
  $('paymentQr').alt = info.title + ' wallet QR code';

  $('qrBox').classList.remove('hidden');
}
document.querySelectorAll('nav button').forEach(b=>b.onclick=()=>{
  document.querySelectorAll('nav button').forEach(x=>x.classList.remove('active'));
  document.querySelectorAll('.page').forEach(x=>x.classList.remove('active'));
  b.classList.add('active'); $(b.dataset.p).classList.add('active');
});

function showResult(html){$('result').classList.remove('hidden');$('result').innerHTML=html}

$('submit').onclick=async()=>{
  if(!window.EMAN_SUPABASE_URL || !window.EMAN_SUPABASE_ANON_KEY){
    return showResult('<b>Setup needed.</b><br>The secure order system has not been connected yet. Please add your Supabase URL and anon key to <b>config.js</b>.');
  }
  const name=$('name').value.trim(), pid=$('pid').value.trim(), file=$('receipt').files[0], p=packages[+pkg.value], payment=$('pay').value;
  if(!name||!pid) return alert('Please enter your name and Poppo Live ID.');
  if(!file) return alert('Please select your payment receipt.');
  if(file.size>5*1024*1024) return alert('Receipt must be 5 MB or smaller.');

  const btn=$('submit'); btn.disabled=true; btn.textContent='Submitting...';
  try{
    const client=supabase.createClient(window.EMAN_SUPABASE_URL,window.EMAN_SUPABASE_ANON_KEY);
    const orderNo='EMN-'+Math.floor(100000+Math.random()*900000);
    const ext=(file.name.split('.').pop()||'jpg').toLowerCase().replace(/[^a-z0-9]/g,'');
    const path=`${orderNo}.${ext}`;

    const upload=await client.storage.from('receipts').upload(path,file,{upsert:false,contentType:file.type||'application/octet-stream'});
    if(upload.error) throw upload.error;

    const insert=await client.from('orders').insert({
      order_number:orderNo,name,poppo_id:pid,coins:p.coins,price_ttd:p.price,
      payment_method:payment,receipt_path:path,status:'Pending'
    });
    if(insert.error) throw insert.error;

    localStorage.setItem('lastEmanOrder',orderNo);
    showResult(`<b>Order submitted successfully! 🎉</b><br><br>Order #: <b>${orderNo}</b><br>${p.coins.toLocaleString()} coins — TT$${p.price.toLocaleString()}<br>Payment: ${payment}<br>Status: <b>Pending</b><br><br>Please save your order number. You can use <b>My Orders</b> to check the status.`);
    $('name').value=''; $('pid').value=''; $('receipt').value='';
  }catch(e){
    console.error(e);
    showResult('<b>Submission error:</b><br>' + (e.message || String(e)).replace(/</g,'&lt;').replace(/>/g,'&gt;'));
  }finally{btn.disabled=false;btn.textContent='Submit Order'}
};

async function getOrder(no){
  if(!window.EMAN_SUPABASE_URL || !window.EMAN_SUPABASE_ANON_KEY) throw new Error('Not connected');
  const client=supabase.createClient(window.EMAN_SUPABASE_URL,window.EMAN_SUPABASE_ANON_KEY);
  const r=await client.rpc('lookup_order',{p_order_number:no});
  if(r.error) throw r.error;
  return Array.isArray(r.data) ? r.data[0] : r.data;
}

function showOrderNotification(status, orderNo){
  const box=$('orderNotice');
  if(!box)return;
  if(status==='Completed'){
    box.innerHTML=`🔔 <b>Order ${orderNo} completed!</b><br>Your Poppo coins have been sent successfully to your Poppo Live ID. Thank you for your purchase!`;
  }else if(status==='Rejected'){
    box.innerHTML=`⚠️ <b>Order ${orderNo} was rejected.</b><br>Please contact Eman Agency on WhatsApp for assistance.`;
  }else if(status==='Processing'){
    box.innerHTML=`🔔 <b>Order ${orderNo} is being processed.</b><br>We are preparing your Poppo coin top-up.`;
  }else if(status==='Paid'){
    box.innerHTML=`🔔 <b>Payment confirmed for ${orderNo}.</b><br>Your order is ready for processing.`;
  }else return;
  box.classList.remove('hidden');
  try{
    if('Notification' in window && Notification.permission==='granted'){
      new Notification('Eman Agency — Order Update',{body:box.textContent.replace(/\s+/g,' ').trim()});
    }
  }catch(e){}
}

async function checkOrder(no,silent=false){
  const row=await getOrder(no);
  const box=$('lookupResult');
  if(!row){
    if(!silent) box.innerHTML='<b>Order not found.</b><br>Check the order number and try again.';
    return null;
  }
  box.classList.remove('hidden');
  box.innerHTML=`<b>Order ${row.order_number}</b><br>${Number(row.coins).toLocaleString()} coins — TT$${Number(row.price_ttd).toLocaleString()}<br>Payment: ${row.payment_method}<br>Status: <b>${row.status}</b>`;

  const key='emanStatus_'+row.order_number;
  const previous=localStorage.getItem(key);
  if(previous && previous!==row.status) showOrderNotification(row.status,row.order_number);
  localStorage.setItem(key,row.status);
  localStorage.setItem('lastEmanOrder',row.order_number);
  return row;
}

$('lookupBtn').onclick=async()=>{
  const no=$('lookup').value.trim().toUpperCase();
  const box=$('lookupResult'); box.classList.remove('hidden');
  if(!no) return box.innerHTML='Please enter an order number.';
  try{
    await checkOrder(no,false);
    if('Notification' in window && Notification.permission==='default'){
      try{ await Notification.requestPermission(); }catch(e){}
    }
  }catch(e){box.innerHTML='Unable to check the order right now. Please try again.'}
};

let orderMonitor=null;
function startOrderMonitor(){
  const last=localStorage.getItem('lastEmanOrder');
  if(!last || orderMonitor) return;
  orderMonitor=setInterval(async()=>{
    try{
      const row=await checkOrder(last,true);
      if(row && (row.status==='Completed' || row.status==='Rejected')){
        // Keep checking so the customer can revisit the status, but avoid unnecessary rapid requests.
      }
    }catch(e){}
  },10000);
}
startOrderMonitor();

function copyWallet(){
  const address=$('walletAddress').textContent.trim();
  navigator.clipboard?.writeText(address)
    .then(()=>alert('Wallet address copied.'))
    .catch(()=>alert('Wallet address: '+address));
}

/* Eman Poppo Coins And Points — PWA Install */
let deferredInstallPrompt = null;
const installAppButton = document.getElementById('installApp');

window.addEventListener('beforeinstallprompt', event => {
  event.preventDefault();
  deferredInstallPrompt = event;

  if (installAppButton) {
    installAppButton.classList.remove('hidden');
  }
});

installAppButton?.addEventListener('click', async () => {
  if (!deferredInstallPrompt) {
    alert('To install Eman Poppo: tap Chrome ⋮ menu, then choose Add to Home screen or Install app.');
    return;
  }

  deferredInstallPrompt.prompt();
  await deferredInstallPrompt.userChoice;

  deferredInstallPrompt = null;
  installAppButton.classList.add('hidden');
});

window.addEventListener('appinstalled', () => {
  deferredInstallPrompt = null;

  if (installAppButton) {
    installAppButton.classList.add('hidden');
  }
});

/* Register service worker */
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch(error => {
      console.error('Service worker registration failed:', error);
    });
  });
}

$('bankTransferBtn')?.addEventListener('click',()=>{
  alert('Contact Us\n\nPlease contact Eman Agency on WhatsApp for bank transfer details.');
});
