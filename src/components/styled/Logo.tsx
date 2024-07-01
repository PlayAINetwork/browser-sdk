import styled from "styled-components";
import { PlayAIStyles } from "../../utils";

const LogoWrapper = styled.div<{ $playAIStyles: PlayAIStyles }>`
  border: 1.5px solid ${(props) => props.$playAIStyles.playAIIcon.borderColor};
  border-radius: calc(
    ${(props) => props.$playAIStyles.actionBar.borderRadius} -
      ${(props) => (props.$playAIStyles.actionBar.borderColor !== "transparent" ? "7.5px" : "6px")}
  );
  background-color: ${(props) => props.$playAIStyles.playAIIcon.backgroundColor};
  padding: 5.5px;
  cursor: pointer;

  path {
    fill: ${(props) => props.$playAIStyles.playAIIcon.color};
  }
`;

const Logo = ({ $playAIStyles }: { $playAIStyles: PlayAIStyles }) => (
  <LogoWrapper className="logo-wrapper" $playAIStyles={$playAIStyles}>
    <svg className="logo" width="25" height="25" viewBox="0 0 23 19" xmlns="http://www.w3.org/2000/svg">
      <path d="M14.3646 17.546C13.0062 13.7254 11.6771 9.98087 10.3246 6.17488C13.0706 4.59979 15.8137 3.02762 18.5832 1.44082C19.886 5.17947 21.1741 8.88884 22.4856 12.6568C19.7981 14.2758 17.1106 15.8919 14.3646 17.546Z" />
      <path d="M12.7782 18.0727C12.222 18.1167 11.7038 18.1694 11.1827 18.1986C9.21541 18.3099 7.24517 18.4036 5.27785 18.5295C4.86507 18.5558 4.67478 18.4358 4.53425 18.0376C3.31346 14.5566 2.06633 11.0844 0.830899 7.61214C0.816261 7.56822 0.810408 7.52138 0.786987 7.41598C1.61256 7.33693 2.42056 7.25203 3.2315 7.18469C4.91777 7.04124 6.60696 6.92413 8.28737 6.74847C8.72358 6.70163 8.84361 6.86558 8.96657 7.21982C9.58135 9.01449 10.2166 10.8062 10.8519 12.595C11.4491 14.2755 12.061 15.9531 12.6641 17.6336C12.7109 17.7683 12.7373 17.9088 12.7841 18.0786L12.7782 18.0727Z" />
      <path d="M1.67352 5.65965C2.76842 5.03898 3.86626 4.41538 4.96409 3.79471C6.31955 3.02766 7.66915 2.24597 9.04217 1.51112C9.38762 1.32668 9.81212 1.26227 10.2103 1.22128C12.3737 0.99585 14.5401 0.793839 16.7329 0.650383C16.001 1.07197 15.272 1.49941 14.5372 1.91807C12.8129 2.90177 11.1061 3.9206 9.34957 4.83989C8.8109 5.12095 8.13463 5.18244 7.51399 5.24684C5.67256 5.44007 3.82234 5.58645 1.97798 5.7504C1.8843 5.75919 1.7877 5.7504 1.69109 5.7504C1.68523 5.7182 1.67937 5.686 1.67352 5.65379V5.65965Z" />
    </svg>
  </LogoWrapper>
);

export default Logo;
