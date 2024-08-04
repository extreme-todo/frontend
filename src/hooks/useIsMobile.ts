import { useEffect, useState } from 'react';
import { responsiveBreakpoints } from '../shared/constants';

export const useIsMobile = () => {
  const [responsiveMobile, setResponsiveMobile] = useState<boolean>(false);
  useEffect(() => {
    if (window.ResizeObserver)
      new ResizeObserver((entries) => {
        const { borderBoxSize } = entries[0];
        if (
          borderBoxSize[0].inlineSize > responsiveBreakpoints.mobile.min &&
          borderBoxSize[0].inlineSize < responsiveBreakpoints.tablet_v.max
        ) {
          if (responsiveMobile !== true) {
            setResponsiveMobile(true);
          }
        } else {
          if (responsiveMobile !== false) {
            setResponsiveMobile(false);
          }
        }
      }).observe(document.body);
  }, []);
  return responsiveMobile;
};
