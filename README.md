# lingora-web

Frontend của Lingora — web app học tiếng Anh cho người Việt. Backend nằm ở repo
[lingora-api](https://github.com/nguyensongtai/lingora-api).

**Stack:** Next.js 16 (App Router, Cache Components, Turbopack), React 19,
TypeScript strict, Tailwind v4, shadcn/ui, TanStack Query v5, Zustand.

---

## Mục lục

- [Chạy local](#chạy-local)
- [Cấu hình](#cấu-hình)
- [Route](#route)
- [Xác thực](#xác-thực)
- [Dữ liệu](#dữ-liệu)
- [Type từ OpenAPI](#type-từ-openapi)
- [Cấu trúc](#cấu-trúc)
- [Giao diện](#giao-diện)
- [Quy ước](#quy-ước)
- [Script](#script)

---

## Chạy local

```bash
pnpm install
cp .env.example .env.local
pnpm dev            # http://localhost:3000
```

Cần `lingora-api` chạy sẵn ở `http://localhost:8080`. Không có nó thì trang đăng
nhập vẫn hiện nhưng mọi màn hình có dữ liệu sẽ đứng ở skeleton.

## Cấu hình

| Biến | Bắt buộc | Việc |
| --- | --- | --- |
| `NEXT_PUBLIC_API_URL` | | gốc của API, **đã gồm `/v1`**; mặc định `http://localhost:8080/v1` |
| `GOOGLE_CLIENT_ID` | | bỏ trống → nút "Tiếp tục với Google" không hiện |

`GOOGLE_CLIENT_ID` ở đây **không** có tiền tố `NEXT_PUBLIC_`: nó chỉ được đọc ở
phía server, và client secret thì hoàn toàn không có mặt trong repo này — việc
đổi authorization code là của `lingora-api`.

## Route

| Đường dẫn | Ai vào được | Việc |
| --- | --- | --- |
| `/` | tất cả | khách thấy trang giới thiệu, người đã đăng nhập thấy màn hình học |
| `/login` | tất cả | đăng nhập và tạo tài khoản chung một form |
| `/learn` | đã đăng nhập | lộ trình theo bậc CEFR, đánh dấu bài đã xong |
| `/vocabulary` | đã đăng nhập | hàng đợi ôn và flashcard |
| `/practice` `/progress` `/tutor` | đã đăng nhập | **màn hình tạm**, xem ghi chú bên dưới |
| `/courses` `/courses/[id]` | đã đăng nhập | danh mục khoá học |
| `/admin/**` | role `admin` | soạn khoá, bài và từ vựng |
| `/api/**` | tuỳ route | Route Handler của BFF, xem [Xác thực](#xác-thực) |

Ba màn `/practice`, `/progress` và `/tutor` **cố ý là chỗ trống có ghi chú**,
không phải giao diện dựng bằng số liệu mẫu: chúng nói thẳng còn thiếu mô hình dữ
liệu nào. Dựng sẵn bằng số bịa sẽ khiến người xem tưởng tính năng đã chạy.

## Xác thực

Token **không bao giờ chạm tới JavaScript của trình duyệt.** Next giữ chúng
trong cookie `httpOnly` và tự đính `Authorization` ở phía server:

```
trình duyệt ──cookie──► Next (proxy + Route Handler) ──Bearer──► lingora-api
```

Ba cookie:

| Cookie | Nội dung |
| --- | --- |
| `lingora_at` | access token, sống 15 phút |
| `lingora_rt` | refresh token |
| `lingora_persist` | có tick "ghi nhớ đăng nhập" hay không |

`lingora_persist` tồn tại vì nếu không có nó, lần làm mới token đầu tiên sẽ âm
thầm nâng một phiên "chỉ trong phiên trình duyệt" thành cookie sống 30 ngày —
đúng thứ người dùng vừa từ chối. Không tick thì `lingora_rt` không có `Max-Age`
và chết khi đóng trình duyệt.

**`src/proxy.ts`** (Next 16 đổi tên `middleware.ts` thành `proxy.ts`) là **nơi
duy nhất làm mới được phiên**, vì Server Component không set cookie được. Nó
làm hai việc: gia hạn access token khi hết hạn, và chặn đường dẫn cần đăng nhập
— khách bị đẩy sang `/login?next=…` để sau khi đăng nhập quay lại đúng chỗ.
Tham số `next` chỉ nhận đường dẫn nội bộ, nên không ai dùng nó để đẩy người dùng
sang tên miền khác.

Route Handler dưới `/api/*` là lớp BFF: nó đọc cookie, gọi API kèm `Bearer`, rồi
`forward()` **nguyên trạng status và body của API xuống client** — kể cả lỗi.
Nhờ vậy `details` theo từng field của API tới thẳng được form mà không phải dịch
lại ở giữa.

Quyền admin được kiểm **hai lần**: `proxy.ts` chặn đường `/admin`, và
`requireAdmin()` kiểm lại trong từng Server Component. Lớp proxy chỉ biết có
cookie hay không, nó không biết role — nên một mình nó chưa đủ.

## Dữ liệu

Ba đường, dùng đúng chỗ:

- **Server Component** đọc dữ liệu lần đầu, rồi truyền xuống làm `initialData`
  của TanStack Query. Người dùng thấy nội dung ngay ở HTML đầu tiên, không phải
  chờ một vòng fetch từ client.
- **TanStack Query** giữ mọi dữ liệu đến từ API. Query key gom trong một factory
  cho mỗi feature — vài component cùng nhìn một key thì một lần cập nhật lạc
  quan làm cả nhóm đổi cùng lúc, không có cảnh thanh tiến độ và huy hiệu nói hai
  con số khác nhau.
- **Zustand** *chỉ* giữ UI/session state (ví dụ theme). **Không** cache dữ liệu
  API — đó là việc của TanStack Query, và giữ hai bản sao thì sớm muộn chúng lệch.

`React.cache()` bọc những hàm đọc mà cả layout lẫn page cùng cần
(`readProgress`, `readVocabulary`), để một lần render chỉ gọi API một lần.

**Cache Components**: mọi thứ đọc cookie hay `searchParams` đều phải nằm trong
`<Suspense>`. Quên là build đỏ, không phải lỗi lúc chạy.

## Type từ OpenAPI

Spec do `lingora-api` sở hữu; repo này giữ một bản sao trong `openapi/`.

```bash
pnpm api:spec       # tải openapi.yaml mới nhất từ lingora-api
pnpm api:types      # sinh src/lib/api/schema.d.ts
```

`src/lib/api/schema.d.ts` là file sinh ra — **không sửa tay**. Đổi hợp đồng thì
sửa ở `lingora-api` rồi chạy lại hai lệnh trên. Nhờ vậy sai lệch giữa hai repo
lộ ra lúc `tsc`, không phải lúc người dùng bấm.

## Cấu trúc

```
src/
├── app/
│   ├── (app)/           # màn hình sau đăng nhập, dùng chung AppShell
│   ├── admin/           # khu soạn nội dung, layout riêng
│   ├── api/             # Route Handler của BFF
│   ├── courses/         # danh mục khoá học
│   ├── login/
│   └── layout.tsx
├── components/ui/       # shadcn/ui — sinh ra, sửa tối thiểu
├── features/<domain>/   # auth, course, home, landing, learn, progress,
│   │                    # shell, vocabulary
│   ├── components/
│   ├── hooks/
│   ├── api.ts           # gọi API từ client
│   ├── server.ts        # gọi API từ Server Component
│   └── types.ts
├── lib/
│   ├── api/             # client, server-client, forward, schema sinh ra
│   ├── auth/            # cookie, session, current-user, require-admin, google
│   └── query-client.ts
└── proxy.ts             # gia hạn phiên + chặn đường
```

Code chia theo **feature**, không theo loại file. Một màn hình sửa ở một thư mục.

## Giao diện

Tailwind v4, khai báo token bằng `@theme inline` trong `src/app/globals.css` —
không có `tailwind.config.ts`.

- **Bảng màu ấm**, nền giấy ngà thay vì trắng tinh; màu nhấn nâu cam.
- **Dark mode** chọn bằng `ThemeScript` chạy trước khi React hydrate, nên không
  có cú nháy trắng lúc tải trang.
- **Breakpoint riêng `--breakpoint-app: 56.25rem` (900px)** là ranh giới giữa bố
  cục điện thoại và bố cục có sidebar. Nó không trùng breakpoint mặc định nào của
  Tailwind vì chỗ gãy của bố cục này không rơi vào 768 hay 1024.
- Font Be Vietnam Pro, có subset `vietnamese`.

## Quy ước

- **TypeScript strict, không dùng `any`.** Kiểu của API lấy từ schema sinh ra.
- **Server Component là mặc định**; `"use client"` chỉ khi thật sự cần tương tác,
  và đặt càng sâu trong cây càng tốt.
- Chỉ dùng App Router của Next 16. Tra cứu API mới nên đọc
  `node_modules/next/dist/docs/` trong repo, không dựa vào trí nhớ về Next 14/15
  — nhiều thứ đã đổi tên (`middleware.ts` → `proxy.ts` là một ví dụ).
- `typedRoutes` đang bật: `pnpm typecheck` chạy `next typegen` trước `tsc`.

## Script

| Lệnh | Việc |
| --- | --- |
| `pnpm dev` | dev server (Turbopack) |
| `pnpm build` | production build |
| `pnpm start` | chạy bản build |
| `pnpm typecheck` | `next typegen && tsc --noEmit` |
| `pnpm lint` | eslint |
| `pnpm api:spec` | tải lại `openapi.yaml` từ `lingora-api` |
| `pnpm api:types` | sinh lại `src/lib/api/schema.d.ts` |

CI chạy `typecheck`, `lint`, `build`. **Repo này chưa có test tự động** — không
có test runner nào được cài, nên mọi thay đổi vẫn phải mở trình duyệt xem lại.
