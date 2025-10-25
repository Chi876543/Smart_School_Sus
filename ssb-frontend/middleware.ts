// dùng để bảo vệ các route cần đăng nhập


// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/** đổi tên cookie nếu backend của bạn đặt khác */
const TOKEN_COOKIE = "access_token";

// các đường dẫn không cần kiểm tra (public routes)
const PUBLIC_PATHS = ["/login", "/_next", "/public", "/favicon.ico"];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // bỏ qua các tài nguyên tĩnh & public
  const isPublic = PUBLIC_PATHS.some((p) => pathname.startsWith(p));
  // nếu bạn có API mock trong Next.js, bỏ qua luôn:
  const isNextApi = pathname.startsWith("/api");

  if (isPublic || isNextApi) return NextResponse.next();

  const token = req.cookies.get(TOKEN_COOKIE)?.value;

  const isDashboard = pathname.startsWith("/dashboard");
  const isLogin = pathname.startsWith("/login");

  // Chưa đăng nhập mà vào khu vực cần bảo vệ
  if (!token && isDashboard) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", pathname); // để login xong quay lại
    return NextResponse.redirect(url);
  }

  // Đã đăng nhập mà vẫn vào /login → chuyển sang /dashboard
  if (token && isLogin) {
    const url = req.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

/**
 * Matcher chỉ áp dụng middleware cho các route cần thiết,
 * tránh động vào file tĩnh và asset của Next.js.
 */
export const config = {
  matcher: [
    // bảo vệ toàn bộ khu vực /dashboard/**
    "/dashboard/:path*",
    // và trang /login để xử lý chuyển hướng khi đã đăng nhập
    "/login",
  ],
};
