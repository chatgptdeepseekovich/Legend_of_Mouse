/* офлайн: оболочка сайта из кэша; части игры кладёт в кэш сам загрузчик */
const SH='lom-shell-1791994302',FILES=['./','index.html','manifest.json','icon-180.png','icon-512.png'];
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(SH).then(c=>c.addAll(FILES)).catch(()=>{}))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k.startsWith('lom-shell-')&&k!==SH).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET')return;
 if(r.mode==='navigate'){
  e.respondWith(Promise.race([fetch(r).then(res=>{const cp=res.clone();caches.open(SH).then(c=>c.put('index.html',cp));return res}),
   new Promise((_,rej)=>setTimeout(rej,6000))]).catch(()=>caches.match('index.html',{ignoreSearch:true}).then(m=>m||fetch(r))));return}
 e.respondWith(caches.match(r,{ignoreSearch:false}).then(m=>m||caches.match(r,{ignoreSearch:true})).then(m=>m||fetch(r)))});
