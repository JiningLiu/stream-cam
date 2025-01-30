// ****************************************************************
// stream-cam server supplement
// CameraSettings
// ****************************************************************

import { v4 as uuidv4 } from 'uuid';

export class CameraSettings {

  // Identification
  id: string = `${uuidv4()}-${Date.now()}`;
  name: string = "untitled settings";

  // Camera settings
  camId: number = 0;
  width: number = 1920;
  height: number = 1080;
  hFlip: boolean = false;
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
  ev: number = 0;
  roi?: ROI;
  hdr: boolean = false;
  tuningFile?: string;
  sensorMode?: SensorMode;
  fps: number = 30;
  focusMode: FocusMode = FocusMode.continuous;
  afRange: AFRange = AFRange.normal;
  afSpeed: AFSpeed = AFSpeed.normal;
  mfLensPosition: number = 0;
  afWindow?: AFWindow;
  flickerPeriod: number = 0;
  textOverlayEnable: boolean = false;
  textOverlay: string = "%Y-%m-%d %H:%M:%S - stream-cam (MediaMTX)";
  codec: Codec = Codec.auto;
  idrPeriod: number = 60;
  bitrate: number = 5000000;
  h254Profile: string = "main";
  h264Level: string = "4.1";
}

enum Exposure {
  normal = "normal",
  short = "short",
  long = "long",
  custom = "custom"
}

enum WhiteBalance {
  auto = "auto",
  incandescent = "incandescent",
  tungsten = "tungsten",
  fluorescent = "fluorescent",
  indoor = "indoor",
  daylight = "daylight",
  cloudy = "cloudy",
  custom = "custom"
}

class AWBGains {
  red: number = 0;
  blue: number = 0;
}

enum Denoise {
  off = "off",
  cdnOff = "cdn_off",
  cdnFast = "cdn_fast",
  cdnHq = "cdn_hq"
}

enum Metering {
  centre = "centre",
  spot = "spot",
  matrix = "matrix",
  custom = "custom"
}

class ROI {
  x: number = 0;
  y: number = 0;
  width: number = 0;
  height: number = 0;
}

class SensorMode {
  width: number = 0;
  height: number = 0;
  bitDepth: number = 0;
  packing: number = 0;
}

enum FocusMode {
  auto = "auto",
  manual = "manual",
  continuous = "continuous"
}

enum AFRange {
  normal = "normal",
  macro = "macro",
  full = "full"
}

enum AFSpeed {
  normal = "normal",
  fast = "fast"
}

class AFWindow {
  x: number = 0;
  y: number = 0;
  width: number = 0;
  height: number = 0;
}

enum Codec {
  auto = "auto",
  hardwareH264 = "hardwareH264",
  softwareH264 = "softwareH264"
}

// mediamtx.yml settings
//
// # ID of the camera
// rpiCameraCamID: 0
// # Width of frames
// rpiCameraWidth: 1920
// # Height of frames
// rpiCameraHeight: 1080
// # Flip horizontally
// rpiCameraHFlip: false
// # Flip vertically
// rpiCameraVFlip: false
// # Brightness [-1, 1]
// rpiCameraBrightness: 0
// # Contrast [0, 16]
// rpiCameraContrast: 1
// # Saturation [0, 16]
// rpiCameraSaturation: 1
// # Sharpness [0, 16]
// rpiCameraSharpness: 1
// # Exposure mode.
// # values: normal, short, long, custom
// rpiCameraExposure: normal
// # Auto-white-balance mode.
// # values: auto, incandescent, tungsten, fluorescent, indoor, daylight, cloudy, custom
// rpiCameraAWB: auto
// # Auto-white-balance fixed gains. This can be used in place of rpiCameraAWB.
// # format: [red,blue]
// rpiCameraAWBGains: [0, 0]
// # Denoise operating mode.
// # values: off, cdn_off, cdn_fast, cdn_hq
// rpiCameraDenoise: "off"
// # Fixed shutter speed, in microseconds.
// rpiCameraShutter: 0
// # Metering mode of the AEC/AGC algorithm.
// # values: centre, spot, matrix, custom
// rpiCameraMetering: centre
// # Fixed gain
// rpiCameraGain: 0
// # EV compensation of the image [-10, 10]
// rpiCameraEV: 0
// # Region of interest, in format x,y,width,height (all normalized between 0 and 1)
// rpiCameraROI:
// # Whether to enable HDR on Raspberry Camera 3.
// rpiCameraHDR: false
// # Tuning file
// rpiCameraTuningFile:
// # Sensor mode, in format [width]:[height]:[bit-depth]:[packing]
// # bit-depth and packing are optional.
// rpiCameraMode:
// # frames per second
// rpiCameraFPS: 30
// # Autofocus mode
// # values: auto, manual, continuous
// rpiCameraAfMode: continuous
// # Autofocus range
// # values: normal, macro, full
// rpiCameraAfRange: normal
// # Autofocus speed
// # values: normal, fast
// rpiCameraAfSpeed: normal
// # Lens position (for manual autofocus only), will be set to focus to a specific distance
// # calculated by the following formula: d = 1 / value
// # Examples: 0 moves the lens to infinity.
// #           0.5 moves the lens to focus on objects 2m away.
// #           2 moves the lens to focus on objects 50cm away.
// rpiCameraLensPosition: 0.0
// # Specifies the autofocus window, in the form x,y,width,height where the coordinates
// # are given as a proportion of the entire image.
// rpiCameraAfWindow:
// # Manual flicker correction period, in microseconds.
// rpiCameraFlickerPeriod: 0
// # Enables printing text on each frame.
// rpiCameraTextOverlayEnable: false
// # Text that is printed on each frame.
// # format is the one of the strftime() function.
// rpiCameraTextOverlay: '%Y-%m-%d %H:%M:%S - MediaMTX'
// # Codec. Available values: auto, hardwareH264, softwareH264
// rpiCameraCodec: auto
// # Period between IDR frames
// rpiCameraIDRPeriod: 60
// # Bitrate
// rpiCameraBitrate: 5000000
// # H264 profile
// rpiCameraProfile: main
// # H264 level
// rpiCameraLevel: '4.1'