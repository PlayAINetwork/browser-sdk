import styled from "styled-components";
import { PlayAIStyles } from "../../utils";

const Wrapper = styled.div<{ $playAIStyles: PlayAIStyles }>`
  position: fixed;
  top: 20px;
  left: 20px;
  padding: 6px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  gap: 16px;
  height: 54px;
  color: ${(props) => props.$playAIStyles.actionBar.textColor};
  background-color: ${(props) => props.$playAIStyles.actionBar.backgroundColor};
  border: 1.5px solid ${(props) => props.$playAIStyles.actionBar.borderColor};
  border-radius: ${(props) => props.$playAIStyles.actionBar.borderRadius};
  max-width: 54px;
  overflow: hidden;
  z-index: 999999 !important;

  div,
  a,
  button,
  span {
    min-width: fit-content;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    font-size: 12px;
    text-transform: uppercase;
    font-family: PetrovSans, sans-serif;
    height: 100%;
  }

  .wrapper {
    gap: 14px;
  }

  .highlight {
    color: ${(props) => props.$playAIStyles.onboardingButton.textColor};
  }

  a {
    text-decoration: none;
    color: inherit;
  }

  .secondary-button {
    border: none;
    background-color: transparent;
    cursor: pointer;
    color: ${(props) => props.$playAIStyles.actionBar.textColor};
  }

  .divider {
    height: 15px;
    min-width: 2px;
    background-color: ${(props) => props.$playAIStyles.actionBar.dividerColor};
  }

  .time {
    font-weight: 600;
  }

  .dashboard-icon {
    stroke: ${(props) => props.$playAIStyles.recording.dashboardIconColor};
  }

  &.active .logo {
    path {
      fill: ${(props) => props.$playAIStyles.playAIIcon.hover.color};
    }
  }

  &.active .logo-wrapper {
    border: 1.5px solid ${(props) => props.$playAIStyles.playAIIcon.hover.borderColor};
    border-radius: calc(
      ${(props) => props.$playAIStyles.actionBar.borderRadius} -
        ${(props) => (props.$playAIStyles.actionBar.hover.borderColor !== "transparent" ? "7.5px" : "6px")}
    );
    background-color: ${(props) => props.$playAIStyles.playAIIcon.hover.backgroundColor};
  }

  &.active {
    max-width: 100%;
    border: 1.5px solid ${(props) => props.$playAIStyles.actionBar.hover.borderColor};
    background-color: ${(props) => props.$playAIStyles.actionBar.hover.backgroundColor};
    box-shadow: ${(props) => props.$playAIStyles.actionBar.hover.boxShadow};
  }
`;

export default Wrapper;
