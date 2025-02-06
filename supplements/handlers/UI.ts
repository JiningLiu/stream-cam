// ****************************************************************
// stream-cam server supplement - handlers
// UI
// ****************************************************************

export async function respond(path: string): Promise<Response> {
  const file = await Bun.file(`./ui${path}`);
  const ext = path.split(".").pop();

  if (await file.exists()) {
    return new Response(file, {
      status: 200,
      headers: { "Access-Control-Allow-Origin": "*" },
    });
  }

  return new Response("404 Not Found", { status: 404 });
}
