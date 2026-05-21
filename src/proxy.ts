import { NextRequest, NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

const intl = createMiddleware(routing);

function normalizeForwardedHeaders(req: NextRequest) {
  const headers = new Headers(req.headers);
  const forwardedHost = headers.get("x-forwarded-host");
  const host = headers.get("host");
  const publicHost = forwardedHost ?? host;

  if (!publicHost) {
    return req;
  }

  const cleanHost = publicHost.replace(/:3838$/, "");
  const isPublicTspHost =
    cleanHost === "truststandardprotocol.com" ||
    cleanHost === "www.truststandardprotocol.com" ||
    cleanHost === "truststandardprotocol.org" ||
    cleanHost === "tsp.lexico.no";

  if (!isPublicTspHost) {
    return req;
  }

  headers.set("host", cleanHost);
  headers.set("x-forwarded-host", cleanHost);
  headers.set("x-forwarded-proto", "https");
  headers.delete("x-forwarded-port");

  return new NextRequest(req.url, {
    headers,
    method: req.method,
  });
}

export function proxy(req: NextRequest) {
  const normalizedReq = normalizeForwardedHeaders(req);

  // Localized routing uses localePrefix: "as-needed": Norwegian is served at
  // unprefixed URLs, while English is served under /en. Route the root directly
  // to the default-locale segment so / cannot inherit a stale locale redirect
  // cookie and loop between / and the internal /no rewrite target.
  if (normalizedReq.nextUrl.pathname === "/") {
    const newHeaders = new Headers(normalizedReq.headers);
    newHeaders.set("x-pathname", normalizedReq.nextUrl.pathname);

    const rewriteUrl = new URL("/no", normalizedReq.url);
    const wrapped = NextResponse.rewrite(rewriteUrl, { request: { headers: newHeaders } });
    wrapped.cookies.set("NEXT_LOCALE", routing.defaultLocale, { path: "/", sameSite: "lax" });
    return wrapped;
  }

  const response = intl(normalizedReq);

  const rewriteTarget = response.headers.get("x-middleware-rewrite");

  // 307/308 redirect: ingen body å rendre, returner uendret.
  // Next-intl kan sette både x-middleware-rewrite og location for default-locale
  // rewrites under localePrefix: "as-needed". Behandle slike som rewrites,
  // ellers kan / ende i en location: / redirect-loop i local/proxy runtime.
  if (response.headers.get("location") && !rewriteTarget) {
    return response;
  }

  // Bygg ny response med request-headers utvidet med x-pathname,
  // slik at app-router layout kan lese original sti via headers().
  // Bruker NextResponse.rewrite/next med { request: { headers } } i stedet
  // for å mutere intl-responsens x-middleware-override-headers — sistnevnte
  // dropper rewrite-direktivet i Next 15.1.
  const newHeaders = new Headers(normalizedReq.headers);
  newHeaders.set("x-pathname", normalizedReq.nextUrl.pathname);

  const wrapped = rewriteTarget
    ? NextResponse.rewrite(rewriteTarget, { request: { headers: newHeaders } })
    : NextResponse.next({ request: { headers: newHeaders } });

  // Kopier intl sine response-headers (Set-Cookie, Link/hreflang, Vary)
  // uten å overstyre framework-internals vi nettopp satte.
  response.headers.forEach((value, key) => {
    const lk = key.toLowerCase();
    if (lk === "x-middleware-rewrite") return;
    if (rewriteTarget && lk === "location") return;
    if (lk.startsWith("x-middleware-")) return;
    if (lk === "content-length" || lk === "content-type") return;
    wrapped.headers.set(key, value);
  });

  return wrapped;
}

export const config = {
  matcher: "/((?!api|admin|_next|_vercel|no(?:/|$)|.*\\..*).*)",
};
