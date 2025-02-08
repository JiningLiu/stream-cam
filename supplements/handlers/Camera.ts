// ****************************************************************
// stream-cam server supplement - handlers
// CameraSettings
// ****************************************************************

import { $, file, sleep, write } from "bun";
import YAML from "yaml";

import {
  CameraSettings as Settings,
  conformsCameraSettings,
  MediaMTXConfig,
  conformsMediaMTXConfig,
} from "../data/CameraSettings";
import { Log } from "../debug/Log";

const dflt = YAML.parse(
  await file("./mediamtx/config/default.yml").text()
) as MediaMTXConfig;

const existing = await file("./mediamtx/config/settings.json").json();
const currentId = await file("./mediamtx/config/current.txt").text();

export abstract class Camera {
  private static _camOn: boolean = false;
  private static _micOn: boolean = false;

  private static _settings: Settings[] = existing;
  private static _current?: string =
    currentId.length > 0 ? currentId : undefined;

  // MARK: External

  static async status(): Promise<Response> {
    let mediamtxLength = 0;
    let audiosourceLength = 0;

    try {
      const mediamtx = await $`pgrep -f "mediamtx"`;
      mediamtxLength = mediamtx.stdout.toString().trim().length;
      const audiosource = await $`pgrep -f "audiosource"`;
      audiosourceLength = audiosource.stdout.toString().trim().length;
    } catch {}

    this._camOn = mediamtxLength > 0;
    this._micOn = audiosourceLength > 0;

    const status = {
      mediamtx: this._camOn,
      audiosource: this._micOn,
    };

    return new Response(JSON.stringify(status), {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET",
      },
    });
  }

  static async turnOn(): Promise<Response> {
    (async () => {
      try {
        await $`cam on`;
      } catch {}
    })();
    await sleep(0.8);
    return await this.status();
  }

  static async turnOff(): Promise<Response> {
    try {
      await $`cam off`;
    } catch {}
    await sleep(0.8);
    return await this.status();
  }

  static async getAllConfigs(): Promise<Response> {
    return new Response(JSON.stringify(this._settings), {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET",
      },
    });
  }

  static async getConfigs(req: Request): Promise<Response> {
    const data = await new URLSearchParams(req.url.split("?")[1]).get("id");

    const settings = this._settings.find((settings) => settings.id === data);

    if (settings) {
      return new Response(JSON.stringify(settings), {
        status: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET",
        },
      });
    }

    return new Response("404 Not Found", {
      status: 404,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      },
    });
  }

  static async currentConfigs(): Promise<Response> {
    const settings = this.currentSettings;

    if (settings) {
      return new Response(JSON.stringify(settings), {
        status: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET",
        },
      });
    }

    return new Response("404 Not Found", {
      status: 404,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      },
    });
  }

  static async addConfigs(req: Request): Promise<Response> {
    const data = await req.json();

    if (conformsCameraSettings(data)) {
      if (await this.addSettings(data)) {
        return new Response("200 OK", {
          status: 200,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST",
          },
        });
      }
    }

    return new Response("404 Not Found", {
      status: 404,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      },
    });
  }

  static async setConfigs(req: Request): Promise<Response> {
    const data = await req.text();

    if (await this.setSettings(data)) {
      return new Response("200 OK", {
        status: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST",
        },
      });
    }

    return new Response("404 Not Found", {
      status: 404,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      },
    });
  }

  static async updateConfigs(req: Request): Promise<Response> {
    const data = await req.json();

    if (conformsCameraSettings(data)) {
      if (await this.updateSettings(data)) {
        return new Response("200 OK", {
          status: 200,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "PUT",
          },
        });
      }
    }

    return new Response("404 Not Found", {
      status: 404,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      },
    });
  }

  static async deleteConfigs(req: Request): Promise<Response> {
    const data = await req.text();

    if (await this.removeSettings(data)) {
      return new Response("200 OK", {
        status: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "DELETE",
        },
      });
    }

    return new Response("404 Not Found", {
      status: 404,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      },
    });
  }

  // MARK: Internal

  private static get settings(): Settings[] {
    return this._settings;
  }

  private static get currentSettings(): Settings | undefined {
    return this._settings.find((settings) => settings.id === this._current);
  }

  private static async addSettings(settings: Settings): Promise<boolean> {
    this._settings.push(settings);
    return await this.saveSettings();
  }

  private static async removeSettings(id: string): Promise<boolean> {
    this._settings = this._settings.filter((settings) => settings.id !== id);
    return await this.saveSettings();
  }

  private static async updateSettings(newSettings: Settings): Promise<boolean> {
    const index = this._settings.findIndex(
      (settings) => settings.id === newSettings.id
    );

    if (index !== -1) {
      this._settings[index] = newSettings;
    }

    return await this.saveSettings();
  }

  private static async saveSettings(): Promise<boolean> {
    const save = JSON.stringify(this._settings);
    await write(file("./mediamtx/config/settings.json"), save);
    if ((await file("./mediamtx/config/settings.json").text()) === save) {
      return true;
    }

    return false;
  }

  private static async setSettings(id: string): Promise<boolean> {
    const settings = this._settings.find((settings) => settings.id === id);
    if (settings) {
      let newConfig = dflt;

      newConfig.pathDefaults.rpiCameraCamID = settings.camId;
      newConfig.pathDefaults.rpiCameraWidth = settings.width;
      newConfig.pathDefaults.rpiCameraHeight = settings.height;
      newConfig.pathDefaults.rpiCameraHFlip = settings.hFlip;
      newConfig.pathDefaults.rpiCameraVFlip = settings.vFlip;
      newConfig.pathDefaults.rpiCameraBrightness = settings.brightness;
      newConfig.pathDefaults.rpiCameraContrast = settings.contrast;
      newConfig.pathDefaults.rpiCameraSaturation = settings.saturation;
      newConfig.pathDefaults.rpiCameraSharpness = settings.sharpness;
      newConfig.pathDefaults.rpiCameraExposure = settings.exposure;
      newConfig.pathDefaults.rpiCameraAWB = settings.whiteBalance;
      newConfig.pathDefaults.rpiCameraAWBGains = `[${settings.awbGains.red}, ${settings.awbGains.blue}]`;
      newConfig.pathDefaults.rpiCameraDenoise = settings.denoise;
      newConfig.pathDefaults.rpiCameraShutter = settings.shutterSpeed;
      newConfig.pathDefaults.rpiCameraMetering = settings.metering;
      newConfig.pathDefaults.rpiCameraGain = settings.gain;
      newConfig.pathDefaults.rpiCameraEV = settings.ev;
      const roi = settings.roi;
      newConfig.pathDefaults.rpiCameraROI =
        roi == null ? null : `${roi.x},${roi.y},${roi.width},${roi.height}`;
      newConfig.pathDefaults.rpiCameraHDR = settings.hdr;
      newConfig.pathDefaults.rpiCameraTuningFile = settings.tuningFile;
      const sensorMode = settings.sensorMode;
      newConfig.pathDefaults.rpiCameraMode =
        sensorMode == null
          ? null
          : `[${sensorMode.width}]:[${sensorMode.height}]:[${sensorMode.bitDepth}]:[${sensorMode.packing}]`;
      newConfig.pathDefaults.rpiCameraFPS = settings.fps;
      newConfig.pathDefaults.rpiCameraAfMode = settings.focusMode;
      newConfig.pathDefaults.rpiCameraAfRange = settings.afRange;
      newConfig.pathDefaults.rpiCameraAfSpeed = settings.afSpeed;
      newConfig.pathDefaults.rpiCameraLensPosition = settings.mfLensPosition;
      const afWindow = settings.afWindow;
      newConfig.pathDefaults.rpiCameraAfWindow =
        afWindow == null
          ? null
          : `${afWindow.x},${afWindow.y},${afWindow.width},${afWindow.height}`;
      newConfig.pathDefaults.rpiCameraFlickerPeriod = settings.flickerPeriod;
      newConfig.pathDefaults.rpiCameraTextOverlayEnable =
        settings.textOverlayEnable;
      newConfig.pathDefaults.rpiCameraTextOverlay = settings.textOverlay;
      newConfig.pathDefaults.rpiCameraCodec = settings.codec;
      newConfig.pathDefaults.rpiCameraIDRPeriod = settings.idrPeriod;
      newConfig.pathDefaults.rpiCameraBitrate = settings.bitrate;
      newConfig.pathDefaults.rpiCameraProfile = settings.h264Profile;
      newConfig.pathDefaults.rpiCameraLevel = settings.h264Profile;

      if (conformsMediaMTXConfig(newConfig)) {
        let save = YAML.stringify(newConfig)
          .replaceAll("null", "")
          .replace(
            /rtmpEncryption:\s*(\S+)/,
            (_match, p1) => `rtmpEncryption: "${p1}"`
          )
          .replace(
            /rtspEncryption:\s*(\S+)/,
            (_match, p1) => `rtspEncryption: "${p1}"`
          )
          .replace(
            /rpiCameraDenoise:\s*(\S+)/,
            (_match, p1) => `rpiCameraDenoise: "${p1}"`
          )
          .replace(
            /rpiCameraAWBGains:\s*"(\[.*\])"/,
            (_match, p1) => `rpiCameraAWBGains: ${p1}`
          )
          .replace(
            /rpiCameraROI:\s*"(\[.*\])"/,
            (_match, p1) => `rpiCameraROI: ${p1}`
          )
          .replace(
            /rpiCameraMode:\s*"(\[.*\])"/,
            (_match, p1) => `rpiCameraMode: ${p1}`
          )
          .replace(
            /rpiCameraAfWindow:\s*"(\[.*\])"/,
            (_match, p1) => `rpiCameraAfWindow: ${p1}`
          );

        await write(file("mediamtx.yml"), save);
        await write(file("./mediamtx/config/current.txt"), id);
        if ((await file("mediamtx.yml").text()) === save) {
          this._current = id;
          if (this._camOn) {
            (async () => {
              await this.turnOff();
              await sleep(1);
              await this.turnOn();
            })();
          }
          return true;
        }
      }
    }

    return false;
  }
}
