import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookOpen, Mic, RotateCcw } from "lucide-react";

import { Wordmark } from "@/features/shell/components/wordmark";
import { cn } from "@/lib/utils";

const PILLARS = [
  {
    icon: BookOpen,
    title: "Lộ trình CEFR rõ ràng",
    body: "A1 → C2, mỗi cấp chia thành khoá và bài. Luôn thấy mình ở đâu và còn bao xa tới mốc kế tiếp.",
    soon: false,
  },
  {
    icon: Mic,
    title: "AI sửa nói và viết",
    body: "Đọc câu, AI chấm phát âm từng từ. Viết đoạn ngắn, AI sửa và giải thích bằng tiếng Việt.",
    soon: true,
  },
  {
    icon: RotateCcw,
    title: "Ôn đúng lúc, không quên",
    body: "Từ vựng và điểm ngữ pháp bạn sai được xếp lịch ôn theo spaced repetition, 3–5 phút mỗi ngày.",
    soon: true,
  },
] as const;

const STEPS = [
  {
    title: "Tạo tài khoản",
    body: "Một email và một mật khẩu. Không cần thẻ, không có bản dùng thử hết hạn.",
  },
  {
    title: "Chọn bậc và mở khoá đầu tiên",
    body: "Lộ trình xếp sẵn theo khung CEFR; bắt đầu từ bậc phù hợp với bạn.",
  },
  {
    title: "Đánh dấu từng bài đã xong",
    body: "Tiến độ được lưu lại, nên lần sau mở app là biết học tiếp từ đâu.",
  },
] as const;

