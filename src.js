import './style.css';
import { TonConnectUI } from '@tonconnect/ui';

const $=s=>document.querySelector(s);
const app=$('#app');
const ton=new TonConnectUI({manifestUrl:`${location.origin}/tonconnect-manifest.json`});
const gifts=[
 {id:1,name:'Plush Pepe',collection:'Plush Pepe',serial:'#1842',price:18.5,rarity:'Rare',emoji:'🐸'},
 {id:2,name:'Durov’s Cap',collection:'Durov’s Cap',serial:'#0921',price:7.2,rarity:'Uncommon',emoji:'🧢'},
 {id:3,name:'Heart Locket',collection:'Heart Locket',serial:'#7710',price:4.8,rarity:'Common',emoji:'💝'},
 {id:4,name:'Astral Shard',collection:'Astral Shard',serial:'#0317',price:12,rarity:'Epic',emoji:'💠'},
 {id:5,name:'Vintage Cigar',collection:'Vintage Cigar',serial:'#2210',price:9.4,rarity:'Rare',emoji:'🚬'},
 {id:6,name:'B-Day Candle',collection:'B-Day Candle',serial:'#4102',price:3.6,rarity:'Common',emoji:'🕯️'}
];
let tab='market',query='',sort='popular',rarity='all',favorites=new Set();
const fmt=n=>Number(n).toLocaleString('en-US',{maximumFractionDigits:2});
function shell(){
 app.innerHTML=`<header><div class="brand"><div class="logo">🎁</div><div><b>GIFT MARKET</b><small>TELEGRAM GIFT MARKETPLACE</small></div></div><button id="wallet" class="wallet">Подключить TON Wallet</button></header>
 <section class="hero"><span class="eyebrow">✦ COLLECT • TRADE • OWN</span><h1>Твоя коллекция<br><em>начинается здесь</em></h1><p>Покупай и продавай коллекционные Telegram-подарки.</p><div class="hero-tags"><span>💎 TON</span><span>🛡️ TON Connect</span><span>🎁 Gifts</span></div></section>
 <nav>${[['market','Маркет'],['favorites','Избранное'],['gifts','Мои подарки'],['activity','Активность'],['profile','Профиль']].map(([k,v])=>`<button data-tab="${k}" class="${tab===k?'active':''}">${v}</button>`).join('')}</nav><main id="content"></main><footer>GIFT MARKET <span>Независимый маркетплейс · Не связан с Telegram</span></footer>`;
 $('#wallet').onclick=()=>ton.openModal();
 ton.onStatusChange(w=>{const b=$('#wallet');if(b)b.textContent=w?.account?.address?`● ${w.account.address.slice(0,5)}…${w.account.address.slice(-4)}`:'Подключить TON Wallet';});
 document.querySelectorAll('[data-tab]').forEach(b=>b.onclick=()=>{tab=b.dataset.tab;render();});
}
function card(g){
 const fav=favorites.has(g.id);
 return `<article class="card"><div class="art art${g.id%4}"><span>${g.emoji}</span><small>${g.rarity}</small><button class="heart ${fav?'chosen':''}" data-fav="${g.id}">${fav?'♥':'♡'}</button></div><div class="info"><div><b>${g.name}</b><small>${g.collection} · ${g.serial}</small></div><div class="price"><b>${fmt(g.price)} TON</b><small>Демо-цена</small></div></div><button class="buy" data-buy="${g.id}">Посмотреть подарок</button></article>`;
}
function render(){
 shell();const c=$('#content');
 if(tab==='market'||tab==='favorites'){
  let list=tab==='favorites'?gifts.filter(g=>favorites.has(g.id)):gifts.filter(g=>g.name.toLowerCase().includes(query.toLowerCase())||g.collection.toLowerCase().includes(query.toLowerCase()));
  if(rarity!=='all')list=list.filter(g=>g.rarity===rarity);
  if(sort==='low')list.sort((a,b)=>a.price-b.price);if(sort==='high')list.sort((a,b)=>b.price-a.price);if(sort==='name')list.sort((a,b)=>a.name.localeCompare(b.name));
  c.innerHTML=`<div class="heading"><div><h2>${tab==='market'?'Маркет подарков':'Избранное'}</h2><p>${tab==='market'?'Найди свой следующий коллекционный подарок':'Сохранённые подарки'}</p></div><span class="count">${list.length} ITEMS</span></div>${tab==='market'?`<div class="tools"><input id="search" placeholder="⌕  Поиск подарков..." value="${query}"><select id="rarity"><option value="all">Все редкости</option>${['Common','Uncommon','Rare','Epic'].map(x=>`<option ${rarity===x?'selected':''}>${x}</option>`).join('')}</select><select id="sort"><option value="popular">Популярные</option><option value="low" ${sort==='low'?'selected':''}>Сначала дешевле</option><option value="high" ${sort==='high'?'selected':''}>Сначала дороже</option><option value="name" ${sort==='name'?'selected':''}>По названию</option></select></div>`:''}<div class="cards">${list.length?list.map(card).join(''):'<div class="empty">Подарки не найдены.</div>'}</div><div class="notice">Демонстрационный каталог: карточки и цены пока тестовые, это не реальные объявления.</div>`;
  $('#search')?.addEventListener('input',e=>{query=e.target.value;const pos=e.target.selectionStart;render();const inp=$('#search');inp.focus();inp.setSelectionRange(pos,pos);});
  $('#rarity')?.addEventListener('change',e=>{rarity=e.target.value;render()});$('#sort')?.addEventListener('change',e=>{sort=e.target.value;render()});
 }else if(tab==='gifts')c.innerHTML=`<h2>Мои подарки</h2><div class="empty panel">Подключи кошелёк и добавь интеграцию проверки владения, чтобы увидеть свои подарки.</div>`;
 else if(tab==='activity')c.innerHTML=`<h2>Активность и история</h2><div class="empty panel">История покупок, продаж и статусы транзакций появятся здесь после подключения реального торгового сервиса.</div>`;
 else c.innerHTML=`<h2>Профиль</h2><div class="panel profile"><div class="avatar">👤</div><b>Профиль пользователя</b><p>Кошелёк TON</p><div id="addr" class="muted">${ton.wallet?.account?.address||'Не подключён'}</div><p class="muted">Здесь будут данные профиля и история действий.</p></div>`;
 document.querySelectorAll('[data-fav]').forEach(b=>b.onclick=()=>{const id=Number(b.dataset.fav);favorites.has(id)?favorites.delete(id):favorites.add(id);render();});
 document.querySelectorAll('[data-buy]').forEach(b=>b.onclick=()=>alert('Покупка пока не включена: нужно подключить проверенный источник реальных подарков и безопасный механизм оплаты/передачи. Не отправляй TON напрямую незнакомым адресам.'));
}
render();
