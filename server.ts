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

import { $, env, serve, sleep } from "bun";

import { System } from "./supplements/handlers/System";
import { Camera } from "./supplements/handlers/Camera";
import { Statics } from "./supplements/handlers/Statics";

const port = env.PORT || 20240;
const force =
  env.FORCE == "TRUE" ? true : env.FORCE == "FALSE" ? false : undefined;

try {
  const result = await $`lsof -i :${port}`;
  if (result.stdout.toString().trim().length > 0) {
    let kill = false;
    kill = force == true;

    if (!kill && force == undefined) {
      kill =
        prompt(`Port ${port} is already in use. Kill the process? (y/N)`) ===
        "y";
    }

    if (kill) {
      // await $`sudo fuser -k ${port}/tcp`;
      await $`lsof -i tcp:${port} | awk 'NR!=1 {print $2}' | xargs -r kill`;
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

      // Static files & assets
      if (req.method === "GET") return getHandler(req, url.pathname);

      // POST requests
      if (req.method === "POST") return postHandler(req, url.pathname);

      // PUT requests
      if (req.method === "PUT") return putHandler(req, url.pathname);

      // DELETE requests
      if (req.method === "DELETE") return deleteHandler(req, url.pathname);

      return new Response("404 Not Found", { status: 404 });
    },
  });

  // MARK: GET requst handlers
  async function getHandler(req: Request, path: string): Promise<Response> {
    switch (path) {
      case "/camera/status":
        return await Camera.status();
      case "/camera/settings/get":
        return await Camera.getConfigs(req);
      case "/camera/settings/current":
        return await Camera.currentConfigs();
      case "/mediamtx.yml":
        return await Statics.mediamtxYml();
      default:
        return new Response("404 Not Found", { status: 404 });
    }
  }

  // MARK: POST requst handlers
  async function postHandler(req: Request, path: string): Promise<Response> {
    switch (path) {
      case "/camera/on":
        return await Camera.turnOn();
      case "/camera/off":
        return await Camera.turnOff();
      case "/camera/settings/add":
        return await Camera.addConfigs(req);
      case "/camera/settings/set":
        return await Camera.setConfigs(req);
      default:
        return new Response("404 Not Found", { status: 404 });
    }
  }

  // MARK: PUT requst handlers
  async function putHandler(req: Request, path: string): Promise<Response> {
    switch (path) {
      case "/camera/settings/update":
        return await Camera.updateConfigs(req);
      default:
        return new Response("404 Not Found", { status: 404 });
    }
  }

  // MARK: DELETE requst handlers
  async function deleteHandler(req: Request, path: string): Promise<Response> {
    switch (path) {
      case "/camera/settings/delete":
        return await Camera.deleteConfigs(req);
      default:
        return new Response("404 Not Found", { status: 404 });
    }
  }
}
