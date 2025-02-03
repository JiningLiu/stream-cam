// ****************************************************************
// stream-cam server supplement - handlers
// UI
// ****************************************************************

export async function respond(path: string): Promise<Response> {
  const file = await Bun.file(`./ui${path}`);
  const ext = path.split(".").pop();

  if (await file.exists()) {
    const mimeType =
      MIMEType[ext as keyof typeof MIMEType] || "application/octet-stream";

    return new Response(await file.text(), {
      status: 200,
      headers: {
        "Content-Type": mimeType,
      },
    });
  }

  return new Response("404 Not Found", { status: 404 });
}

enum MIMEType {
  html = "text/html",
  css = "text/css",
  js = "text/javascript",
  json = "application/json",
  png = "image/png",
  jpg = "image/jpeg",
  jpeg = "image/jpeg",
  svg = "image/svg+xml",
  ico = "image/x-icon",
}