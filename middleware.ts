import { NextResponse, type NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  if (request.method === "OPTIONS") {
    const headers = new Headers(request.headers);

    headers.set(
      "Access-Control-Allow-Origin",
      request.headers.get("origin") || "*"
    );
    headers.set(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, OPTIONS"
    );
    headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
    headers.set("Access-Control-Max-Age", "86400");

    // Отвечаем на OPTIONS и прекращаем дальнейшую обработку.
    return new NextResponse(null, { headers });
  }

  // Для всех остальных запросов (POST и др.) просто добавляем заголовок к ИСХОДЯЩЕМУ ответу.
  // Сначала получаем ответ от роута.
  const response = NextResponse.next();

  response.headers.set(
    "Access-Control-Allow-Origin",
    request.headers.get("origin") || "*"
  );

  return response;
}

export const config = {
  matcher: "/api/:path*",
};
