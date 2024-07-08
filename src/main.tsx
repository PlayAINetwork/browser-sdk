import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { PlayAIStyles } from "./utils";

declare global {
  interface Window {
    chrome: any;
  }

  interface Navigator {
    userAgentData?: {
      mobile: boolean;
    };
  }
}

class PlayAIError extends Error {
  constructor(
    message: string,
    public code: string
  ) {
    super(message);
    this.name = "PlayAIError";
  }
}

type Type = "onboarding" | "recording";

const API_URI = "api.playai.network";

class PlayAI {
  static readonly BE_HTTPS: string = `https://${API_URI}/sdk`;
  static readonly BE_WS: string = `wss://${API_URI}/sdk`;
  static readonly DASH_URL: string = "https://dashboard.playai.network/";

  private stream: MediaStream | null = null;
  private mediaRecorder: MediaRecorder | null = null;
  private gameContainerStyles: string = "";
  protected playAIStyles: PlayAIStyles;

  constructor(
    private readonly gameID: string,
    private readonly gameContainer: string,
    playAIStyles?: PlayAIStyles | Type,
    private readonly demo?: Type
  ) {
    if (!this.gameID || !this.gameContainer)
      throw new PlayAIError("gameID and gameContainer are required", "INVALID_PARAMS");

    if (!this.demo && typeof playAIStyles === "string") {
      this.demo = playAIStyles;
      this.playAIStyles = PlayAIStyles.parse({});
    } else {
      this.playAIStyles = PlayAIStyles.parse(playAIStyles || {});
    }

    if (this.demo && !["onboarding", "recording"].includes(this.demo)) {
      throw new PlayAIError("Invalid demo type. Must be either 'onboarding' or 'recording'", "INVALID_PARAMS");
    }

    if (this.demo) this.renderActionBar(this.demo);

    if (!window.chrome || navigator.userAgentData?.mobile) {
      throw new PlayAIError("PlayAI is only supported on chromium based desktop browsers", "UNSUPPORTED_BROWSER");
    }
  }

  private createRootElement = () => {
    const root = document.createElement("div");
    root.id = "playai-action-bar";
    document.body.appendChild(root);
    return root;
  };

