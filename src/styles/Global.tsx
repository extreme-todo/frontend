import { css, Global } from '@emotion/react';

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
  video {
    margin: 0;
    padding: 0;
    border: 0;
    font-size: 100%;
    font: inherit;
    font-family: pretendard;
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
  ul {
    list-style: none;
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
    outline: none;
    border: none;
    background-color: transparent;
    padding: 0;
  }

  body {
    background: linear-gradient(328deg, #b8a2e4, #edbff1, #8ef0e8);
    background-size: 600% 600%;

    -webkit-animation: AnimationName 59s ease infinite;
    -moz-animation: AnimationName 59s ease infinite;
    -o-animation: AnimationName 59s ease infinite;
    animation: AnimationName 59s ease infinite;
    height: 100vh;
    width: 100vw;
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
  html,
  *,
  body {
    /* Hide scrollbar for Chrome, Safari and Opera */
    ::-webkit-scrollbar {
      display: none;
    }

    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */
  }
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
