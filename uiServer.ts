// ****************************************************************
// stream-cam
// Live stream camera system based on the Raspberry Pi 5 and Camera Module 3.
//
// UI server
//
// Open source information to come.
// © 2024-2025 Jining Liu, FTC Team 20240 Slingshot, and contributors. All rights reserved.
//
// A free & (planned) open source project created by Jining Liu.
// ****************************************************************

import { $, env, serve, sleep } from "bun";

import { respond } from "./supplements/handlers/UI";

const port = env.PORT || 80;
const force =
  env.FORCE == "TRUE" ? true : env.FORCE == "FALSE" ? false : undefined;

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
      await $`sudo fuser -k ${port}/tcp`;
      // await $`lsof -i tcp:${port} | awk 'NR!=1 {print $2}' | xargs -r kill`;
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
      const url = new URL(req.url);
      let path = url.pathname;
      if (path === "/") path = "/index.html";
      if (!path.includes(".")) {
        path = `${path}.html`;
      }
      return respond(path);
    },
  });
}
