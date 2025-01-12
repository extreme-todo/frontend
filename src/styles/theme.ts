import { Theme } from '@emotion/react';
import { responsiveBreakpoints } from '../shared/constants';
import { Color, FontColor, FontSize, PrimaryColor } from './emotion';

const primary: PrimaryColor = { primary1: '#523EA1', primary2: '#DBFE77' };
const fontColor: FontColor = {
  white: '#FFFFFF',
  gray: '#DFDDDD',
  extreme_dark: '#1C1C1D',
  extreme_orange: '#E44623',
  ...primary,
};
const color: Color = {
  primary,
  fontColor: fontColor,
  backgroundColor: {
    ...fontColor,
  },
  tag: {
    green: '#00BD08',
    purple: '#C324FA',
    mint: '#2DF1F1',
    orange: '#FCAE2F',
    pink: '#FF7CCB',
    gray: '#9A98AF',
    cyan: '#00AAD0',
    brown: '#CC9667',
  },
};

const fontSize: FontSize = {
  clock: {
    size: '8.75rem',
    weight: 700,
  },
  h1: {
    size: '2.25rem',
    weight: 700,
  },
  h2: {
    size: '1.875rem',
    weight: 400,
  },
  h3: {
    size: '1.25rem',
    weight: 400,
  },
  body: {
    size: '1rem',
    weight: 400,
  },
  b1: {
    size: '1.25rem',
    weight: 600,
  },
  b2: {
    size: '0.875rem',
    weight: 400,
  },
};

export const designTheme: Theme = {
  color,
  fontSize,
  shadow: {
    container: '16px 16px 40px rgba(0,0,0,0.25)',
    tomato: '4px 6px 8px rgba(0,0,0,0.40)',
  },
  responsiveDevice: {
    desktop: `all and (min-width: ${responsiveBreakpoints.desktop.min}px) and (max-width: ${responsiveBreakpoints.desktop.max}px)`,
    tablet_h: `all and (min-width: ${responsiveBreakpoints.tablet_h.min}px) and (max-width: ${responsiveBreakpoints.tablet_h.max}px)`,
    tablet_v: `all and (min-width: ${responsiveBreakpoints.tablet_v.min}px) and (max-width: ${responsiveBreakpoints.tablet_v.max}px)`,
    mobile: `all and (max-width: ${responsiveBreakpoints.mobile.max}px)`,
  },
  button: {
    lightBtn: {
      height: '2.25rem',
      fontSize: fontSize.b1,
      default: {
        backgroundColor: '#523EA133',
        color: color.fontColor.primary1,
      },
      hover: {
        backgroundColor: '#523EA14D',
        color: color.fontColor.primary1,
      },
      click: {
        backgroundColor: color.backgroundColor.primary1,
        color: color.fontColor.primary2,
      },
    },
    darkBtn: {
      height: '2.25rem',
      fontSize: fontSize.b1,
      default: {
        backgroundColor: '#DBFE7733',
        color: color.fontColor.primary2,
      },
      hover: {
        backgroundColor: '#DBFE774D',
        color: color.fontColor.primary2,
      },
      click: {
        backgroundColor: color.backgroundColor.primary2,
        color: color.fontColor.primary1,
      },
    },
    extremeLightBtn: {
      height: '2.25rem',
      fontSize: fontSize.b1,
      default: {
        backgroundColor: '#00000033',
        color: color.fontColor.extreme_dark,
      },
      hover: {
        backgroundColor: '#0000004D',
        color: color.fontColor.extreme_dark,
      },
      click: {
        backgroundColor: color.backgroundColor.extreme_dark,
        color: color.fontColor.extreme_dark,
      },
    },
    extremeDarkBtn: {
      height: '2.25rem',
      fontSize: fontSize.b1,
      default: {
        backgroundColor: '#DBFE7733',
        color: color.fontColor.primary2,
      },
      hover: {
        backgroundColor: '#DBFE774D',
        color: color.fontColor.primary2,
      },
      click: {
        backgroundColor: color.backgroundColor.primary2,
        color: color.fontColor.primary1,
      },
    },
    textBtn: {
      height: '1.25rem',
      fontSize: fontSize.b2,
      default: {
        backgroundColor: 'transparent',
        color: color.fontColor.primary1,
      },
      hover: {
        backgroundColor: color.backgroundColor.gray,
        color: color.fontColor.primary1,
      },
      click: {
        backgroundColor: color.backgroundColor.primary1,
        color: color.fontColor.gray,
      },
    },
  },
} as const;
