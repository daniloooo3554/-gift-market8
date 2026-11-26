import express from 'express';
import {Telegraf} from 'telegraf';
const app=express();app.use(express.json());app.use(express.static('dist'));
app.get('/api/health',(_,r)=>r.json({ok:true,name:'GIFT MARKET',trading:'disabled_pending_verified_marketplace'}));
app.get('/api/listings',(_,r)=>r.json({items:[],message:'Real gift inventory provider is not connected.'}));
app.post('/api/orders/buy',(_,r)=>r.status(501).json({error:'Buying is disabled until a verified gift transfer and payment settlement provider is configured.'}));
app.post('/api/listings',(_,r)=>r.status(501).json({error:'Listing is disabled until ownership verification is configured.'}));
if(process.env.BOT_TOKEN){const bot=new Telegraf(process.env.BOT_TOKEN);bot.start(ctx=>ctx.reply('Добро пожаловать в GIFT MARKET 🎁',{reply_markup:{inline_keyboard:[[{text:'Открыть маркет',web_app:{url:process.env.MINI_APP_URL}}]]}}));bot.launch();}
app.listen(process.env.PORT||3000,()=>console.log('GIFT MARKET server started'));
