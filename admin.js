const $=x=>document.getElementById(x);
const client=(window.EMAN_SUPABASE_URL&&window.EMAN_SUPABASE_ANON_KEY&&window.EMAN_SUPABASE_URL.startsWith('http'))
 ? supabase.createClient(window.EMAN_SUPABASE_URL,window.EMAN_SUPABASE_ANON_KEY,{
     auth:{
       storage:window.sessionStorage,
       persistSession:true,
       autoRefreshToken:true,
       detectSessionInUrl:false
     }
   }):null;

$('login').onclick=async()=>{
 if(!client){
   $('loginMsg').classList.remove('hidden');
   $('loginMsg').innerHTML='Add your Supabase URL and anon key to config.js first.';
   return;
 }

 const email=$('email').value.trim();
 const password=$('password').value;

 const r=await client.auth.signInWithPassword({email,password});

 if(r.error){
   $('loginMsg').classList.remove('hidden');
   $('loginMsg').textContent=r.error.message;
   return;
 }

 $('loginScreen').classList.add('hidden');
 $('dashboard').classList.remove('hidden');
 $('dashboard').classList.add('fullscreen');
 document.body.classList.add('admin-logged-in');

 loadOrders();
};

$('logout').onclick=async()=>{await client.auth.signOut();$('dashboard').classList.add('hidden')};

async function loadOrders(){
 const r=await client.from('orders').select('*').order('created_at',{ascending:false});
 if(r.error){console.error(r.error);$('orders').innerHTML='<p><b>Could not load orders.</b><br>'+escapeHtml(r.error.message||String(r.error))+'</p>';return}
 $('orders').innerHTML=r.data.length?r.data.map(o=>`
 <div class="order">
 <b>${o.order_number}</b> — <span>${o.status}</span><br>
 Customer: ${escapeHtml(o.name)}<br>Poppo ID: ${escapeHtml(o.poppo_id)}<br>
 ${Number(o.coins).toLocaleString()} coins — TT$${Number(o.price_ttd).toLocaleString()}<br>
 Payment: ${escapeHtml(o.payment_method)}<br>
 <small>${new Date(o.created_at).toLocaleString()}</small><br>
 <button class="copy" onclick="viewReceipt('${o.receipt_path}')">View Receipt</button>
 <select onchange="changeStatus('${o.id}',this.value)" style="margin-top:8px;width:100%;padding:10px;border-radius:10px">
 <option ${o.status==='Pending'?'selected':''}>Pending</option>
 <option ${o.status==='Paid'?'selected':''}>Paid</option>
 <option ${o.status==='Processing'?'selected':''}>Processing</option>
 <option ${o.status==='Completed'?'selected':''}>Completed</option>
 <option ${o.status==='Rejected'?'selected':''}>Rejected</option>
 </select>
 </div>`).join(''):'<p>No orders yet.</p>';
}
async function viewReceipt(path){
 const r=await client.storage.from('receipts').createSignedUrl(path,300);
 if(r.error)return alert('Could not open receipt.');
 window.open(r.data.signedUrl,'_blank');
}
async function changeStatus(id,status){
 const r=await client.from('orders').update({status}).eq('id',id);
 if(r.error)alert('Could not update status.'); else loadOrders();
}
function escapeHtml(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}

function showAdminNotification(message){
 const box=$('adminNotice');
 if(!box)return;
 box.classList.remove('hidden');
 box.innerHTML=message;
 box.style.cssText='padding:14px;margin:12px 0;border-radius:12px;background:#171021;border:1px solid #8B5CF6;font-weight:600;';
}

let knownOrderIds=new Set();

async function checkForNewOrders(){
 if(!client)return;
 const r=await client.from('orders').select('id,order_number,name,coins,price_ttd,status,created_at').order('created_at',{ascending:false}).limit(20);
 if(r.error)return;

 if(knownOrderIds.size===0){
   r.data.forEach(o=>knownOrderIds.add(o.id));
   return;
 }

 r.data.forEach(o=>{
   if(!knownOrderIds.has(o.id)){
     knownOrderIds.add(o.id);
     showAdminNotification(
       `🔔 <b>New Order Received!</b><br><br>
        Order #: <b>${escapeHtml(o.order_number)}</b><br>
        Customer: ${escapeHtml(o.name)}<br>
        Poppo ID: ${escapeHtml(o.poppo_id || '')}<br>
        ${Number(o.coins).toLocaleString()} coins — TT$${Number(o.price_ttd).toLocaleString()}<br>
        Status: <b>${escapeHtml(o.status)}</b>`
     );

     try{
       if('Notification' in window && Notification.permission==='granted'){
         new Notification('Eman Poppo Coins — New Order',{
           body:`${o.order_number} — ${Number(o.coins).toLocaleString()} coins — TT$${Number(o.price_ttd).toLocaleString()}`
         });
       }
     }catch(e){}
   }
 });
}

setInterval(checkForNewOrders,10000);
