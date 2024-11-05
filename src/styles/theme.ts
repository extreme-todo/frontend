import { Theme } from '@emotion/react';
import { responsiveBreakpoints } from '../shared/constants';

export const designTheme: Theme = {
  color: {
    primary1: '#523EA1',
    primary2: '#DBFE77',
    progress_bar: '#E44623',
    background: '#DFDDDD',
    tag_text: '#FFFFFF',
    tag: [
      '#00BD08',
      '#C324FA',
      '#2DF1F1',
      '#FCAE2F',
      '#FF7CCB',
      '#9A98AF',
      '#00AAD0',
      '#CC9667',
    ],
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
} as const;
