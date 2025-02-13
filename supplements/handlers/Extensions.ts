// ****************************************************************
// stream-cam server supplement - handlers
// Extensions
// ****************************************************************

export async function respond(path: string): Promise<Response> {
  const file = await Bun.file(
    `./extensions${path}${path.endsWith("/") ? "index.html" : ""}`
  );

  if (await file.exists()) {
    return new Response(file, {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET",
      },
    });
  }

  return new Response("404 Not Found", {
    status: 404,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    },
  });
}
