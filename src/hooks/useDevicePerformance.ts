import { useState, useEffect } from 'react';

export interface DevicePerformance {
  isLowEnd: boolean;
  isMobile: boolean;
  isTablet: boolean;
  dpr: number;
  maxLights: number;
  enableParallax: boolean;
}

export function useDevicePerformance(): DevicePerformance {
  const [perf, setPerf] = useState<DevicePerformance>({
    isLowEnd: false,
    isMobile: false,
    isTablet: false,
    dpr: 1.5,
    maxLights: 4,
    enableParallax: true,
  });

  useEffect(() => {
    const width = window.innerWidth;
    const isMobile = width < 768;
    const isTablet = width >= 768 && width < 1024;

    // Detect hardware capabilities safely
    const nav = typeof navigator !== 'undefined' ? navigator : null;
    const concurrency = nav?.hardwareConcurrency || 4;
    const deviceMemory = (nav as unknown as { deviceMemory?: number })?.deviceMemory || 8;

    const isLowEnd = concurrency <= 2 || deviceMemory < 4 || (isMobile && width < 380);

    // Target DPR: desktop 1.5 (max 1.75), mobile 1.0 - 1.25, low-end 1.0
    let targetDpr = 1.5;
    if (isLowEnd) {
      targetDpr = 1.0;
    } else if (isMobile) {
      targetDpr = Math.min(1.25, window.devicePixelRatio || 1);
    } else {
      targetDpr = Math.min(1.75, window.devicePixelRatio || 1.5);
    }

    setPerf({
      isLowEnd,
      isMobile,
      isTablet,
      dpr: targetDpr,
      maxLights: isLowEnd ? 2 : 4,
      enableParallax: !isMobile && !isLowEnd,
    });

    const handleResize = () => {
      const w = window.innerWidth;
      setPerf((prev) => ({
        ...prev,
        isMobile: w < 768,
        isTablet: w >= 768 && w < 1024,
      }));
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return perf;
}
