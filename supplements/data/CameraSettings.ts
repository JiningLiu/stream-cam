// ****************************************************************
// stream-cam server supplement - data
// CameraSettings
// ****************************************************************

import { v4 as uuidv4 } from "uuid";

import { Log } from "../debug/Log";

export class CameraSettings {
  // Identification
  id: string = `${uuidv4()}-${Date.now()}`;
  name: string = "untitled settings";

  // Camera settings
  camId: number = 0;
  width: number = 1920;
  height: number = 1080;
  hFlip: boolean = true;
  vFlip: boolean = true;
  brightness: number = 0;
  contrast: number = 1;
  saturation: number = 1;
  sharpness: number = 1;
  exposure: Exposure = Exposure.normal;
  whiteBalance: WhiteBalance = WhiteBalance.auto;
  awbGains: AWBGains = new AWBGains();
  denoise: Denoise = Denoise.off;
  shutterSpeed: number = 0;
  metering: Metering = Metering.centre;
  gain: number = 0;
  ev: number = -0.3;
  roi?: ROI;
  hdr: boolean = false;
  tuningFile?: string;
  sensorMode?: SensorMode;
  fps: number = 30;
  focusMode: FocusMode = FocusMode.continuous;
  afRange: AFRange = AFRange.full;
  afSpeed: AFSpeed = AFSpeed.fast;
  mfLensPosition: number = 0;
  afWindow?: AFWindow;
  flickerPeriod: number = 0;
  textOverlayEnable: boolean = false;
  textOverlay: string = "%Y-%m-%d %H:%M:%S - stream-cam (MediaMTX)";
  codec: Codec = Codec.auto;
  idrPeriod: number = 60;
  bitrate: number = 10000000;
  h264Profile: string = "main";
  h264Level: string = "4.1";

  constructor(init?: Partial<CameraSettings>) {
    Object.assign(this, init);
  }
}

export function conformsCameraSettings(obj: any): obj is CameraSettings {
  return (
    typeof obj.id === "string" &&
    typeof obj.name === "string" &&
    typeof obj.camId === "number" &&
    typeof obj.width === "number" &&
    typeof obj.height === "number" &&
    typeof obj.hFlip === "boolean" &&
    typeof obj.vFlip === "boolean" &&
    typeof obj.brightness === "number" &&
    typeof obj.contrast === "number" &&
    typeof obj.saturation === "number" &&
    typeof obj.sharpness === "number" &&
    Object.values(Exposure).includes(obj.exposure) &&
    Object.values(WhiteBalance).includes(obj.whiteBalance) &&
    conformsAWBGains(obj.awbGains) &&
    Object.values(Denoise).includes(obj.denoise) &&
    typeof obj.shutterSpeed === "number" &&
    Object.values(Metering).includes(obj.metering) &&
    typeof obj.gain === "number" &&
    typeof obj.ev === "number" &&
    (obj.roi === undefined || conformsROI(obj.roi)) &&
    typeof obj.hdr === "boolean" &&
    (obj.tuningFile === undefined || typeof obj.tuningFile === "string") &&
    (obj.sensorMode === undefined || conformsSensorMode(obj.sensorMode)) &&
    typeof obj.fps === "number" &&
    Object.values(FocusMode).includes(obj.focusMode) &&
    Object.values(AFRange).includes(obj.afRange) &&
    Object.values(AFSpeed).includes(obj.afSpeed) &&
    typeof obj.mfLensPosition === "number" &&
    (obj.afWindow === undefined || conformsAFWindow(obj.afWindow)) &&
    typeof obj.flickerPeriod === "number" &&
    typeof obj.textOverlayEnable === "boolean" &&
    typeof obj.textOverlay === "string" &&
    Object.values(Codec).includes(obj.codec) &&
    typeof obj.idrPeriod === "number" &&
    typeof obj.bitrate === "number" &&
    typeof obj.h264Profile === "string" &&
    typeof obj.h264Level === "string"
  );
}

export enum Exposure {
  normal = "normal",
  short = "short",
  long = "long",
  custom = "custom",
}

export enum WhiteBalance {
  auto = "auto",
  incandescent = "incandescent",
  tungsten = "tungsten",
  fluorescent = "fluorescent",
  indoor = "indoor",
  daylight = "daylight",
  cloudy = "cloudy",
  custom = "custom",
}

export class AWBGains {
  red: number = 0;
  blue: number = 0;
}

