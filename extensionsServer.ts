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

import { $, env, serve, sleep } from "bun";

const port = env.PORT || 6400;
const force =
  env.FORCE == "TRUE" ? true : env.FORCE == "FALSE" ? false : undefined;
const isMac = env.MAC == "TRUE" ? true : env.FORCE == "MAC" ? false : undefined;

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
      if (isMac == true) {
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

      if (req.method === "POST") {
        const path = new URL(req.url).pathname;
        // VERY TEMPORARY FOR ONE EXTENSION ONLY
        (async () => {
          await $`PORT=6401 bun ./extensions${path}`;
        })();
        return new Response("200 OK", {
          status: 200,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST",
          },
        });
      }

      return new Response("404 Not Found", { status: 404 });
    },
  });
}
