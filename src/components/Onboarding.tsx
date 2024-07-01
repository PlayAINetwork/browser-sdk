import PlayAI from "../main.tsx";
import { useState } from "react";
import { PrimaryButton } from "./styled";
import { PlayAIStyles } from "../utils";

interface OnboardingProps {
  playAI: PlayAI;
  playAIStyles: PlayAIStyles;
}

const OnboardingIcon = () => (
  <svg className="onboarding-icon" width="22" height="22" viewBox="0 0 25 25" xmlns="http://www.w3.org/2000/svg">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M2.4751 7.31641C2.4751 4.55498 4.71367 2.31641 7.4751 2.31641H17.4751C20.2365 2.31641 22.4751 4.55498 22.4751 7.31641V17.3164C22.4751 20.0778 20.2365 22.3164 17.4751 22.3164H7.4751C4.71367 22.3164 2.4751 20.0778 2.4751 17.3164V7.31641ZM7.4751 4.31641C5.81824 4.31641 4.4751 5.65955 4.4751 7.31641V17.3164C4.4751 18.9733 5.81824 20.3164 7.4751 20.3164H17.4751C19.132 20.3164 20.4751 18.9733 20.4751 17.3164V7.31641C20.4751 5.65955 19.132 4.31641 17.4751 4.31641H7.4751Z"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M8.64669 9.48798C8.64669 8.93569 9.09441 8.48798 9.64669 8.48798L15.3035 8.48798C15.5688 8.48798 15.8231 8.59334 16.0107 8.78087C16.1982 8.96841 16.3035 9.22276 16.3035 9.48798V15.1448C16.3035 15.6971 15.8558 16.1448 15.3035 16.1448C14.7513 16.1448 14.3035 15.6971 14.3035 15.1448V11.9022L10.3538 15.8519C9.96328 16.2425 9.33011 16.2425 8.93959 15.8519C8.54906 15.4614 8.54906 14.8283 8.93959 14.4377L12.8893 10.488L9.64669 10.488C9.09441 10.488 8.64669 10.0403 8.64669 9.48798Z"
    />
  </svg>
);

const Onboarding = ({ playAI, playAIStyles }: OnboardingProps) => {
  const removeActionBar = async (optedOut?: boolean) => {
    playAI.hideActionBar();
    if (optedOut) await playAI.optOut();
  };

  const [step, setStep] = useState(1);

  return (
    <div className="wrapper">
      {step === 1 ? (
        <span>
          Be part of&nbsp; <span className="highlight">Stream to earn</span>
        </span>
      ) : (
        <span>Are you sure?</span>
      )}
      <div className="divider" />
      {step === 1 ? (
        <button className="secondary-button" onClick={() => setStep((step) => step + 1)}>
          Ignore
        </button>
      ) : (
        <button className="secondary-button" onClick={() => removeActionBar(true)}>
          Yes
        </button>
      )}

      <a href={PlayAI.DASH_URL} target={"_blank"} onClick={() => removeActionBar()}>
        <PrimaryButton $playAIStyles={playAIStyles} $type="onboarding">
          {step === 1 ? "Join play collective" : "No, Join play collective"} <OnboardingIcon />
        </PrimaryButton>
      </a>
    </div>
  );
};

export default Onboarding;
