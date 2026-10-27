/* Dra. Lurdiane Brandão · dados da demonstração (fica só neste navegador) */
window.LB=(function(){
 const K={ap:'lb_ap',block:'lb_block',mine:'lb_mine',me:'lb_me'};
 const get=(k,d)=>{try{const v=JSON.parse(localStorage.getItem(k));return v==null?d:v}catch(e){return d}};
 let bc=null;try{bc=new BroadcastChannel('lbnutri')}catch(e){}
 const set=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}try{bc&&bc.postMessage(k)}catch(e){}};
 const on=fn=>{addEventListener('storage',e=>{if(!e.key||e.key.startsWith('lb_'))fn()});bc&&bc.addEventListener('message',()=>fn())};
 const pad=n=>String(n).padStart(2,'0');
 const iso=d=>d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate());
 const today=()=>new Intl.DateTimeFormat('en-CA',{timeZone:'America/Sao_Paulo'}).format(new Date());
 const nowMin=()=>{const p=Object.fromEntries(new Intl.DateTimeFormat('en-US',{timeZone:'America/Sao_Paulo',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).formatToParts(new Date()).map(x=>[x.type,x.value]));return +p.hour*60+(+p.minute)};
 const cap=t=>t.charAt(0).toUpperCase()+t.slice(1);
 const dow=s=>{const [y,m,d]=s.split('-').map(Number);return new Date(y,m-1,d).getDay()};
 const fmt=s=>{const [y,m,d]=s.split('-').map(Number);return cap(new Date(y,m-1,d).toLocaleDateString('pt-BR',{weekday:'long',day:'numeric',month:'long'}))};
 const short=s=>{const [y,m,d]=s.split('-');return d+'/'+m};
 const month=(y,m)=>cap(new Date(y,m,1).toLocaleDateString('pt-BR',{month:'long',year:'numeric'}));
 /* horário do Google: seg a qua 9h–17h · qui e sex 8h–18h · sáb 9h–12h · domingo fechado */
 const HOURS={0:null,1:[9,17],2:[9,17],3:[9,17],4:[8,18],5:[8,18],6:[9,12]};
 const slots=s=>{const h=HOURS[dow(s)];if(!h)return[];const r=[];for(let x=h[0];x<h[1];x++)r.push(pad(x)+':00');return r};
 /* horários de exemplo já ocupados, pra agenda não começar vazia */
 const demoBusy=(s,t)=>{let h=0;for(const c of s+t)h=(h*31+c.charCodeAt(0))>>>0;return h%100<34};
 const ACTIVE=['novo','confirmado'];
 const taken=(s,t)=>get(K.ap,[]).some(a=>a.date===s&&a.time===t&&ACTIVE.includes(a.status));
 const freeSlots=s=>{if(get(K.block,[]).includes(s))return[];const T=today();return slots(s).filter(t=>!demoBusy(s,t)&&!taken(s,t)&&!(s===T&&+t.slice(0,2)*60<=nowMin()+60))};
 const esc=v=>String(v==null?'':v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const MOD={dom:'🏠 Domiciliar',pres:'🩺 Presencial',online:'💻 Online'};
 return{K,get,set,on,pad,iso,today,cap,dow,fmt,short,month,HOURS,slots,demoBusy,freeSlots,taken,esc,MOD,ACTIVE,WA:'5527997005856'}
})();
