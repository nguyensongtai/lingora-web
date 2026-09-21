# lingora-web

Frontend của Lingora — web app học tiếng Anh. Backend nằm ở repo
[lingora-api](https://github.com/nguyensongtai/lingora-api).

**Stack:** Next.js 16 (App Router, Cache Components, Turbopack), TypeScript
strict, Tailwind v4, shadcn/ui, TanStack Query (server state), Zustand (UI state).

## Chạy local

```bash
pnpm install
pnpm dev            # http://localhost:3000
```

Cần `lingora-api` chạy sẵn ở `http://localhost:8080` (biến `NEXT_PUBLIC_API_URL`).

## Sinh type từ OpenAPI

Spec do `lingora-api` sở hữu; repo này giữ một bản copy trong `openapi/`.

```bash
pnpm api:spec       # tải openapi.yaml mới nhất từ lingora-api
pnpm api:types      # sinh src/lib/api/schema.d.ts
```

## Layout

```
src/
├── app/                   # route App Router, Server Component mặc định
├── components/ui/         # shadcn/ui
├── features/<domain>/     # components/, hooks/, api.ts, types.ts
└── lib/                   # api client, query client
```

`"use client"` chỉ dùng khi cần tương tác. Zustand chỉ giữ UI/session state,
không cache dữ liệu API — việc đó là của TanStack Query.

## Script

| Lệnh | Việc |
| --- | --- |
| `pnpm dev` | dev server (Turbopack) |
| `pnpm build` | production build |
| `pnpm typecheck` | `tsc --noEmit` |
| `pnpm lint` | eslint |
