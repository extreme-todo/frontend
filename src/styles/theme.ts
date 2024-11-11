import { Theme } from '@emotion/react';
import { responsiveBreakpoints } from '../shared/constants';

const PADDING = {
  BUTTON: {
    NORMAL: { HORIZONTAL: 0, VERTICAL: 0 },
    TEXT: { HORIZONTAL: 0, VERTICAL: 0 },
  },
};

export const designTheme: Theme = {
  color: {
    primary: { primary1: '#523EA1', primary2: '#DBFE77' },
    font_color: {
      primary1: '#523EA1',
      primary2: '#DBFE77',
      white: '#FFFFFF',
      gray: '#DFDDDD',
    },
    background_color: {
      gray: '#DFDDDD',
      primary1: '#523EA1',
      primary2: '#DBFE77',
      white: '#FFFFFF',
      extreme_dark: '#1C1C1D',
      extreme_orange: '#E44623',
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
  },
  shadow: {
    container: '0px 4px 4px rgba(0,0,0,0.25)',
  },
  fontSize: {
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
  },
  responsiveDevice: {
    desktop: `all and (min-width: ${responsiveBreakpoints.desktop.min}px) and (max-width: ${responsiveBreakpoints.desktop.max}px)`,
    tablet_h: `all and (min-width: ${responsiveBreakpoints.tablet_h.min}px) and (max-width: ${responsiveBreakpoints.tablet_h.max}px)`,
    tablet_v: `all and (min-width: ${responsiveBreakpoints.tablet_v.min}px) and (max-width: ${responsiveBreakpoints.tablet_v.max}px)`,
    mobile: `all and (max-width: ${responsiveBreakpoints.mobile.max}px)`,
  },
  button: {
    lightBtn: {
      paddingHorizontal: PADDING.BUTTON.NORMAL.HORIZONTAL,
      paddingVertical: PADDING.BUTTON.NORMAL.VERTICAL,
      fontSize: {
        size: '1.25rem',
        weight: 600,
      },
      default: {
        backgroundColor: '#523EA1CC',
        color: '#523EA1',
      },
      hover: {
        backgroundColor: '#523EA1B3',
        color: '#523EA1',
      },
      click: {
        backgroundColor: '#523EA1',
        color: '#DBFE77',
      },
    },
    darkBtn: {
      paddingHorizontal: PADDING.BUTTON.NORMAL.HORIZONTAL,
      paddingVertical: PADDING.BUTTON.NORMAL.VERTICAL,
      fontSize: {
        size: '1.25rem',
        weight: 600,
      },
      default: {
        backgroundColor: '#DBFE77CC',
        color: '#DBFE77',
      },
      hover: {
        backgroundColor: '#DBFE77B3',
        color: '#DBFE77',
      },
      click: {
        backgroundColor: '#DBFE77',
        color: '#523EA1',
      },
    },
    textBtn: {
      paddingHorizontal: PADDING.BUTTON.TEXT.HORIZONTAL,
      paddingVertical: PADDING.BUTTON.TEXT.VERTICAL,
      fontSize: { size: '0.875rem', weight: 400 },
      default: {
        backgroundColor: 'transparent',
        color: '#523EA1',
      },
      hover: {
        backgroundColor: '#DFDDDD',
        color: '#523EA1',
      },
      click: {
        backgroundColor: '#523EA1',
        color: '#DFDDDD',
      },
    },
  },
} as const;
