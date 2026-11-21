const C='veg-shell-v1';
self.addEventListener('install',()=>self.skipWaiting());
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{
  const r=e.request; if(r.method!=='GET') return;
  const u=new URL(r.url); if(u.origin!==location.origin||u.pathname.endsWith('.apk')) return;
  // الشبكة أولاً دائماً: العميل يشوف آخر تعديل، والكاش للعمل بدون إنترنت فقط
  e.respondWith(fetch(r.mode==='navigate'?r.url:r,{cache:'no-cache'}).then(res=>{
    if(res.ok){const cp=res.clone();caches.open(C).then(c=>c.put(r,cp))}
    return res;
  }).catch(()=>caches.match(r).then(m=>m||caches.match('./'))));
});
