// GlobalStyle.jsx

import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
  }

  body, html, #root {
    background: linear-gradient(135deg, #2c3e50 0%, #1c1f25 100%);
  }

`;

export default GlobalStyle;