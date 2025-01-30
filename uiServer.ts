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

import { $ } from "bun";

await $`lsof -i tcp:80 | awk 'NR!=1 {print $2}' | xargs kill`;

const ui = Bun.serve({
  port: 80,
  async fetch(req) {
    const serverRes = await fetch("http://localhost:20240").then((res) =>
      res.text()
    );

    return new Response(
      `stream-cam development: ui\n\n****************************************************************\n\nserver response:\n\n${serverRes}`
    );
  },
});
