"use client";

/**
 * Lưới cuối: lỗi xảy ra trong chính root layout thì error.tsx cũng không render
 * được, nên file này phải tự dựng cả html và body, và không dùng lại component
 * nào có thể là nguyên nhân.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="vi">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "1rem",
          padding: "2rem",
          textAlign: "center",
          fontFamily: "system-ui, sans-serif",
          background: "#f6f1e8",
          color: "#2a2218",
        }}
      >
        <h1 style={{ fontSize: "1.5rem", margin: 0 }}>Lingora gặp sự cố</h1>
        <p style={{ margin: 0, maxWidth: "28rem", lineHeight: 1.6 }}>
          Trang không khởi động được. Thử tải lại; nếu vẫn vậy thì quay lại sau
          ít phút.
        </p>
        {error.digest ? (
          <p style={{ margin: 0, fontFamily: "monospace", fontSize: "0.85rem", opacity: 0.6 }}>
            Lỗi {error.digest}
          </p>
        ) : null}
        <button
          type="button"
          onClick={reset}
          style={{
            padding: "0.55rem 1.1rem",
            borderRadius: "0.5rem",
            border: "none",
            background: "#b8722c",
            color: "#fff",
            fontSize: "0.95rem",
            cursor: "pointer",
          }}
        >
          Thử lại
        </button>
      </body>
    </html>
  );
}
