# dori-worker

DORI 대시보드 오프라인 안내 페이지 — Cloudflare Worker

`dash.dgist-dori.xyz` 접속 시 Jetson 서버가 꺼져있으면 오프라인 안내 페이지를 보여줍니다.

## File Structure

```
dori-worker/
├── src/
│   ├── index.js        # Worker 진입점
│   └── offline.html    # 오프라인 안내 페이지 HTML
├── wrangler.toml       # Cloudflare Worker 설정
└── package.json
```

## Usage
### With GitHub

1. 이 레포지토리를 Cloudflare Workers & Pages 에 연결
   - Cloudflare 대시보드 → **Workers & Pages** → **Create**
   - **Connect to Git** → 이 레포 선택
   - Framework preset: `None`
   - Build command: (비워두기)
   - Deploy

2. 배포 후 **Settings → Triggers → Routes** 에서 확인
   - `dash.dgist-dori.xyz/*` 라우트가 자동 등록되어 있어야 함
   - 없으면 수동으로 추가

### 수동 배포 방법 wrangler CLI

```bash
npm install
npx wrangler login
npx wrangler deploy
```
