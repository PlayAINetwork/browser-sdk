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

const API_URI = "api.playai.network";

class PlayAI {
  static readonly BE_HTTPS: string = `https://${API_URI}/sdk`;
  static readonly BE_WS: string = `wss://${API_URI}/sdk`;
  static readonly DASH_URL: string = "https://dashboard.playai.network/";

  private stream: MediaStream | null = null;
  private mediaRecorder: MediaRecorder | null = null;

  constructor(
    private readonly gameID: string,
    private readonly gameContainer: string,
    protected playAIStyles: PlayAIStyles = PlayAIStyles.parse({})
  ) {
    if (!this.gameID || !this.gameContainer)
      throw new PlayAIError("gameID and gameContainer are required", "INVALID_PARAMS");

    this.playAIStyles = PlayAIStyles.parse(playAIStyles);

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
    return await this.getSession(sessionToken);
  }

  public async startRecording() {}

  public async stopRecording() {
    this.mediaRecorder?.stop();
  }

  public async stopStream() {
    await this.stopRecording();
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

    ReactDOM.createRoot(this.createRootElement()).render(
      <React.StrictMode>
        <App playAIStyles={this.playAIStyles} type={type} playAI={this} />
      </React.StrictMode>
    );
  }

  public hideActionBar() {
    const actionBar = document.getElementById("playai-action-bar");
    if (actionBar) actionBar.remove();
  }
}

export default PlayAI;
