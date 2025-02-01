// ****************************************************************
// stream-cam server supplement - handlers
// CameraSettings
// ****************************************************************

import {
  CameraSettings as Settings,
  conformsCameraSettings,
} from "../data/CameraSettings";

export class CameraSettings {
  // MARK: External

  async get(req: Request): Promise<Response> {
    const data = await new URLSearchParams(req.url.split("?")[1]).get("id");
    console.log(data);
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

    if (this._settings.some((settings) => settings.id === data)) {
      this._current = data;
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

  private updateSettings(id: string, settings: Settings): void {
    const index = this._settings.findIndex((settings) => settings.id === id);

    if (index !== -1) {
      this._settings[index] = settings;
    }
  }
}
