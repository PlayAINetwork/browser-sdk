declare module '@playai/sdk' {
  export type PlayAIStyles = {
    actionBar?: {
      backgroundColor?: string;
      borderColor?: string;
      textColor?: string;
      borderRadius?: string;
      dividerColor?: string;
      hover?: {
        backgroundColor?: string;
        borderColor?: string;
        boxShadow?: string;
      };
    };
    playAIIcon?: {
      color?: string;
      borderColor?: string;
      backgroundColor?: string;
      hover?: {
        color?: string;
        borderColor?: string;
        backgroundColor?: string;
      };
    };
    recording?: {
      dashboardIconColor?: string;
      errorIconColor?: string;
      button?: {
        iconColor?: string;
        backgroundColor?: string;
        textColor?: string;
        borderColor?: string;
      };
    };
    onboardingButton?: {
      backgroundColor?: string;
      textColor?: string;
      iconColor?: string;
      borderColor?: string;
    };
  };

  export type Session = {
    sub?: string;
    sessionId: string;
    gameId: string;
    account: string;
    type: "google" | "twitter" | "evm" | "solana";
    optedOut: boolean;
  };

  export class PlayAIError extends Error {
    constructor(message: string, code: string);
  }

  export default class PlayAI {
    static readonly BE_HTTPS: string;
    static readonly BE_WS: string;
    static readonly DASH_URL: string;

    constructor(gameID: string, gameContainer: string, playAIStyles?: PlayAIStyles);

    private createRootElement(): HTMLElement;

    private getSession(sessionToken: string): Promise<Session>;
    private getSessionToken(): string | null;
    private setSessionToken(sessionToken: string): void;
    private removeSessionToken(): void;

    public loginWithSessionToken(sessionToken: string): Promise<Session>;
    public logout(): Promise<void>;
    public getCurrentSession(): Promise<Session>;
    public startRecording(): Promise<void>;
    public stopRecording(): Promise<void>;
    public stopStream(): Promise<void>;
    public optOut(): Promise<void>;
    public showActionBar(): Promise<void>;
    public hideActionBar(): void;
  }
}