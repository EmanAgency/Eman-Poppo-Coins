const $=x=>document.getElementById(x);
const client=(window.EMAN_SUPABASE_URL&&window.EMAN_SUPABASE_ANON_KEY&&window.EMAN_SUPABASE_URL.startsWith('http'))
 ? supabase.createClient(window.EMAN_SUPABASE_URL,window.EMAN_SUPABASE_ANON_KEY):null;

$('login').onclick=async()=>{
 if(!client)return $('loginMsg').classList.remove('hidden'),$('loginMsg').innerHTML='Add your Supabase URL and anon key to config.js first.';
 const email=$('email').value.trim(), password=$('password').value;
 const r=await client.auth.signInWithPassword({email,password});
 if(r.error){$('loginMsg').classList.remove('hidden');$('loginMsg').textContent=r.error.message;return}
 $('loginMsg').classList.add('hidden'); $('dashboard').classList.remove('hidden'); loadOrders();
};

$('logout').onclick=async()=>{await client.auth.signOut();$('dashboard').classList.add('hidden')};

async function loadOrders(){
 const r=await client.from('orders').select('*').order('created_at',{ascending:false});
 if(r.error){$('orders').innerHTML='<p>Could not load orders.</p>';return}
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
