// v6: retire the old cache-first shell so returning customers receive updates.
self.addEventListener('install',()=>self.skipWaiting());
self.addEventListener('activate',event=>event.waitUntil((async()=>{
  for(const key of await caches.keys()) if(key.startsWith('eman-poppo-')) await caches.delete(key);
  await self.clients.claim();
})()));
// Normal browser networking handles requests. No financial or account data is cached.
