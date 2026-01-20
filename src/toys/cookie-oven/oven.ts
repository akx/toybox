interface ParsedCookie {
  name: string;
  value: string;
}

export interface CookieTxtOptions {
  domain: string;
  includeSubdomains: boolean;
  path: string;
  secure: boolean;
  expiration: number;
}

export function parseCookieHeader(header: string): readonly ParsedCookie[] {
  const cookies: ParsedCookie[] = [];
  if (!header.trim()) return cookies;

  // Remove "Cookie:" prefix if present
  let cookieString = header.trim();
  if (cookieString.toLowerCase().startsWith("cookie:")) {
    cookieString = cookieString.slice(7).trim();
  }

  const pairs = cookieString.split(/;\s*/);
  for (const pair of pairs) {
    const eqIndex = pair.indexOf("=");
    if (eqIndex === -1) continue;
    const name = pair.slice(0, eqIndex).trim();
    const value = pair.slice(eqIndex + 1).trim();
    if (name) {
      cookies.push({ name, value });
    }
  }
  return cookies;
}

export function formatCookieTxt(
  cookies: readonly ParsedCookie[],
  { domain, expiration, includeSubdomains, path, secure }: CookieTxtOptions,
): string {
  const lines = cookies.map((cookie) =>
    [
      domain,
      includeSubdomains ? "TRUE" : "FALSE",
      path,
      secure ? "TRUE" : "FALSE",
      String(expiration),
      cookie.name,
      cookie.value,
    ].join("\t"),
  );
  if (lines.length > 0) {
    lines.unshift("# Netscape HTTP Cookie File");
  }
  return lines.join("\n");
}
