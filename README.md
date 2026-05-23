# ThompBui

**Freelance & agency project workspace** — CRM, Kanban, contracts, client infrastructure, AI search, and renewal tracking in one polished UI.

English | [Tiếng Việt](README.vi.md) | [简体中文](README.zh-CN.md) | [日本語](README.ja.md) | [Español](README.es.md) | [Português](README.pt.md) | [한국어](README.ko.md)

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38B2AC?logo=tailwindcss&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green)
![Version](https://img.shields.io/badge/Version-1.0.0-blue)

---
![Ảnh màn hình](https://dabilux.com/wp-content/uploads/2026/05/Screenshot-2026-05-23-122027-scaled.png)
## Why ThompBui?

Solo freelancers and small agencies juggle **clients**, **projects**, **contracts**, **hosting renewals**, and **team chat** across too many tools. ThompBui brings the essentials into a single **dark/light**, **multilingual** workspace with a modern SaaS-style UI.
- [Thomp Bui](https://www.facebook.com/thompbui) 
- [DabiluxDesign](https://dabilux.com)

## Features

- **Dashboard** — revenue, active projects, delay alerts, expiring domains/hosting
- **Projects** — Kanban drag-and-drop, Gantt, list view, internal & client chat
- **CRM** — clients, companies, quick contact channels
- **Inbox & notifications** — mentions, client messages, deadline hints
- **Contracts** — templates from Google Docs (`.docx` / `.html`), print-ready
- **Client infrastructure** — domains, VPS, renewal fees & status
- **Purchased accounts** — Figma, tools, subscriptions (separate from client assets)
- **Collaborators** — Messenger / Zalo links, freelancer contracts
- **AI workspace search** — natural language over your data (OpenAI-compatible API)
- **i18n** — English, 简体中文, 日本語, Español, Português, 한국어, Tiếng Việt (UI); demo content stays Vietnamese
- **Themes** — dark & light mode

## Screenshots

![Ảnh màn hình](https://dabilux.com/wp-content/uploads/2026/05/Screenshot-2026-05-23-122009-scaled.png)

| Dark mode | Light mode |
|-----------|------------|
| *Yes* | *Yes* |

## Demo

```bash
git clone https://github.com/ThompBui/freelancer-workspace.git
cd freelancer-workspace
npm install
npm run dev
```

Open the URL shown in the terminal (default `http://localhost:5173`).

### Quick tour

1. Use the **left rail** — Overview, Projects, Inbox, CRM, Infrastructure, Contracts…
2. Header **EN / ZH / JA / ES / PT / KO / VI** — switch UI language instantly
3. **Ctrl+K** — AI search panel (configure API key in **Settings**)
4. **Gift a coffee** — footer button on the rail menu (QR support)

## Tech stack

| Layer | Technology |
|-------|------------|
| UI | React 19 |
| Build | Vite 6 |
| Styling | Tailwind CSS 4 |
| Icons | Lucide React |
| DOCX import | Mammoth |
| i18n | Custom JSON locales + English fallback |

## Installation

**Requirements:** Node.js 18+

```bash
npm install
```

### Environment (optional — AI search)

Sset the API key in **Settings → AI API** (stored in browser `localStorage` for demo).

## Usage

| Command | Description |
|---------|-------------|
| `npm run dev` | Development server |
| `npm run build` | Production build → `dist/` |
| `npm run preview` | Preview production build |

## Roadmap

- [ ] Backend API + auth (replace demo personas)
- [ ] PostgreSQL / Supabase persistence
- [ ] Docker Compose one-liner
- [ ] Public docs site (VitePress / Docusaurus)
- [ ] Email notifications & webhooks
- [ ] Mobile PWA

See [docs/SOLO_AGENCY_ROADMAP.md](docs/SOLO_AGENCY_ROADMAP.md) for agency-scale planning.

## Contributing

Contributions welcome! Please open an issue first for large changes.

1. Fork the repo
2. Create a branch (`feat/my-feature`)
3. Commit with clear messages
4. Open a Pull Request

**i18n:** add or fix strings in `src/i18n/*.js` — keep the same keys as `en.js`.

## License

MIT — see [LICENSE](LICENSE) (add a LICENSE file if you publish publicly).

---

<p align="center">
  Built for freelancers who ship. ☕ <strong>ThompBui</strong>
</p>
