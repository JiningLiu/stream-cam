// ****************************************************************
// stream-cam server supplement - handlers
// CameraSettings
// ****************************************************************

import { $, sleep } from "bun";

import { Log } from "../debug/Log";

export abstract class System {
  static async restart(): Promise<Response> {
    (async () => {
      await sleep(1);
      try {
        await $`restart`;
      } catch {}
    })();
    return new Response("200 OK", {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST",
      },
    });
  }

  static async reboot(): Promise<Response> {
    (async () => {
      await sleep(1);
      try {
        await $`sudo reboot`;
      } catch {}
    })();
    return new Response("200 OK", {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST",
      },
    });
  }

  static async shutdown(): Promise<Response> {
    (async () => {
      await sleep(1);
      try {
        await $`sudo shutdown -h now`;
      } catch {}
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
