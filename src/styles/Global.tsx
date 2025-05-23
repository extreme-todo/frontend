import { css, Global } from '@emotion/react';
import { CardAnimationStyle } from './cardAnimations';

const style = css`
  html,
  body,
  div,
  span,
  applet,
  object,
  iframe,
  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  p,
  blockquote,
  pre,
  a,
  abbr,
  acronym,
  address,
  big,
  cite,
  code,
  del,
  dfn,
  em,
  img,
  ins,
  kbd,
  q,
  s,
  samp,
  small,
  strike,
  strong,
  sub,
  sup,
  tt,
  var,
  b,
  u,
  i,
  center,
  dl,
  dt,
  dd,
  ol,
  ul,
  li,
  fieldset,
  form,
  label,
  legend,
  table,
  caption,
  tbody,
  tfoot,
  thead,
  tr,
  th,
  td,
  article,
  aside,
  canvas,
  details,
  embed,
  figure,
  figcaption,
  footer,
  header,
  hgroup,
  menu,
  nav,
  output,
  ruby,
  section,
  summary,
  time,
  mark,
  audio,
  video,
  input {
    margin: 0;
    padding: 0;
    border: 0;
    font-size: 100%;
    font: inherit;
    vertical-align: baseline;
  }
  /* HTML5 display-role reset for older browsers */
  article,
  aside,
  details,
  figcaption,
  figure,
  footer,
  header,
  hgroup,
  menu,
  nav,
  section {
    display: block;
  }
  body {
    line-height: 1;
  }
  ol,
  li,
  ul {
    list-style: none;
    list-style-type: none;
  }
  blockquote,
  q {
    quotes: none;
  }
  blockquote:before,
  blockquote:after,
  q:before,
  q:after {
    content: '';
    content: none;
  }
  table {
    border-collapse: collapse;
    border-spacing: 0;
  }

  input {
    border: none;
  }
  a {
    text-decoration: none;
    color: inherit;
    cursor: pointer;
  }
  button {
    cursor: pointer;
    border: none;
    background-color: transparent;
    padding: 0;
  }

  body {
    background: #dfdfdd;
    background-size: 600% 600%;

    -webkit-animation: AnimationName 59s ease infinite;
    -moz-animation: AnimationName 59s ease infinite;
    -o-animation: AnimationName 59s ease infinite;
    animation: AnimationName 59s ease infinite;
    height: 100dvh;
    width: 100dvw;
    overscroll-behavior: none;
  }

  @-webkit-keyframes AnimationName {
    0% {
      background-position: 0% 77%;
    }
    50% {
      background-position: 100% 24%;
    }
    100% {
      background-position: 0% 77%;
    }
  }
  @-moz-keyframes AnimationName {
    0% {
      background-position: 0% 77%;
    }
    50% {
      background-position: 100% 24%;
    }
    100% {
      background-position: 0% 77%;
    }
  }
  @-o-keyframes AnimationName {
    0% {
      background-position: 0% 77%;
    }
    50% {
      background-position: 100% 24%;
    }
    100% {
      background-position: 0% 77%;
    }
  }
  @keyframes AnimationName {
    0% {
      background-position: 0% 77%;
    }
    50% {
      background-position: 100% 24%;
    }
    100% {
      background-position: 0% 77%;
    }
  }
  body {
    font-size: 16px;
    /* 글씨 선택 안되게 하기 */
    -webkit-user-select: none; /* Chrome/Safari */
    -moz-user-select: none; /* Firefox */
    -ms-user-select: none; /* IE10+ */
  }
  * {
    font-family: Pretendard;
  }
  html,
  *,
  body {
    font-family: Pretendard;

    /* Hide scrollbar for Chrome, Safari and Opera */
    ::-webkit-scrollbar {
      display: none;
    }

    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */

    /* basic 16px 1280+ */
    /* 노트북 & 테블릿 가로 (해상도 1024px ~ 1279px)*/
    @media all and (min-width: 1024px) and (max-width: 1279px) {
      font-size: 16px;
    }

    /* 테블릿 가로 (해상도 768px ~ 1023px)*/
    @media all and (min-width: 768px) and (max-width: 1023px) {
      font-size: 10px;
      img {
        width: 13px;
        height: 13px;
      }
    }

    /* 모바일 가로 & 테블릿 세로 (해상도 480px ~ 767px)*/
    /* 모바일 세로 (해상도 ~ 479px)*/
    @media all and (max-width: 767px) {
      font-size: 7px;
      img {
        width: 10px;
        height: 10px;
      }
    }
  }

  ${CardAnimationStyle}
`;

export const rainbowStyle = css`
  background: linear-gradient(
      114.81deg,
      #00c2ff 22.57%,
      rgba(0, 117, 255, 0) 65.81%
    ),
    #fa00ff;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-fill-color: transparent;
`;

const GlobalStyle = () => {
  return <Global styles={style} />;
};

export default GlobalStyle;
