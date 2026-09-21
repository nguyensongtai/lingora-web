import { THEME_STORAGE_KEY } from "../theme";

/**
 * Đặt class "dark" ngay trước lần vẽ đầu tiên. Không có bước này thì trang luôn
 * chớp nền sáng một nhịp rồi mới tối, vì React chỉ chạy sau khi HTML đã vẽ.
 *
 * Script phải là chuỗi tĩnh: đây là Server Component, không có runtime nào khác
 * đọc được localStorage thay nó.
 */
export function ThemeScript() {
  const source = `try{var t=localStorage.getItem(${JSON.stringify(THEME_STORAGE_KEY)});if(t==="dark"||(t===null&&matchMedia("(prefers-color-scheme: dark)").matches))document.documentElement.classList.add("dark")}catch(e){}`;

  return <script dangerouslySetInnerHTML={{ __html: source }} />;
}
