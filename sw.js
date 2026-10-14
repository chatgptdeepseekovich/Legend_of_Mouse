/* офлайн: оболочка сайта из кэша; части игры кладёт в кэш сам загрузчик */
const SH='lom-shell-1792010227',FILES=['./','index.html','manifest.json','icon-180.png','icon-512.png'];
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(SH).then(c=>c.addAll(FILES)).catch(()=>{}))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k.startsWith('lom-shell-')&&k!==SH).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET')return;
 const u=new URL(r.url);
 /* навигация только на саму игру: страница из сети, без сети — из кэша. Любые другие файлы (иконка и т.п.) — как есть */
 if(r.mode==='navigate'){
  if(!/\/$|\/index\.html$/.test(u.pathname))return;
  e.respondWith(Promise.race([fetch(r.url,{cache:'no-store',credentials:'same-origin'}).then(res=>{if(res.ok&&(res.headers.get('content-type')||'').includes('text/html')){const cp=res.clone();caches.open(SH).then(c=>c.put('index.html',cp))}return res}),
   new Promise((_,rej)=>setTimeout(rej,8000))]).catch(()=>caches.match('index.html',{ignoreSearch:true}).then(m=>m||fetch(r))));return}
 if(!/\.(js|png|json)$/.test(u.pathname))return;
 /* части игры (?h=…) кэширует сам загрузчик по метке версии; здесь их не трогаем, иначе можно отдать старую копию */
 if(u.search.includes('h='))return;
 e.respondWith(caches.match(r,{ignoreSearch:false}).then(m=>m||caches.match(r,{ignoreSearch:true})).then(m=>m||fetch(r)))});
