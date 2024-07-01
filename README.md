# PlayAI SDK

## Description

SDK to integrate PlayAI's gameplay streaming features into your web games.

## Installation

```bash
npm install @playai/sdk
yarn add @playai/sdk
pnpm add @playai/sdk
bun add @playai/sdk
```

## Initialization

```javascript
import PlayAI from '@playai/sdk';

const playAI = new PlayAI('ba95fea8-c151-4168-ba19-331694c7a241', '.game-container');
```

The initialization of the PlayAI SDK requires three parameters:

1. `gameID`: This is a unique identifier assigned to your game. It is mandatory for the initialization process.
2. `gameContainer`: This is a CSS selector that targets the HTML element where the game will be rendered. This parameter
   is also mandatory.
3. `playAIStyles` (optional): This is an object that allows you to customize the appearance of the action bar. If this
   parameter is not provided, the SDK will apply a default style to the action bar.

## Customizing the Action Bar

The PlayAI SDK offers a styling system that enables you to tailor the appearance of the action bar to align with your
game's aesthetic. This customization is facilitated through the optional `playAIStyles` parameter during the
initialization of the PlayAI instance.

The `playAIStyles` parameter is an object that can encompass properties for `actionBar`, `playAIIcon`, `recording`,
and `onboardingButton`. Each of these properties is an object that delineates the styles for the corresponding element.

All properties within the `playAIStyles` object are optional. If a property is not specified, the SDK will apply the
default styles to the corresponding element.

You can specify the following properties:

```javascript
const styles = {
  actionBar: {
    backgroundColor: '#f5f5f5',
    borderColor: '#000000',
    textColor: '#000000',
    borderRadius: '10px',
    dividerColor: '#000000',
    hover: {
      backgroundColor: '#000000',
      borderColor: '#f5f5f5',
      boxShadow: '0 0 10px #f5f5f5'
    }
  },
  playAIIcon: {
    color: '#f5f5f5',
    borderColor: '#000000',
    backgroundColor: '#000000',
    hover: {
      color: '#000000',
      borderColor: '#f5f5f5',
      backgroundColor: '#f5f5f5'
    }
  },
  recording: {
    dashboardIconColor: '#f5f5f5',
    errorIconColor: '#f5f5f5',
    button: {
      iconColor: '#f5f5f5',
      backgroundColor: '#000000',
      textColor: '#f5f5f5',
      borderColor: '#f5f5f5'
    }
  },
  onboardingButton: {
    backgroundColor: '#f5f5f5',
    textColor: '#000000',
    iconColor: '#000000',
    borderColor: '#f5f5f5'
  }
};
```

Here's an example of how you can customize the action bar partially:

```javascript
const playAI = new PlayAI('ba95fea8-c151-4168-ba19-331694c7a241', '.game-container', {
  actionBar: {
    backgroundColor: '#f5f5f5',
    textColor: '#000000',
    borderRadius: '10px',
  },
  playAIIcon: {
    color: '#f5f5f5',
    hover: {
      color: '#000000',
    }
  },
});
```

In this example, we've customized the background color, text color, and border radius of the action bar. We've also
customized the color of the PlayAI icon and its hover state. All other styles will default to the SDK's predefined
values.

## User Authentication

The PlayAI SDK requires user authentication for its operation. The process of obtaining a session token for the user is
facilitated through the API key and game ID provided to the game. It is imperative to note that this operation should be
executed on the game's backend servers to prevent exposure of the API key on the client side.

The `type` field in the request body can be one of the following: `google`, `twitter`, `evm`, or `solana`. The `account`
field should contain the user's account details.

The `account` field is a string that can be the user's Google email/id or Twitter username/id. For EVM and Solana,
the `account` field should contain the user's wallet address.

Here's an example of how you can obtain a session token on your server:

```javascript
const res = await fetch("https://api.playai.network/sdk/your_game_id/session/create", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "x-playai-token": "your_api_key",
  },
  body: JSON.stringify({ type: "google", account: "user@google.com" })
});

await res.json();

return res.sessionToken;
```

Once the session token is obtained, it can be used on the client side to authenticate the user with the PlayAI SDK:

```javascript
playAI.loginWithSessionToken(sessionToken);
```

The authentication process should start by calling the `getCurrentSession` method, which returns the session details. If
the user is not authenticated, `getCurrentSession` will return `null`.

Here's an example of how you can use the session token to authenticate the user:

```javascript
const currentSession = await playAI.getCurrentSession();
if (!currentSession) {
  const sessionToken = await fetch("<your_game_server_api>");
  await playAi.loginWithSessionToken(sessionToken);
} 
```

## Showing and Hiding the Action Bar

In order to show the action bar, the game can call `playAI.showActionBar()`. This should be called when a game is
started. User can click on record button to start recording the game.

The game should call `playAI.stopRecording()` when the current game session concludes (e.g., player death).

In order to hide the action bar, the game can call `playAI.hideActionBar()`. This should be called when a game is paused
or stopped.