export function LandingScreen() {
  return (
    <div className="flex min-h-full flex-1 flex-col text-base leading-relaxed">
      <header className="border-border bg-background/95 sticky top-0 z-10 border-b backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-270 items-center gap-6 px-6">
          <Wordmark />
          <nav className="ml-auto flex gap-1">
            <Link
              href="/login"
              className="hover:bg-secondary inline-flex h-10 items-center rounded-lg px-4 text-sm font-semibold transition-colors"
            >
              Đăng nhập
            </Link>
            <Link
              href="/login"
              className="bg-brand inline-flex h-10 items-center rounded-lg px-4.5 text-sm font-semibold text-white"
            >
              Bắt đầu miễn phí
            </Link>
          </nav>
        </div>
      </header>

      <section className="mx-auto grid w-full max-w-270 grid-cols-[repeat(auto-fit,minmax(300px,1fr))] items-center gap-12 px-6 pt-18 pb-12">
        <div className="flex flex-col gap-6">
          <p className="text-brand-strong text-[13px] font-semibold tracking-[0.06em] uppercase">
            Learn. Practice. Speak.
          </p>
          <h1 className="text-[clamp(34px,5vw,52px)] leading-[1.1] font-bold tracking-[-0.025em] text-pretty">
            Tiếng Anh cho người bận, 10 phút mỗi ngày theo lộ trình CEFR
          </h1>
          <p className="text-muted-foreground max-w-[52ch] text-lg text-pretty">
            Biết mình đang ở đâu, học gì tiếp. Lộ trình A1 → C2 chia thành khoá
            và bài, tiến độ lưu lại sau mỗi lần học.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/login"
              className="bg-brand inline-flex h-13 items-center gap-2 rounded-xl px-6 font-semibold text-white"
            >
              Tạo tài khoản miễn phí
              <ArrowRight className="size-4.5" />
            </Link>
            <Link
              href="/login"
              className="border-border bg-card inline-flex h-13 items-center rounded-xl border px-5 font-semibold"
            >
              Tôi đã có tài khoản
            </Link>
          </div>
          <p className="text-muted-foreground text-[13px]">
            Miễn phí toàn bộ lộ trình. Không cần thẻ.
          </p>
        </div>

        <Preview />
      </section>

      <section className="mx-auto w-full max-w-270 px-6 py-12">
        <div className="border-border bg-border grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-px overflow-hidden rounded-3xl border">
          {PILLARS.map((pillar) => (
            <div
              key={pillar.title}
              className="bg-card flex flex-col gap-2.5 p-7"
            >
              <span className="bg-brand-soft text-brand-strong grid size-10 place-items-center rounded-lg">
                <pillar.icon className="size-5" />
              </span>
              <h3 className="flex flex-wrap items-center gap-2 text-lg font-bold tracking-tight">
                {pillar.title}
                {pillar.soon ? <SoonTag /> : null}
              </h3>
              <p className="text-muted-foreground text-[15px]">{pillar.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-270 grid-cols-[repeat(auto-fit,minmax(280px,1fr))] items-start gap-12 px-6 py-12">
        <div className="flex flex-col gap-3">
          <p className="text-brand-strong text-[13px] font-semibold tracking-[0.06em] uppercase">
            Cách hoạt động
          </p>
          <h2 className="text-[32px] leading-tight font-bold tracking-tight">
            Ba bước, rồi cứ thế mỗi ngày
          </h2>
          <p className="text-muted-foreground">
            Không cần tự xếp lịch. Mở app là biết học gì.
          </p>
        </div>
        <ol className="flex flex-col">
          {STEPS.map((step, index) => (
            <li
              key={step.title}
              className={cn(
                "grid grid-cols-[40px_1fr] gap-4 py-5",
                index < STEPS.length - 1 && "border-border border-b",
              )}
            >
              <span className="bg-foreground text-background grid size-8 place-items-center rounded-full text-sm font-bold">
                {index + 1}
              </span>
              <div>
                <b className="font-semibold">{step.title}</b>
                <p className="text-muted-foreground text-[15px]">{step.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="mx-auto w-full max-w-270 px-6 py-12 pb-24">
        <div className="bg-foreground text-background flex flex-wrap items-center justify-between gap-6 rounded-3xl px-8 py-12">
          <div className="flex max-w-130 flex-col gap-2">
            <h2 className="text-[28px] leading-tight font-bold tracking-tight">
              Bắt đầu từ bài đầu tiên
            </h2>
            <p className="opacity-75">
              Tạo tài khoản, chọn bậc CEFR phù hợp và mở khoá học đầu tiên trong
              vài phút.
            </p>
          </div>
          <Link
            href="/login"
            className="bg-brand inline-flex h-13 items-center rounded-xl px-6 font-semibold text-white"
          >
            Tạo tài khoản miễn phí
          </Link>
        </div>
      </section>

      <footer className="border-border border-t">
        <div className="text-muted-foreground mx-auto flex w-full max-w-270 flex-wrap items-center justify-between gap-4 px-6 py-6 text-[13px]">
          <span className="flex items-center gap-2">
            <Image
              src="/brand/lingora-mark.png"
              alt=""
              width={22}
              height={22}
              style={{ width: 22, height: 22 }}
            />
            © 2026 Lingora
          </span>
        </div>
      </footer>
    </div>
  );
}

function SoonTag() {
  return (
    <span className="bg-secondary text-muted-foreground rounded-full px-2 py-0.5 text-[11px] font-semibold">
      Sắp có
    </span>
  );
}

/** Ảnh minh hoạ sản phẩm; số liệu trong đây là ví dụ, không phải của ai cả. */
function Preview() {
  return (
    <div className="border-border bg-card flex flex-col gap-4 rounded-[20px] border p-5 shadow-[0_24px_60px_-30px_rgba(92,58,30,0.35)]">
      <div className="text-muted-foreground flex items-center justify-between text-[13px]">
        <span>
          Chào buổi tối, An ·{" "}
          <b className="text-foreground font-semibold">A2 · Giao tiếp</b>
        </span>
        <span className="text-muted-foreground text-xs">ví dụ</span>
      </div>
      <div className="bg-background flex flex-col gap-3 rounded-[14px] p-4.5">
        <p className="text-brand-strong text-[11px] font-semibold tracking-[0.06em] uppercase">
          Tiếp tục học
        </p>
        <p className="text-lg font-bold tracking-tight">Gọi món ở nhà hàng</p>
        <div className="text-muted-foreground flex items-center gap-2.5 text-xs">
          <span className="bg-secondary h-1.5 flex-1 overflow-hidden rounded-sm">
            <span className="bg-brand block h-full w-1/2 rounded-sm" />
          </span>
          1/2 bài
        </div>
        <span className="bg-brand inline-flex h-10 items-center self-start rounded-lg px-4 text-sm font-semibold text-white">
          Tiếp tục
        </span>
      </div>
      <div className="grid grid-cols-[1fr_auto] items-center gap-2.5 text-[13px]">
        {[
          ["Mạo từ a, an, the", true],
          ["Danh từ đếm được", true],
          ["Thì hiện tại đơn", false],
        ].map(([title, done]) => (
          <div key={String(title)} className="contents">
            <span className={cn(done && "text-muted-foreground line-through")}>
              {title}
            </span>
            <span
              className={cn(
                "grid size-5 place-items-center rounded-full text-[11px] font-bold",
                done
                  ? "bg-brand text-white"
                  : "border-border text-muted-foreground border-2",
              )}
            >
              {done ? "✓" : ""}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
