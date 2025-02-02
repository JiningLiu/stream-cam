// ****************************************************************
// stream-cam server supplement - debug
// Log
// ****************************************************************

import { env } from "bun";

const debug = env.ENVIRONMENT === "DEVELOPMENT";

export abstract class Log {

  // MARK: Production

  static print(message: string): void {
    console.log(message);
  }

  static warn(message: string): void {
    console.warn(message);
  }

  static error(message: string): void {
    console.error(message);
  }

  static info(message: string): void {
    console.info(message);
  }

  // MARK: Development

  static debug(message: string): void {
    if (debug) {
      console.debug(message);
    }
  }

  static debugWarn(message: string): void {
    if (debug) {
      console.warn(message);
    }
  }

  static debugError(message: string): void {
    if (debug) {
      console.error(message);
    }
  }
}
