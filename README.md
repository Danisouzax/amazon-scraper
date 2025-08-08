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
