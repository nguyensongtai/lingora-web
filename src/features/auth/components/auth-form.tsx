"use client";

import { CircleAlert, Eye, EyeOff } from "lucide-react";
import { useState, type FormEvent } from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ApiError } from "@/lib/api/client";
import { cn } from "@/lib/utils";

import { useLogin } from "../hooks/use-login";
import { useRegister } from "../hooks/use-register";

/** Khớp MinPasswordLen của API; sửa một chỗ thì phải sửa cả hai. */
const MIN_PASSWORD_LENGTH = 12;

type Mode = "login" | "register";

const OAUTH_ERRORS: Record<string, string> = {
  google_off: "Đăng nhập bằng Google chưa được bật trên máy chủ.",
  google_cancelled: "Bạn đã huỷ đăng nhập bằng Google.",
  google_state: "Phiên đăng nhập Google đã hết hạn, vui lòng thử lại.",
  google_failed: "Không xác thực được với Google, vui lòng thử lại.",
};

export function AuthForm({
  redirectTo,
  googleEnabled,
  oauthError,
}: {
  redirectTo: string;
  googleEnabled: boolean;
  oauthError: string | undefined;
}) {
  const [mode, setMode] = useState<Mode>("login");
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const login = useLogin(redirectTo);
  const register = useRegister(redirectTo);
  const active = mode === "login" ? login : register;

  const fieldErrors =
    active.error instanceof ApiError ? active.error.details : {};
  const generalError =
    active.error && Object.keys(fieldErrors).length === 0
      ? active.error.message
      : (oauthError && OAUTH_ERRORS[oauthError]) || null;

  function switchTo(next: Mode) {
    setMode(next);
    login.reset();
    register.reset();
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (mode === "login") {
      login.mutate({ email, password, remember });
    } else {
      register.mutate({ email, password, display_name: displayName });
    }
  }

  return (
    <div className="flex w-full max-w-100 flex-col gap-7">
      <div>
        <h1 className="text-[26px] leading-tight font-bold tracking-tight">
          {mode === "login" ? "Chào mừng trở lại" : "Bắt đầu học miễn phí"}
        </h1>
        <p className="text-muted-foreground mt-1.5">
          {mode === "login"
            ? "Đăng nhập để tiếp tục lộ trình của bạn."
            : "Tạo tài khoản để lưu tiến độ học của bạn."}
        </p>
      </div>

      <div role="tablist" className="bg-secondary flex gap-1 rounded-lg p-1">
        {(["login", "register"] as const).map((value) => (
          <button
            key={value}
            type="button"
            role="tab"
            aria-selected={mode === value}
            onClick={() => switchTo(value)}
            className={cn(
              "h-9.5 flex-1 rounded-lg text-sm font-semibold transition-colors",
              mode === value
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground",
            )}
          >
            {value === "login" ? "Đăng nhập" : "Tạo tài khoản"}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
        {mode === "register" ? (
          <Field
            id="display_name"
            label="Họ tên"
            error={fieldErrors.display_name}
          >
            <Input
              id="display_name"
              autoComplete="name"
              placeholder="Nguyễn An"
              required
              value={displayName}
              onChange={(event) => setDisplayName(event.target.value)}
              aria-invalid={fieldErrors.display_name !== undefined}
            />
          </Field>
        ) : null}

        <Field id="email" label="Email" error={fieldErrors.email}>
          <Input
            id="email"
            type="email"
            autoComplete="username"
            placeholder="ban@email.com"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            aria-invalid={fieldErrors.email !== undefined}
          />
        </Field>

        <Field id="password" label="Mật khẩu" error={fieldErrors.password}>
          <span className="relative flex">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete={
                mode === "login" ? "current-password" : "new-password"
              }
              placeholder={
                mode === "login"
                  ? "••••••••"
                  : `Ít nhất ${MIN_PASSWORD_LENGTH} ký tự`
              }
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              aria-invalid={fieldErrors.password !== undefined}
              className="pr-11"
            />
            <button
              type="button"
              onClick={() => setShowPassword((shown) => !shown)}
              aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
              className="text-muted-foreground hover:text-foreground absolute top-1/2 right-1 grid size-9 -translate-y-1/2 place-items-center rounded-lg"
            >
              {showPassword ? (
                <EyeOff className="size-4.5" />
              ) : (
                <Eye className="size-4.5" />
              )}
            </button>
          </span>
        </Field>

        {generalError ? (
          <div
            role="alert"
            className="bg-danger-soft text-danger flex items-start gap-2 rounded-lg px-3 py-2.5 text-[13px]"
          >
            <CircleAlert className="mt-0.5 size-4 flex-none" />
            {generalError}
          </div>
        ) : null}

        {mode === "login" ? (
          <label className="flex min-h-11 cursor-pointer items-center gap-2.5 text-sm">
            <input
              type="checkbox"
              checked={remember}
              onChange={(event) => setRemember(event.target.checked)}
              className="accent-brand size-4.5"
            />
            Ghi nhớ đăng nhập trên máy này
          </label>
        ) : null}

        <button
          type="submit"
          disabled={active.isPending}
          className="bg-brand h-12 rounded-lg text-[15px] font-semibold text-white transition-colors disabled:cursor-wait disabled:opacity-70"
        >
          {active.isPending
            ? "Đang xử lý…"
            : mode === "login"
              ? "Đăng nhập"
              : "Tạo tài khoản"}
        </button>
      </form>

      {googleEnabled ? (
        <>
          <div className="text-muted-foreground flex items-center gap-3 text-xs">
            <span className="bg-border h-px flex-1" />
            hoặc
            <span className="bg-border h-px flex-1" />
          </div>

          {/* Link chứ không phải nút gọi fetch: vòng OAuth là một chuỗi chuyển
              hướng của trình duyệt, bắt đầu từ Route Handler của Next. */}
          <a
            href={`/api/auth/google?next=${encodeURIComponent(redirectTo)}`}
            className="border-border bg-card hover:bg-secondary flex h-11 items-center justify-center gap-2.5 rounded-lg border text-sm font-semibold transition-colors"
          >
            <GoogleMark />
            Tiếp tục với Google
          </a>
        </>
      ) : null}

      <p className="text-muted-foreground text-center text-xs leading-relaxed">
        Khi tiếp tục, bạn đồng ý với Điều khoản và Chính sách bảo mật của
        Lingora.
      </p>
    </div>
  );
}

/** Logo Google, vẽ tay theo đúng bốn màu thương hiệu. */
function GoogleMark() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
      <path
        fill="#4285F4"
        d="M21.6 12.2c0-.7-.1-1.4-.2-2H12v3.9h5.4a4.6 4.6 0 0 1-2 3v2.5h3.2c1.9-1.7 3-4.3 3-7.4z"
      />
      <path
        fill="#34A853"
        d="M12 22c2.7 0 5-.9 6.6-2.4l-3.2-2.5c-.9.6-2 1-3.4 1-2.6 0-4.8-1.8-5.6-4.1H3.1v2.6A10 10 0 0 0 12 22z"
      />
      <path fill="#FBBC05" d="M6.4 14a6 6 0 0 1 0-3.9V7.5H3.1a10 10 0 0 0 0 9z" />
      <path
        fill="#EA4335"
        d="M12 6c1.5 0 2.8.5 3.8 1.5l2.8-2.8A10 10 0 0 0 3.1 7.5l3.3 2.6C7.2 7.8 9.4 6 12 6z"
      />
    </svg>
  );
}

function Field({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error: string | undefined;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={id} className="text-[13px] font-semibold">
        {label}
      </Label>
      {children}
      {error ? <p className="text-danger text-[13px]">{error}</p> : null}
    </div>
  );
}
