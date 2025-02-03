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

import { $, env } from "bun";

import { respond } from "./supplements/handlers/UI";

const port = env.PORT || 80;

try {
  const result = await $`lsof -i :${port}`;
  if (result.stdout.toString().trim().length > 0) {
    if (
      prompt(`Port ${port} is already in use. Kill the process? (y/n)`) === "y"
    ) {
      await $`sudo fuser -k ${port}/tcp`;
    } else {
      process.exit(1);
    }
  }
} catch {
} finally {
  const server = Bun.serve({
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
