const ALLOWED_ORIGIN = "https://bitlifeonline.github.io"
const ALLOWED_PATH = "/capybara-clicker/"

export default {
  async fetch(request) {
    const url = new URL(request.url)
    const target = decodeURIComponent(url.pathname.slice(1))

    // No target provided
    if (!target.startsWith("http")) {
      return new Response("Missing or invalid URL", { status: 400 })
    }

    const targetUrl = new URL(target)

    // HARD LOCK
    if (
      targetUrl.origin !== ALLOWED_ORIGIN ||
      !targetUrl.pathname.startsWith(ALLOWED_PATH)
    ) {
      return new Response("Access denied", { status: 403 })
    }

    const resp = await fetch(targetUrl.toString(), {
      headers: {
        "User-Agent": request.headers.get("User-Agent") || "Mozilla/5.0"
      }
    })

    const headers = new Headers(resp.headers)
    headers.delete("X-Frame-Options")
    headers.delete("Content-Security-Policy")

    return new Response(resp.body, {
      status: resp.status,
      headers
    })
  }
}
