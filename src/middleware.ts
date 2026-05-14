import { NextResponse, type NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

const intl = createMiddleware(routing);

export default function middleware(req: NextRequest) {
  const response = intl(req);

  // 307/308 redirect: ingen body å rendre, returner uendret.
  if (response.headers.get("location")) {
    return response;
  }

  // Bygg ny response med request-headers utvidet med x-pathname,
  // slik at app-router layout kan lese original sti via headers().
  // Bruker NextResponse.rewrite/next med { request: { headers } } i stedet
  // for å mutere intl-responsens x-middleware-override-headers — sistnevnte
  // dropper rewrite-direktivet i Next 15.1.
  const newHeaders = new Headers(req.headers);
  newHeaders.set("x-pathname", req.nextUrl.pathname);

  const rewriteTarget = response.headers.get("x-middleware-rewrite");
  const wrapped = rewriteTarget
    ? NextResponse.rewrite(rewriteTarget, { request: { headers: newHeaders } })
    : NextResponse.next({ request: { headers: newHeaders } });

  // Kopier intl sine response-headers (Set-Cookie, Link/hreflang, Vary)
  // uten å overstyre framework-internals vi nettopp satte.
  response.headers.forEach((value, key) => {
    const lk = key.toLowerCase();
    if (lk === "x-middleware-rewrite") return;
    if (lk.startsWith("x-middleware-")) return;
    if (lk === "content-length" || lk === "content-type") return;
    wrapped.headers.set(key, value);
  });

  return wrapped;
}

export const config = {
  matcher: "/((?!api|admin|_next|_vercel|.*\\..*).*)",
};
