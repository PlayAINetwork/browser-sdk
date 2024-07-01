import { useEffect } from "react";
import { PlayAIStyles } from "./utils";
import PlayAI from "./main.tsx";
import { Logo, Wrapper } from "./components/styled";
import { Onboarding, Recording } from "./components";

interface ActionBarProps {
  playAIStyles: PlayAIStyles;
  type: "onboarding" | "recording";
  playAI: PlayAI;
}

interface ActionBarHoverElements {
  actionBar: HTMLElement;
  logoWrapper: HTMLElement;
  logo: HTMLElement;
}

const addStylesOnHoverOut = ({ actionBar, logo, logoWrapper }: ActionBarHoverElements) => {
  actionBar.style.transition =
    "max-width 0.5s ease-in-out 0s, background-color 0.3s linear 0.5s, box-shadow 0.3s linear 0.5s, border 0.3s linear 0.5s, border-radius 0.3s linear 0.5s";

  for (const child of logo.children) {
    (child as HTMLElement).style.transition = "fill 0.3s linear 0.5s";
  }

  logoWrapper.style.transition =
    "border 0.3s linear 0.5s, border-radius 0.3s linear 0.5s, background-color 0.3s linear 0.5s";

  actionBar.classList.remove("active");
};

const addStylesOnHoverIn = ({ actionBar, logo, logoWrapper }: ActionBarHoverElements, timeout?: number) => {
  if (timeout) clearTimeout(timeout);
  actionBar.style.transition = "max-width 0.5s ease-in-out";

  for (const child of logo.children) {
    (child as HTMLElement).style.transition = "";
  }

  logoWrapper.style.transition = "";
  actionBar.classList.add("active");
};

const App = ({ playAIStyles, type, playAI }: ActionBarProps) => {
  const props = {
    playAI,
    playAIStyles
  };

  useEffect(() => {
    const actionBar = (document.getElementById("playai-action-bar") as HTMLElement).firstElementChild as HTMLElement;
    const logoWrapper = document.querySelector(".logo-wrapper") as HTMLElement;
    const logo = document.querySelector(".logo") as HTMLElement;

    const actionBarHoverElements = { actionBar, logoWrapper, logo };

    addStylesOnHoverIn(actionBarHoverElements);

    const timeout = setTimeout(() => addStylesOnHoverOut(actionBarHoverElements), 3000);

    actionBar.addEventListener("mouseenter", () => addStylesOnHoverIn(actionBarHoverElements, timeout));
    actionBar.addEventListener("mouseleave", () => addStylesOnHoverOut(actionBarHoverElements));

    return () => {
      actionBar.removeEventListener("mouseenter", () => addStylesOnHoverIn(actionBarHoverElements, timeout));
      actionBar.removeEventListener("mouseleave", () => addStylesOnHoverOut(actionBarHoverElements));
    };
  }, []);

  return (
    <Wrapper $playAIStyles={playAIStyles}>
      <Logo $playAIStyles={playAIStyles} />
      {type === "onboarding" ? <Onboarding {...props} /> : <Recording {...props} />}
    </Wrapper>
  );
};

export { PlayAIStyles };

export default App;
