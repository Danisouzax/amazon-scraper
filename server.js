import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import axios from 'axios';
import { JSDOM } from 'jsdom';

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

function buildAmazonSearchUrl(keyword) {
  const q = encodeURIComponent(keyword.trim());
  return `https://www.amazon.com.br/s?k=${q}`;
}

function parseProductCard(card) {
  let title =
    card.querySelector('h2 a span')?.textContent?.trim() ||
    card.querySelector('span.a-size-medium.a-color-base.a-text-normal')?.textContent?.trim() ||
    null;

  let link =
    card.querySelector('h2 a')?.getAttribute('href') || null;
  if (link && link.startsWith('/')) {
    link = 'https://www.amazon.com.br' + link;
  }

  let ratingText = card.querySelector('span.a-icon-alt')?.textContent?.trim() || null;
  let rating = null;
  if (ratingText) {
    const match = ratingText.match(/([\d,.]+)\s+de\s+5/);
    if (match) rating = parseFloat(match[1].replace(',', '.'));
  }

  let reviewsText =
    card.querySelector('span[aria-label$="avaliações"]')?.getAttribute('aria-label') ||
    card.querySelector('span[aria-label$="avaliação"]')?.getAttribute('aria-label') ||
    card.querySelector('span.a-size-base.s-underline-text')?.textContent ||
    card.querySelector('span.a-size-base.s-underline-text.a-text-bold')?.textContent ||
    null;

  let reviewsCount = null;
  if (reviewsText) {
    const digits = reviewsText.replace(/[^\d]/g, '');
    if (digits) reviewsCount = parseInt(digits, 10);
  }

  let image =
    card.querySelector('img.s-image')?.getAttribute('src') ||
    card.querySelector('img')?.getAttribute('src') ||
    null;

  if (!title) return null;

  return {
    title,
    rating,
    reviewsCount,
    image,
    link
  };
}

app.get('/api/scrape', async (req, res) => {
  const { keyword } = req.query;

  if (!keyword || !keyword.trim()) {
    return res.status(400).json({
      error: 'Missing required query parameter: keyword'
    });
  }

  try {
    const url = buildAmazonSearchUrl(keyword);
    const { data: html } = await axios.get(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
        'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7'
      },
      timeout: 15000
    });

    const dom = new JSDOM(html);
    const document = dom.window.document;

    const resultItems = document.querySelectorAll('div.s-result-item[data-component-type="s-search-result"]');

    const products = [];
    resultItems.forEach((item) => {
      const parsed = parseProductCard(item);
      if (parsed) products.push(parsed);
    });

    return res.json({
      keyword,
      count: products.length,
      products
    });
  } catch (err) {
    console.error('Scrape error:', err?.message);
    const status = err?.response?.status || 500;
    const isBlocked = status === 503 || status === 403;
    return res.status(200).json({
      keyword,
      count: 0,
      products: [],
      warning: isBlocked
        ? 'Amazon blocking detected (HTTP ' + status + '). Try again later or adjust headers/proxy.'
        : 'Unable to scrape results at this time. The page structure may have changed.',
      details: process.env.NODE_ENV === 'development' ? (err?.message || 'Unknown error') : undefined
    });
  }
});

app.get('/', (_req, res) => {
  res.send('Amazon Scraper API is running. Use /api/scrape?keyword=...');
});

app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`);
});