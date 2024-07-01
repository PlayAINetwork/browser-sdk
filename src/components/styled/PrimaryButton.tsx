import styled from "styled-components";
import { PlayAIStyles } from "../../utils";

type ButtonType = "recording" | "onboarding";

type PrimaryButtonProps = {
  $type: ButtonType;
  $playAIStyles: PlayAIStyles;
};

const PrimaryButton = styled.button<PrimaryButtonProps>`
  padding: ${(props) => (props.$type === "recording" ? "8px" : "8px 8px 8px 12px")};
  gap: 6px;
  background-color: ${(props) =>
    props.$type === "recording"
      ? props.$playAIStyles.recording.button.backgroundColor
      : props.$playAIStyles.onboardingButton.backgroundColor};
  color: ${(props) =>
    props.$type === "recording"
      ? props.$playAIStyles.recording.button.textColor
      : props.$playAIStyles.onboardingButton.textColor};
  border: 1px solid
    ${(props) =>
      props.$type === "recording"
        ? props.$playAIStyles.recording.button.borderColor
        : props.$playAIStyles.onboardingButton.borderColor};
  border-radius: calc(
    ${(props) => props.$playAIStyles.actionBar.borderRadius} -
      ${(props) => (props.$playAIStyles.actionBar.hover.borderColor !== "transparent" ? "7.5px" : "6px")}
  );
  cursor: pointer;

  .onboarding-icon path {
    fill: ${(props) => props.$playAIStyles.onboardingButton.iconColor};
  }

  .recording-icon circle:nth-child(1),
  .recording-icon rect:nth-child(1) {
    stroke: ${(props) => props.$playAIStyles.recording.button.iconColor};
  }

  .recording-icon circle:nth-child(2),
  .recording-icon rect:nth-child(2) {
    fill: ${(props) => props.$playAIStyles.recording.button.iconColor};
  }
`;

export default PrimaryButton;
