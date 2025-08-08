# Amazon Product Scraper (Bun + Vite)

Projeto de teste: backend em **Bun + Express + Axios + JSDOM** para raspar a primeira página de resultados da Amazon (título, rating, nº de reviews e imagem), e frontend em **Vite** (HTML/CSS/JS) para consumir e exibir os dados.

> ⚠️ **Aviso:** a Amazon possui medidas anti-bot e pode alterar a estrutura da página sem aviso, o que pode quebrar o scraper. Este projeto é apenas para fins educacionais.

## Requisitos
- [Bun](https://bun.sh/) instalado
- Node 18+ (para o Vite, opcionalmente)
- npm ou bun para o frontend

## Como rodar (dev)

### 1) API (server)
```bash
cd server
cp .env.example .env   # opcional, para mudar a porta
bun install
bun run dev
# API em http://localhost:3000
```
Endpoints:
- `GET /api/scrape?keyword=notebook`

### 2) Frontend (client)
```bash
cd ../client
npm install   # ou bun install
npm run dev   # ou bun run dev
# Frontend em http://localhost:5173
```

> Se necessário, ajuste `API_BASE` em `client/main.js` para apontar para a URL da API.

## Tratamento de erros
- A API retorna `warning` quando detecta possível bloqueio (ex.: HTTP 403/503).
- O frontend mostra mensagens no elemento `#status` e evita quebrar o layout.

## Comandos
- **server**: `bun run dev`
- **client**: `npm run dev` | `npm run build` | `npm run preview`

## Deploy (sugestão)
- API: Render, Fly.io, Railway, ou servidor próprio (Bun).
- Frontend: Netlify, Vercel, GitHub Pages (build com Vite).
- Lembre-se de configurar CORS e URL da API no frontend.

## Estrutura
```
amazon-scraper/
├─ server/
│  ├─ server.js
│  ├─ package.json
│  └─ .env.example
└─ client/
   ├─ index.html
   ├─ main.js
   ├─ style.css
   └─ package.json
```

## Observações
- Headers de `User-Agent` e `Accept-Language` ajudam a reduzir bloqueios.
- Em caso de bloqueios frequentes, considere usar proxy rotativo/legal.
