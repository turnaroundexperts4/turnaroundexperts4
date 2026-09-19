import { NextResponse, type NextRequest } from "next/server";

const ADMIN_HOST = (
  process.env.ADMIN_DASHBOARD_HOST ?? "dashboard.admin.example.com"
).toLowerCase();

function requestHost(request: NextRequest) {
  return (
    request.headers.get("host") ??
    request.headers.get("x-forwarded-host") ??
    ""
  )
    .split(",")[0]
    .trim()
    .toLowerCase()
    .split(":")[0];
}

export function middleware(request: NextRequest) {
  const host = requestHost(request);
  const isAdminHost = host === ADMIN_HOST;
  const pathname = request.nextUrl.pathname;
  const isAdminPath = pathname === "/admin" || pathname.startsWith("/admin/");

  if (isAdminPath && !isAdminHost) {
    return new NextResponse(null, { status: 404 });
  }

  if (isAdminHost && pathname === "/") {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/dashboard";
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/admin/:path*"],
};
