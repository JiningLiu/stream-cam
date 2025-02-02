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

import { $, serve } from "bun";

import { CameraSettings } from "./supplements/handlers/CameraSettings";
import { Statics } from "./supplements/handlers/Statics";

await $`lsof -i tcp:20240 | awk 'NR!=1 {print $2}' | xargs kill`;

const server = serve({
  port: 20240,

  async fetch(req) {
    const url = new URL(req.url);

    // Static files & assets
    if (req.method === "GET") return getHandler(req, url.pathname);

    // POST requests
    if (req.method === "POST") return postHandler(req, url.pathname);

    return new Response("404 Not Found", { status: 404 });
  },
});

// MARK: GET requst handlers
async function getHandler(req: Request, path: string): Promise<Response> {
  switch (path) {
    case "/mediamtx.yml":
      return await Statics.mediamtxYml();
    case "/camera/settings/get":
      return await CameraSettings.get(req);
    case "/camera/settings/current":
      return await CameraSettings.current();
    default:
      return new Response("404 Not Found", { status: 404 });
  }
}

// MARK: POST requst handlers
async function postHandler(req: Request, path: string): Promise<Response> {
  switch (path) {
    case "/camera/settings/add":
      return await CameraSettings.add(req);
    case "/camera/settings/set":
      return await CameraSettings.set(req);
    default:
      return new Response("404 Not Found", { status: 404 });
  }
}
