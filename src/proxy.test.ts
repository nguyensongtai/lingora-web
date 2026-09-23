import { readdirSync } from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

import { PROTECTED_PREFIXES, config } from "./proxy";

/**
 * Mỗi thư mục route trong (app) là một màn của khu vực học, nên phải vừa nằm
 * trong PROTECTED_PREFIXES (chặn khách) vừa nằm trong matcher (để proxy chạy
 * và gia hạn token ở đó).
 *
 * /lessons từng lọt cả hai danh sách: khách mở được bài học, còn người đã đăng
 * nhập mà access token vừa hết hạn thì mất nút "Đã xong" vì không ai gia hạn.
 * Hai danh sách viết tay, nên test đọc thẳng cây thư mục thay vì tin vào trí nhớ.
 */
const appDir = path.join(__dirname, "app", "(app)");

const routeFolders = readdirSync(appDir, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => ({
    name: entry.name,
    nested: readdirSync(path.join(appDir, entry.name), { withFileTypes: true }).some(
      (child) => child.isDirectory(),
    ),
  }));

describe("proxy bảo vệ mọi màn trong (app)", () => {
  it("đọc được thư mục route", () => {
    expect(routeFolders.map((folder) => folder.name)).toContain("lessons");
  });

  it.each(routeFolders)("/$name nằm sau đăng nhập", ({ name }) => {
    expect(PROTECTED_PREFIXES).toContain(`/${name}`);
  });

  it.each(routeFolders)("/$name được matcher đi qua, kể cả route con", ({ name, nested }) => {
    const wildcard = `/${name}/:path*`;
    if (nested) {
      expect(config.matcher).toContain(wildcard);
    } else {
      expect([`/${name}`, wildcard].some((entry) => config.matcher.includes(entry))).toBe(true);
    }
  });
});
