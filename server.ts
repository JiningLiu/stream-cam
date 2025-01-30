// ****************************************************************
// stream-cam
// Live stream camera system based on the Raspberry Pi 5 and Camera Module 3.
//
// Backend server
//
// Open source information to come.
// © 2024-2025 Jining Liu, FTC Team 20240 Slingshot, and contributors. All rights reserved.
//
// A free & (planned) open source project created by Jining Liu.
// ****************************************************************

import { $ } from "bun";

import { CameraSettings } from "./supplements/CameraSettings";

await $`lsof -i tcp:20240 | awk 'NR!=1 {print $2}' | xargs kill`;

const server = Bun.serve({
  port: 20240,
  fetch(req) {
    return new Response(
      `CameraSettings: ${JSON.stringify(new CameraSettings())}`
    );
  },
});