export function conformsAWBGains(obj: any): obj is AWBGains {
  return typeof obj.red === "number" && typeof obj.blue === "number";
}

export enum Denoise {
  off = "off",
  cdnOff = "cdn_off",
  cdnFast = "cdn_fast",
  cdnHq = "cdn_hq",
}

export enum Metering {
  centre = "centre",
  spot = "spot",
  matrix = "matrix",
  custom = "custom",
}

export class ROI {
  x: number = 0;
  y: number = 0;
  width: number = 0;
  height: number = 0;
}

export function conformsROI(obj: any): obj is ROI {
  return (
    typeof obj.x === "number" &&
    typeof obj.y === "number" &&
    typeof obj.width === "number" &&
    typeof obj.height === "number"
  );
}

export class SensorMode {
  width: number = 0;
  height: number = 0;
  bitDepth: number = 0;
  packing: number = 0;
}

export function conformsSensorMode(obj: any): obj is SensorMode {
  return (
    typeof obj.width === "number" &&
    typeof obj.height === "number" &&
    typeof obj.bitDepth === "number" &&
    typeof obj.packing === "number"
  );
}

export enum FocusMode {
  auto = "auto",
  manual = "manual",
  continuous = "continuous",
}

export enum AFRange {
  normal = "normal",
  macro = "macro",
  full = "full",
}

export enum AFSpeed {
  normal = "normal",
  fast = "fast",
}

export class AFWindow {
  x: number = 0;
  y: number = 0;
  width: number = 0;
  height: number = 0;
}

export function conformsAFWindow(obj: any): obj is AFWindow {
  return (
    typeof obj.x === "number" &&
    typeof obj.y === "number" &&
    typeof obj.width === "number" &&
    typeof obj.height === "number"
  );
}

export enum Codec {
  auto = "auto",
  hardwareH264 = "hardwareH264",
  softwareH264 = "softwareH264",
}

// MARK: MediaMTX YAML Config
export class MediaMTXConfig {
  logLevel: string = "info";
  logDestinations: string[] = ["stdout"];
  logFile: string = "mediamtx.log";
  readTimeout: string = "10s";
  writeTimeout: string = "10s";
  writeQueueSize: number = 512;
  udpMaxPayloadSize: number = 1472;
  runOnConnect: string | null = null;
  runOnConnectRestart: string = "no";
  runOnDisconnect: string | null = null;
  authMethod: string = "internal";
  authInternalUsers: {
    user: string;
    pass: string | null;
    ips: string[];
    permissions: object[];
  }[] = [];
  authHTTPAddress: string | null = null;
  authHTTPExclude: { action: string }[] = [];
  authJWTJWKS: string | null = null;
  authJWTClaimKey: string = "mediamtx_permissions";
  api: string = "no";
  apiAddress: string = ":9997";
  apiEncryption: string = "no";
  apiServerKey: string = "server.key";
  apiServerCert: string = "server.crt";
  apiAllowOrigin: string = "*";
  apiTrustedProxies: string[] = [];
  metrics: string = "no";
  metricsAddress: string = ":9998";
  metricsEncryption: string = "no";
  metricsServerKey: string = "server.key";
  metricsServerCert: string = "server.crt";
  metricsAllowOrigin: string = "*";
  metricsTrustedProxies: string[] = [];
  pprof: string = "no";
  pprofAddress: string = ":9999";
  pprofEncryption: string = "no";
  pprofServerKey: string = "server.key";
  pprofServerCert: string = "server.crt";
  pprofAllowOrigin: string = "*";
  pprofTrustedProxies: string[] = [];
  playback: string = "no";
  playbackAddress: string = ":9996";
  playbackEncryption: string = "no";
  playbackServerKey: string = "server.key";
  playbackServerCert: string = "server.crt";
  playbackAllowOrigin: string = "*";
  playbackTrustedProxies: string[] = [];
  rtsp: boolean = true;
  rtspTransports: string[] = ["udp", "multicast", "tcp"];
  rtspEncryption: string = "no";
  rtspAddress: string = ":8554";
  rtspsAddress: string = ":8322";
  rtpAddress: string = ":8000";
  rtcpAddress: string = ":8001";
  multicastIPRange: string = "224.1.0.0/16";
  multicastRTPPort: number = 8002;
  multicastRTCPPort: number = 8003;
  rtspServerKey: string = "server.key";
  rtspServerCert: string = "server.crt";
  rtspAuthMethods: string[] = ["basic"];
  rtmp: boolean = true;
  rtmpAddress: string = ":1935";
  rtmpEncryption: string = "no";
  rtmpsAddress: string = ":1936";
  rtmpServerKey: string = "server.key";
  rtmpServerCert: string = "server.crt";
  hls: boolean = true;
  hlsAddress: string = ":8888";
  hlsEncryption: string = "no";
  hlsServerKey: string = "server.key";
  hlsServerCert: string = "server.crt";
  hlsAllowOrigin: string = "*";
  hlsTrustedProxies: string[] = [];
  hlsAlwaysRemux: string = "no";
  hlsVariant: string = "lowLatency";
  hlsSegmentCount: number = 7;
  hlsSegmentDuration: string = "1s";
  hlsPartDuration: string = "200ms";
  hlsSegmentMaxSize: string = "50M";
  hlsDirectory: string = "";
  hlsMuxerCloseAfter: string = "60s";
  webrtc: string = "yes";
  webrtcAddress: string = ":8889";
  webrtcEncryption: string = "no";
  webrtcServerKey: string = "server.key";
  webrtcServerCert: string = "server.crt";
  webrtcAllowOrigin: string = "*";
  webrtcTrustedProxies: string[] = [];
  webrtcLocalUDPAddress: string = ":8189";
  webrtcLocalTCPAddress: string = "";
  webrtcIPsFromInterfaces: string = "yes";
  webrtcIPsFromInterfacesList: string[] = [];
  webrtcAdditionalHosts: string[] = [];
  webrtcICEServers2: string[] = [];
  webrtcHandshakeTimeout: string = "10s";
  webrtcTrackGatherTimeout: string = "2s";
  srt: string = "yes";
  srtAddress: string = ":8890";
  pathDefaults: Record<string, any> = {};
  paths: Record<string, any> = {};

