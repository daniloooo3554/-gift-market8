
import express from 'express';
import { Telegraf } from 'telegraf';

const app = express();
app.use(express.json());
app.use(express.static('dist'));

const PORTALS_URL = 'https://portal-market.com/partners';

async function portalsRequest(path) {
  const token = process.env.PORTALS_PARTNER_TOKEN;

  if (!token) {
    throw new Error('PORTALS_PARTNER_TOKEN is missing');
  }

  const response = await fetch(`${PORTALS_URL}${path}`, {
    headers: {
      Authorization: `partners ${token}`
    }
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || `Portals error: ${response.status}`);
  }

  return data;
}

app.get('/api/health', (_, res) => {
  res.json({ ok: true, name: 'GIFT MARKET' });
});

app.get('/api/listings', async (req, res) => {
  try {
    const search = new URLSearchParams();

    search.set('limit', '20');
    search.set('offset', '0');
    search.set('status', 'listed');

    if (req.query.search) {
      search.set('search', String(req.query.search).slice(0, 60));
    }

    const data = await portalsRequest(
      `/nfts/search?${search.toString()}`
    );

    res.json({
      items: data.results || [],
      total: data.total_count || 0
    });
  } catch (error) {
    console.error('Portals catalog error:', error.message);
    res.status(502).json({
      error: 'Не удалось загрузить каталог Portals',
      details: error.message
    });
  }
});

app.post('/api/orders/buy', (_, res) => {
  res.status(501).json({
    error: 'Покупки пока отключены'
  });
});

app.post('/api/listings', (_, res) => {
  res.status(501).json({
    error: 'Продажи пока отключены'
  });
});

if (process.env.BOT_TOKEN) {
  const bot = new Telegraf(process.env.BOT_TOKEN);

  bot.start(ctx => ctx.reply(
    'Добро пожаловать в GIFT MARKET 🎁',
    {
      reply_markup: {
        inline_keyboard: [[
          {
            text: 'Открыть маркет',
            web_app: { url: process.env.MINI_APP_URL }
          }
        ]]
      }
    }
  ));

  bot.launch();
}

app.listen(process.env.PORT || 3000, () => {
  console.log('GIFT MARKET server started');
});
