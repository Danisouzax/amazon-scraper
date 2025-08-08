const API_BASE = 'http://localhost:3000';

const keywordInput = document.getElementById('keyword');
const searchBtn = document.getElementById('searchBtn');
const resultsEl = document.getElementById('results');
const statusEl = document.getElementById('status');

async function fetchProducts(keyword) {
  resultsEl.innerHTML = '';
  statusEl.textContent = 'Buscando resultados...';

  try {
    const resp = await fetch(`${API_BASE}/api/scrape?keyword=${encodeURIComponent(keyword)}`, {
      method: 'GET'
    });

    const data = await resp.json();

    if (!resp.ok) {
      statusEl.textContent = data?.error || 'Erro ao buscar resultados.';
      return;
    }

    if (data.warning) {
      statusEl.textContent = `Atenção: ${data.warning}`;
    } else {
      statusEl.textContent = `Encontrados ${data.count} produtos para "${data.keyword}".`;
    }

    if (!data.products?.length) {
      resultsEl.innerHTML = '<p>Nenhum produto encontrado.</p>';
      return;
    }

    for (const p of data.products) {
      const card = document.createElement('div');
      card.className = 'card';

      const img = document.createElement('img');
      img.src = p.image || '';
      img.alt = p.title || 'Product image';

      const title = document.createElement('h3');
      title.textContent = p.title || '(Sem título)';

      const meta = document.createElement('div');
      meta.className = 'meta';
      const rating = p.rating != null ? `${p.rating.toFixed(1)}/5` : '—';
      const reviews = p.reviewsCount != null ? `${p.reviewsCount} reviews` : '—';
      meta.textContent = `Rating: ${rating} • Reviews: ${reviews}`;

      card.appendChild(img);
      card.appendChild(title);
      card.appendChild(meta);

      if (p.link) {
        const a = document.createElement('a');
        a.href = p.link;
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        a.textContent = 'Ver na Amazon';
        card.appendChild(a);
      }

      resultsEl.appendChild(card);
    }
  } catch (err) {
    console.error(err);
    statusEl.textContent = 'Falha ao obter resultados. Verifique a API e tente novamente.';
  }
}

searchBtn.addEventListener('click', () => {
  const keyword = keywordInput.value.trim();
  if (!keyword) {
    statusEl.textContent = 'Informe uma palavra-chave.';
    return;
  }
  fetchProducts(keyword);
});

keywordInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') searchBtn.click();
});