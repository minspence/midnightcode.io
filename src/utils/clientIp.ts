/**
 * Best-effort client IP that a visitor cannot spoof.
 *
 * A client can send any `x-forwarded-for` it likes, and most proxies APPEND the
 * real address to it. So the leftmost entry is attacker-controlled; the
 * entries added by YOUR proxies sit at the right.
 *
 * Config (server-only env vars):
 * - CLIENT_IP_HEADER:   a header your proxy sets authoritatively, e.g.
 *                       "x-real-ip" or "cf-connecting-ip". Only set this if
 *                       your host always overwrites it, otherwise it is spoofable.
 * - TRUSTED_PROXY_COUNT: number of proxies in front of the app (default 1).
 *                       The client IP is the Nth entry from the right of
 *                       x-forwarded-for.
 */
export function getClientIp(headers: Headers): string {
  const custom = process.env.CLIENT_IP_HEADER?.trim().toLowerCase();
  if (custom) {
    const value = headers.get(custom)?.trim();
    if (value) return value;
  }

  const parsed = Number.parseInt(process.env.TRUSTED_PROXY_COUNT ?? "1", 10);
  const proxies = Number.isInteger(parsed) && parsed > 0 ? parsed : 1;

  const hops = (headers.get("x-forwarded-for") ?? "")
    .split(",")
    .map((hop) => hop.trim())
    .filter(Boolean);

  if (hops.length > 0) {
    // Fewer hops than trusted proxies: fall back to the leftmost entry.
    return hops[Math.max(0, hops.length - proxies)];
  }

  return headers.get("x-real-ip")?.trim() || "unknown";
}
