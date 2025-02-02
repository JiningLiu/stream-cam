// ****************************************************************
// stream-cam server supplement - handlers
// CameraSettings
// ****************************************************************

import { file, write } from "bun";
import YAML from "yaml";

import {
  CameraSettings as Settings,
  conformsCameraSettings,
  MediaMTXConfig,
  conformsMediaMTXConfig,
} from "../data/CameraSettings";
import { Log } from "../debug/Log";

const dflt = YAML.parse(
  await file("./mediamtx/default.yml").text()
) as MediaMTXConfig;

export class CameraSettings {
  // MARK: External

  async get(req: Request): Promise<Response> {
    const data = await new URLSearchParams(req.url.split("?")[1]).get("id");

    const settings = this._settings.find((settings) => settings.id === data);

    if (settings) {
      return new Response(JSON.stringify(settings), { status: 200 });
    }

    return new Response("404 Not Found", { status: 404 });
  }

  async current(): Promise<Response> {
    const settings = this._settings.find(
      (settings) => settings.id === this._current
    );

    if (settings) {
      return new Response(JSON.stringify(settings), { status: 200 });
    }

    return new Response("404 Not Found", { status: 404 });
  }

  async add(req: Request): Promise<Response> {
    const data = await req.json();

    if (conformsCameraSettings(data)) {
      this.addSettings(data);
      return new Response("200 OK", { status: 200 });
    }

    return new Response("400 Bad Request", { status: 400 });
  }

  async set(req: Request): Promise<Response> {
    const data = await req.text();

    if (await this.setSettings(data)) {
      return new Response("200 OK", { status: 200 });
    }

    return new Response("400 Bad Request", { status: 400 });
  }

  // MARK: Internal

  private _settings: Settings[] = [];
  private _current?: string;

  private get settings(): Settings[] {
    return this._settings;
  }

  private get currentSettings(): Settings | undefined {
    return this._settings.find((settings) => settings.id === this._current);
  }

  private addSettings(settings: Settings): void {
    this._settings.push(settings);
  }

  private removeSettings(id: string): void {
    this._settings = this._settings.filter((settings) => settings.id !== id);
  }

  private updateSettings(id: string, newSettings: Settings): void {
    const index = this._settings.findIndex((settings) => settings.id === id);

    if (index !== -1) {
      this._settings[index] = newSettings;
    }
  }

  private async setSettings(id: string): Promise<boolean> {
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

        await write(file("./mediamtx.yml"), save);
        if ((await file("./mediamtx.yml").text()) === save) {
          this._current = id;
          return true;
        }
      }
    }

    return false;
  }
}