  constructor(init?: Partial<MediaMTXConfig>) {
    Object.assign(this, init);
  }
}

export function conformsMediaMTXConfig(obj: any): boolean {
  if (typeof obj !== "object" || obj === null) {
    Log.debugError("Config is not an object or is null");
    return false;
  }

  const checks = [
    { key: "logLevel", type: "string" },
    { key: "logDestinations", type: "array" },
    { key: "logFile", type: "string", optional: true },
    { key: "readTimeout", type: "string" },
    { key: "writeTimeout", type: "string" },
    { key: "writeQueueSize", type: "number" },
    { key: "udpMaxPayloadSize", type: "number" },
    { key: "authInternalUsers", type: "array" },
    { key: "api", type: "string" },
    { key: "apiAddress", type: "string" },
    { key: "rtsp", type: "boolean" },
    { key: "rtspTransports", type: "array" },
    { key: "rtspEncryption", type: "string" },
    { key: "rtspAddress", type: "string" },
    { key: "rtspsAddress", type: "string", optional: true },
    { key: "hls", type: "boolean" },
    { key: "hlsAddress", type: "string" },
    { key: "hlsEncryption", type: "string" },
    { key: "hlsSegmentCount", type: "number" },
    { key: "hlsSegmentDuration", type: "string" },
    { key: "webrtc", type: "string" },
    { key: "webrtcAddress", type: "string" },
    { key: "srt", type: "string" },
    { key: "srtAddress", type: "string" },
    { key: "pathDefaults", type: "object" },
    { key: "paths", type: "object" },
  ];

  for (const { key, type, optional } of checks) {
    if (!(key in obj)) {
      if (!optional) {
        Log.debugError(`Missing required key: ${key}`);
        return false;
      }
      continue;
    }
    const value = obj[key];

    if (value === null) continue; // Allow null for optional values

    if (type === "array" && !Array.isArray(value)) {
      Log.debugError(`Key ${key} is not an array`);
      return false;
    }
    if (
      type === "object" &&
      (typeof value !== "object" || Array.isArray(value))
    ) {
      Log.debugError(`Key ${key} is not an object`);
      return false;
    }
    if (type === "string" && typeof value !== "string") {
      Log.debugError(`Key ${key} is not a string`);
      return false;
    }
    if (type === "number" && typeof value !== "number") {
      Log.debugError(`Key ${key} is not a number`);
      return false;
    }
    if (type === "boolean" && typeof value !== "boolean") {
      Log.debugError(`Key ${key} is not a boolean`);
      return false;
    }
  }
  return true;
}
