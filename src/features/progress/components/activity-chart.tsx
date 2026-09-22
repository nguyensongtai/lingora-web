import type { DayActivity } from "../types";

const WEEKDAYS = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"] as const;

/**
 * Biểu đồ cột số bài mỗi ngày. Dựng bằng div chứ không phải thư viện biểu đồ:
 * một dãy cột không cần trục, tooltip hay tỉ lệ log, và thêm một dependency
 * chỉ để vẽ hình chữ nhật thì không đáng.
 *
 * Server Component — nó không có tương tác nào.
 */
export function ActivityChart({ days }: { days: DayActivity[] }) {
  if (days.length === 0) {
    return null;
  }

  // Cột cao nhất chạm trần, phần còn lại theo tỉ lệ. Dùng max thay vì một
  // thang cố định để ngày học 2 bài vẫn nhìn ra được khác ngày học 1 bài.
  const peak = Math.max(...days.map((day) => day.completed_lessons), 1);

  return (
    <div className="border-border bg-card rounded-card border p-4 app:p-5">
      <div className="flex h-36 items-end gap-[3px]">
        {days.map((day) => (
          <Column key={day.date} day={day} peak={peak} />
        ))}
      </div>
      <div className="text-muted-foreground mt-2 flex justify-between text-[11px]">
        <span>{formatShort(days[0].date)}</span>
        <span>Hôm nay</span>
      </div>
    </div>
  );
}

function Column({ day, peak }: { day: DayActivity; peak: number }) {
  const done = day.completed_lessons;
  // Ngày không học vẫn để lại một vạch mờ: khoảng trống cũng là thông tin, và
  // cột cao 0 thì người xem không biết ngày đó có tồn tại hay không.
  const height = done === 0 ? 3 : Math.max(8, Math.round((done / peak) * 100));

  return (
    // h-full là bắt buộc, không phải trang trí: chiều cao phần trăm của cột
    // bên trong được tính theo thẻ bọc này, mà thẻ bọc cao auto thì mọi cột
    // ra 0 và biểu đồ trống trơn.
    <div
      className="flex h-full flex-1 items-end"
      title={`${formatFull(day.date)} · ${done} bài`}
      aria-label={`${formatFull(day.date)}: ${done} bài`}
    >
      <div
        className={
          done === 0 ? "bg-border w-full rounded-sm" : "bg-brand w-full rounded-sm"
        }
        style={{ height: `${height}%` }}
      />
    </div>
  );
}

/**
 * Ngày từ API là chuỗi YYYY-MM-DD theo giờ Việt Nam. Ghép "T00:00:00Z" rồi đọc
 * bằng getUTC* để mọi máy hiểu giống nhau — để Date tự đoán thì máy ở múi giờ
 * âm sẽ lùi mất một ngày.
 */
function parseDay(date: string): Date {
  return new Date(`${date}T00:00:00Z`);
}

function formatShort(date: string): string {
  const parsed = parseDay(date);
  return `${parsed.getUTCDate()}/${parsed.getUTCMonth() + 1}`;
}

function formatFull(date: string): string {
  const parsed = parseDay(date);
  return `${WEEKDAYS[parsed.getUTCDay()]} ${formatShort(date)}`;
}
