// ****************************************************************
// stream-cam server supplement - handlers
// Statics
// ****************************************************************

import { file } from "bun";

export abstract class Statics {
  static async mediamtxYml(): Promise<Response> {
    const yml = file("mediamtx.yml");

    if (await yml.exists()) {
      return new Response(yml, {
        headers: {
          "Content-Type": "text/yaml",
        },
      });
    }

    return new Response("mediamtx.yml not found", {
      status: 404,
    });
  }
}
