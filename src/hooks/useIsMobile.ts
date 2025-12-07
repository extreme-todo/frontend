import { useEffect, useRef, useState } from 'react';
import { responsiveBreakpoints } from '../shared/constants';

export const useIsMobile = () => {
  const responsiveMobileRef = useRef<boolean>(false);
  const [responsiveMobile, setResponsiveMobile] = useState<boolean>(false);

  const updateResponsiveMobile = (value: boolean) => {
    responsiveMobileRef.current = value;
    setResponsiveMobile(responsiveMobileRef.current);
  };


  useEffect(() => {
    if (window.ResizeObserver)
      new ResizeObserver((entries) => {
        const { borderBoxSize } = entries[0];
        if (borderBoxSize[0].inlineSize < responsiveBreakpoints.tablet_v.max) {
          if (responsiveMobileRef.current !== true) {
            updateResponsiveMobile(true);
          }
        } else {
          if (responsiveMobileRef.current !== false) {
            updateResponsiveMobile(false);
          }
        }
      }).observe(document.body);
  }, []);
  return responsiveMobile;
};
