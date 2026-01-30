const ALLOWED_ORIGIN = "https://bitlifeonline.github.io";
const ALLOWED_PATH = "/capybara-clicker/";
const SECRET = "CHANGE_THIS_SECRET"; // MUST match index.html

function isValidToken(token) {
  if (!token) return false;

  const parts = token.split(".");
  if (parts.length !== 2) return false;

  const [timestamp, sig] = parts;
  const ts = Number(timestamp);
  if (!ts) return false;

  const now = Math.floor(Date.now() / 1000);

  // Token expires after 60 seconds
  if (now - ts > 60) return false;

  const expected = btoa(timestamp + SECRET);
  return sig === expected;
}

export default {
  async fetch(request) {
    const url = new URL(request.url);
    const token = url.searchParams.get("token");

    if (!isValidToken(token)) {
      return new Response("Ad required", { status: 403 });
    }

    const target = decodeURIComponent(url.pathname.slice(1));
    if (!target.startsWith("http")) {
      return new Response("Missing target", { status: 400 });
    }

    const targetUrl = new URL(target);

    // HARD LOCK: only Capybara Clicker
    if (
      targetUrl.origin !== ALLOWED_ORIGIN ||
      !targetUrl.pathname.startsWith(ALLOWED_PATH)
    ) {
      return new Response("Blocked", { status: 403 });
    }

    const resp = await fetch(targetUrl.toString(), {
      headers: {
        "User-Agent": request.headers.get("User-Agent") || "Mozilla/5.0"
      }
    });

    const headers = new Headers(resp.headers);
    headers.delete("X-Frame-Options");
    headers.delete("Content-Security-Policy");

    return new Response(resp.body, {
      status: resp.status,
      headers
    });
  }
};
