import '@emotion/react';

/* font */
// 16px
// 140, 36, 30, 20, 16, 14
type RemType<T extends number> = `${T}rem`;
type FontRemSize = 8.75 | 2.25 | 1.875 | 1.25 | 1 | 0.875;
// bold | semibold | regular
type FontWeight = 700 | 600 | 400;
interface FontAttribute {
  size: RemType<FontRemSize>;
  weight: FontWeight;
}
type FontName = 'clock' | 'h1' | 'h2' | 'h3' | 'body' | 'b1' | 'b2';
type FontSize = Record<FontName, FontAttribute>;

/* color */
type ColorAttribute = `#${string}`;
type ColorRecord<T> = Record<T, ColorAttribute>;

// 8 colors
type TagColorName =
  | 'green'
  | 'purple'
  | 'mint'
  | 'orange'
  | 'pink'
  | 'gray'
  | 'cyan'
  | 'brown';
type TagColor = ColorRecord<TagColorName>;

type PrimaryColorName = 'primary1' | 'primary2';
type PrimaryColor = ColorRecord<PrimaryColorName>;

type FontColorName = 'white' | 'gray';
type FontColor = ColorRecord<FontColorName> & PrimaryColor;

type BackgroundColorName = 'gray' | 'extreme_dark' | 'white' | 'extreme_orange';
type BackgroundColor = ColorRecord<BackgroundColorName> & PrimaryColor;

type ColorName = 'primary' | 'background_color' | 'tag' | 'font_color';

type Color = Omit<
  Record<ColorName, ColorAttribute>,
  'tag' | 'primary' | 'font_color' | 'background_color'
> & {
  tag: TagColor;
  font_color: FontColor;
  primary: PrimaryColor;
  background_color: BackgroundColor;
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

interface ButtonColor {
  backgroundColor: ColorAttribute | 'transparent';
  color: ColorAttribute;
}
// 36, 20
type ButtonHeight = 2.25 | 1.25;
interface ButtonCommonStyle {
  height: RemType<ButtonHeight>;
  fontSize: FontAttribute;
}
type ButtonAction = 'default' | 'hover' | 'click';
type ButtonName = 'lightBtn' | 'darkBtn' | 'textBtn';
type Button = Record<
  ButtonName,
  ButtonCommonStyle & Record<ButtonAction, ButtonColor>
>;

declare module '@emotion/react' {
  export interface Theme {
    fontSize: FontSize;
    color: Color;
    shadow: Shadow;
    responsiveDevice: Responsive;
    button: Button;
  }
}