  private async getSession(sessionToken: string) {
    const res = await fetch(`${PlayAI.BE_HTTPS}/${this.gameID}/session`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${sessionToken}`
      }
    });

    if (!res.ok) {
      this.removeSessionToken();
      throw new PlayAIError(
        "Invalid session token. Please try again with a valid session token.",
        "INVALID_SESSION_TOKEN"
      );
    }

    return (await res.json()) as {
      sub?: string;
      sessionId: string;
      gameId: string;
      account: string;
      type: "google" | "twitter" | "evm" | "solana";
      optedOut: boolean;
    };
  }

  private getSessionToken = () => localStorage.getItem("playai-session-token");

  private setSessionToken = (sessionToken: string) => localStorage.setItem("playai-session-token", sessionToken);

  private removeSessionToken = () => localStorage.removeItem("playai-session-token");

  private renderActionBar(type: Type) {
    ReactDOM.createRoot(this.createRootElement()).render(
      <React.StrictMode>
        <App playAIStyles={this.playAIStyles} type={type} playAI={this} />
      </React.StrictMode>
    );
  }

  private getGameContainer(): HTMLElement {
    const gameContainer = document.querySelector(this.gameContainer) as HTMLElement | null;
    if (!gameContainer) {
      throw new PlayAIError(
        "Game container not found. Please provide a valid game container css selector",
        "INVALID_SELECTOR"
      );
    }
    return gameContainer;
  }

  private setGameContainerStyles(): void {
    const gameContainer = this.getGameContainer();
    this.gameContainerStyles = gameContainer.style.cssText;

    gameContainer.style.cssText = `${this.gameContainerStyles}
  	  position: fixed !important;
  	  top: 0 !important;
  	  left: 0 !important;
  	  width: 100% !important;
  	  min-width: 100vw !important;
  	  height: 100% !important;
  	  min-height: 100vh !important;
  	  z-index: 99999 !important;`;

    document.body.style.overflow = "hidden";
  }

  private resetGameContainerStyles(): void {
    const gameContainer = this.getGameContainer();
    gameContainer.style.cssText = this.gameContainerStyles;
    document.body.style.overflow = "";
  }

  public async loginWithSessionToken(sessionToken: string) {
    const res = await this.getSession(sessionToken);
    this.setSessionToken(sessionToken);
    return res;
  }

  public async logout() {
    try {
      const sessionToken = this.getSessionToken();
      if (!sessionToken) return;
      await fetch(`${PlayAI.BE_HTTPS}/${this.gameID}/session/logout`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${sessionToken}`
        }
      });
    } catch {
      return;
    } finally {
      this.removeSessionToken();
    }
  }

  public async getCurrentSession() {
    const sessionToken = this.getSessionToken();
    if (!sessionToken) return null;
    try {
      return await this.getSession(sessionToken);
    } catch (e) {
      if (e instanceof PlayAIError) {
        return null;
      }
    }
  }

  public async startRecording() {
    const sessionToken = this.getSessionToken();
    if (!sessionToken && !this.demo) throw new PlayAIError("Session token not found", "UNAUTHENTICATED");

    let id: string;
    const buffer: Blob[] = [];

    if (!this.stream) {
      try {
        this.stream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: true,
          preferCurrentTab: true
        } as MediaStreamConstraints);

        const videoTrack = this.stream.getVideoTracks()[0];
        videoTrack.addEventListener("ended", () => this.stopStream());
      } catch (e) {
        throw new PlayAIError(
          "Permission denied. Please allow screen recording permission to start recording.",
          "PERMISSION_DENIED"
        );
      }
    }

    this.setGameContainerStyles();

    if (this.demo) {
      id = "demo";
    } else {
      const res = await fetch(`${PlayAI.BE_HTTPS}/${this.gameID}/stream/init`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionToken}`
        }
      });

      id = ((await res.json()) as { id: string }).id;
    }

    let reconnectAttempts = 0;
    const reconnectTimeout = 5000;
    const maxReconnectAttempts = 5;
    let streamingReconnectInitiated = false;

    let ws = new WebSocket(`${PlayAI.BE_WS}/stream/${id}`);

    const reconnect = () => {
      if (reconnectAttempts <= maxReconnectAttempts) {
        ws.close();
        ws = new WebSocket(`${PlayAI.BE_WS}/stream/${id}`);

        ws.onopen = () => {
          reconnectAttempts = 0;
          streamingReconnectInitiated = false;
        };

        ws.onerror = () => {
          if (ws.readyState === WebSocket.CLOSED) {
            reconnectAttempts++;
            setTimeout(reconnect, reconnectTimeout);
          }
        };
      } else {
        //Refactor here
        this.resetGameContainerStyles();
        this.hideActionBar();
        this.renderActionBar("recording");
        throw new PlayAIError("Failed to reconnect websocket. Max attempts reached.", "CONNECTION_ERROR");
      }
    };

    ws.onerror = () => {
      if (ws.readyState === WebSocket.CLOSED) {
        reconnectAttempts++;
        reconnect();
      }
    };

    this.mediaRecorder = new MediaRecorder(this.stream, {
      mimeType: "video/webm;"
    });

    this.mediaRecorder.ondataavailable = (e) => {
      buffer.push(e.data);
    };

    this.mediaRecorder.onstop = () => {
      if (!buffer.length) {
        ws.send("end");
        ws.close();
      }
      //Refactor here.
      this.resetGameContainerStyles();
      this.hideActionBar();
      this.renderActionBar("recording");
      this.mediaRecorder = null;
    };

    this.mediaRecorder.start(1000);

    let dataStreaming = false;
    const streamDataInterval = setInterval(async () => {
      if (dataStreaming) return;
      dataStreaming = true;

      while (buffer.length) {
        if (ws.readyState !== WebSocket.OPEN) {
          if (!streamingReconnectInitiated) {
            reconnectAttempts++;
            streamingReconnectInitiated = true;
            reconnect();
          }
          break;
        }
        ws.send(buffer.shift() as Blob);
      }

      if (reconnectAttempts > maxReconnectAttempts || (!buffer.length && this.mediaRecorder === null)) {
        clearInterval(streamDataInterval);
        if (ws.readyState === WebSocket.OPEN) {
          ws.send("end");
          ws.close();
        }
      }

      dataStreaming = false;
    }, 5000);
  }

  public stopRecording() {
    this.mediaRecorder?.stop();
  }

  public stopStream() {
    this.stopRecording();
    this.stream?.getTracks().forEach((track) => track.stop());
    this.stream = null;
  }

  public async optOut() {
    const sessionToken = this.getSessionToken();
    if (!sessionToken) throw new PlayAIError("Session token not found", "UNAUTHENTICATED");

    const res = await fetch(`${PlayAI.BE_HTTPS}/${this.gameID}/session/opt-out`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${sessionToken}`
      }
    });

    if (!res.ok) {
      this.removeSessionToken();
      throw new PlayAIError(
        "Invalid session token. Please try again with a valid session token.",
        "INVALID_SESSION_TOKEN"
      );
    }
  }

  public async showActionBar() {
    const sessionToken = this.getSessionToken();
    if (!sessionToken) throw new PlayAIError("Session token not found", "UNAUTHENTICATED");

    const { optedOut, sub } = await this.getSession(sessionToken);

    const type = sub ? "recording" : "onboarding";
    if (optedOut) return;

    if (!document.getElementById("playai-action-bar")) this.renderActionBar(type);
  }

  public hideActionBar() {
    const actionBar = document.getElementById("playai-action-bar");
    if (actionBar) actionBar.remove();
  }
}

export default PlayAI;

//TODO: Change backend url to vite env
//TODO: Add listeners for resetting recording when stream is stopped
//TODO: Add Github actions for publishing to npm
//TODO: Check typescript declaration file
//TODO: Update README.md Heading Links