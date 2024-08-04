import '@emotion/react';

interface fontSize {
  size: string;
  weight: number;
}

declare module '@emotion/react' {
  export interface Theme {
    colors: {
      bgColor: string;
      titleColor: string;
      subFontColor: string;
      accentColor: string;
      whiteWine: string;
      white: string;
      lightGrey: string;
      bgYellow: string;
      lightGrey_2: string;
      transparent: string;
    };
    shadows: {
      basic_shadow: string;
      button_shadow: string;
      emboss_shadow: string;
    };
    fontSize: {
      h1: fontSize;
      h2: fontSize;
      h3: fontSize;
      h3_bold: fontSize;
      h4: fontSize;
      h5: fontSize;
      body: fontSize;
      body_bold: fontSize;
      sub: fontSize;
      tag: fontSize;
      tooltip: fontSize;
      switch: fontSize;
    };
    responsiveDevice: {
      desktop: string;
      tablet_h: string;
      tablet_v: string;
      mobile: string;
    };
  }
}
