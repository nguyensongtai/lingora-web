import { ImageResponse } from "next/og";

/**
 * Ảnh hiện khi ai đó dán link Lingora vào Zalo, Messenger hay Facebook. Không
 * có nó thì link ra một ô trống, trông như site hỏng.
 *
 * Dựng bằng ImageResponse của Next chứ không phải một file PNG cố định: chữ
 * nằm trong code nên sửa được cùng lúc với phần còn lại, và không có file nhị
 * phân nào phải commit.
 */
export const alt = "Lingora — học tiếng Anh theo lộ trình CEFR";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          // Cùng bảng màu ấm với app; ImageResponse không đọc Tailwind nên
          // màu phải viết thẳng ở đây.
          background: "#f6f1e8",
          color: "#2a2218",
          padding: "72px 80px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 16,
              background: "#b8722c",
            }}
          />
          <span style={{ fontSize: 40, fontWeight: 700, letterSpacing: -1 }}>
            Lingora
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <span
            style={{
              fontSize: 76,
              fontWeight: 700,
              lineHeight: 1.1,
              letterSpacing: -2,
              maxWidth: 900,
            }}
          >
            Tiếng Anh cho người bận, 10 phút mỗi ngày
          </span>
          <span style={{ fontSize: 34, color: "#5c3a1e" }}>
            Lộ trình A1 → C2 theo khung CEFR
          </span>
        </div>

        <div style={{ display: "flex", gap: 12 }}>
          {["A1", "A2", "B1", "B2", "C1", "C2"].map((level) => (
            <span
              key={level}
              style={{
                fontSize: 26,
                fontWeight: 600,
                color: "#5c3a1e",
                background: "#efe3d2",
                borderRadius: 999,
                padding: "10px 26px",
              }}
            >
              {level}
            </span>
          ))}
        </div>
      </div>
    ),
    size,
  );
}
