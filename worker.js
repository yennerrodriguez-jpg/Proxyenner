export default {
  async fetch(request) {
    const url = new URL(request.url)
    const target = url.pathname.slice(1)

    if (!target) {
      return new Response("Missing URL", { status: 400 })
    }

    const resp = await fetch(target, {
      headers: {
        "User-Agent": request.headers.get("User-Agent") || "Mozilla/5.0"
      }
    })

    const newHeaders = new Headers(resp.headers)
    newHeaders.delete("X-Frame-Options")
    newHeaders.delete("Content-Security-Policy")

    return new Response(resp.body, {
      status: resp.status,
      headers: newHeaders
    })
  }
}
