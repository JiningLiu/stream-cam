// ****************************************************************
// stream-cam
// Live stream camera system based on the Raspberry Pi 5 and Camera Module 3.
//
// Extensions server
//
// Open source information to come.
// © 2024-2025 Jining Liu, FTC Team 20240 Slingshot, and contributors. All rights reserved.
//
// A free & (planned) open source project created by Jining Liu.
// ****************************************************************

import { $, env, serve, sleep, file } from "bun";

const port = env.PORT || 6400;
const force =
  env.FORCE == "TRUE" ? true : env.FORCE == "FALSE" ? false : undefined;
const isMac = env.MAC == "TRUE";

try {
  const result = await $`sudo lsof -ti :${port}`;
  if (result.stdout.toString().trim().length > 0) {
    let kill = false;
    kill = force == true;

    if (!kill && force == undefined) {
      kill =
        prompt(`Port ${port} is already in use. Kill the process? (y/N)`) ===
        "y";
    }

    if (kill) {
      if (isMac) {
        await $`lsof -i tcp:${port} | awk 'NR!=1 {print $2}' | xargs -r kill`;
      } else {
        await $`sudo fuser -k ${port}/tcp`;
      }
      await sleep(1);
    } else {
      process.exit(1);
    }
  }
} catch {
} finally {
  const extensions = await file("./extensions/extensions.json").json();

  const server = serve({
    port: port,
    async fetch(req) {
      if (req.method === "OPTIONS") {
        return new Response(null, {
          status: 204,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
          },
        });
      }

      const url = new URL(req.url);

      // GET requests
      if (req.method === "GET") return getHandler(req, url.pathname);

      // POST requests
      if (req.method === "POST") return postHandler(req, url.pathname);

      // PUT requests
      if (req.method === "PUT") return putHandler(req, url.pathname);

      return new Response("404 Not Found", { status: 404 });
    },
  });

  // MARK: GET requst handlers
  async function getHandler(req: Request, path: string): Promise<Response> {
    switch (path) {
      case "/all":
        return new Response(JSON.stringify(extensions), {
          status: 200,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET",
          },
        });
      default:
        let extension = path;

        if (path.startsWith("/status")) {
          extension = path.replace("/status", "");
        }

        const config = await file(`./extensions${extension}/config.json`);

        if (await config.exists()) {
          const json = await config.json();
          const port = json["port"];

          if (path.startsWith("/status")) {
            let extensionLength = 0;

            try {
              const status = isMac
                ? await $`lsof -i :${port}`
                : await $`ps -C bun -o cmd | grep "${extension}" | grep -v grep || echo ""`;
              extensionLength = status.stdout.toString().trim().length;
            } catch (error) {
              console.error(`Error checking process status: ${error}`);
              extensionLength = 0;
            }

            const status = {
              isOn: extensionLength > 0,
            };

            return new Response(JSON.stringify(status), {
              status: 200,
              headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET",
              },
            });
          }

          return new Response(JSON.stringify(json), {
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
  }

  // MARK: POST requst handlers
  async function postHandler(req: Request, path: string): Promise<Response> {
    let extension = path;

    if (path.startsWith("/toggle")) {
      extension = path.replace("/toggle", "");

      const config = await file(`./extensions${extension}/config.json`);

      if (await config.exists()) {
        const json = await config.json();
        const port = json["port"];

        if (port && port > 6400 && port < 6500) {
          let extensionLength = 0;

          try {
            const status = isMac
              ? await $`lsof -i :${port}`
              : await $`ps -C bun -o cmd | grep "${extension}" | grep -v grep || echo ""`;
            extensionLength = status.stdout.toString().trim().length;
          } catch (error) {
            console.error(`Error checking process status: ${error}`);
            extensionLength = 0;
          }

          (async () => {
            if (extensionLength <= 0) {
              await $`PORT=${port} bun ./extensions${extension}`;
            } else {
              if (isMac) {
                await $`lsof -i tcp:${port} | awk 'NR!=1 {print $2}' | xargs -r kill`;
              } else {
                await $`sudo fuser -k ${port}/tcp`;
              }
            }
          })();

          return new Response("200 OK", {
            status: 200,
            headers: {
              "Access-Control-Allow-Origin": "*",
              "Access-Control-Allow-Methods": "POST",
            },
          });
        }
      }
    }

    return new Response("400 Bad Request", {
      status: 400,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      },
    });
  }
}

// MARK: PUT requst handlers
async function putHandler(req: Request, path: string): Promise<Response> {
  const config = await file(`./extensions${path}/config.json`);

  if (await config.exists()) {
    // todo: update the jsawns (jsons get it haha im so not funny)

    return new Response("200 OK", {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "PUT",
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
