import '@emotion/react';

// 16px
type FontRemSize = 8.75 | 2.25 | 1.875 | 1.25 | 1 | 0.875;
// bold | semibold | regular
type FontWeight = 700 | 600 | 400;
interface FontAttribute {
  size: `${FontRemSize}rem`;
  weight: FontWeight;
}
type FontName = 'clock' | 'h1' | 'h2' | 'h3' | 'body' | 'b1' | 'b2';
type FontSize = Record<FontName, FontAttribute>;

type ColorAttribute = `#${string}`;
// 8 colors tuple
type TagColor = [
  ColorAttribute,
  ColorAttribute,
  ColorAttribute,
  ColorAttribute,
  ColorAttribute,
  ColorAttribute,
  ColorAttribute,
  ColorAttribute,
];
type ColorName =
  | 'primary1'
  | 'primary2'
  | 'progress_bar'
  | 'background'
  | 'tag'
  | 'tag_text';
type Color = Omit<Record<ColorName, ColorAttribute>, 'tag'> & {
  tag: TagColor;
};

type ShadowName = 'container';
type ShadowAttribute =
  `${number}px ${number}px ${number}px rgba(${number},${number},${number},${number})`;
type Shadow = Record<ShadowName, ShadowAttribute>;

type ResponsiveName = 'desktop' | 'tablet_h' | 'tablet_v' | 'mobile';
type ResponsiveAttribute =
  | `all and (min-width: ${number}px) and (max-width: ${number}px)`
  | `all and (max-width: ${number}px)`;
type Responsive = Record<ResponsiveName, ResponsiveAttribute>;

declare module '@emotion/react' {
  export interface Theme {
    fontSize: FontSize;
    color: Color;
    shadow: Shadow;
    responsiveDevice: Responsive;
  }
}
