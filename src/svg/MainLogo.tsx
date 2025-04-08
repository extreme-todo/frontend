import { useMemo } from 'react';
import {
  motion,
  MotionStyle,
  MotionValue,
  TargetAndTransition,
  Transition,
} from 'motion/react';

export const MainLogo = ({
  mainLogoPathLengthForScroll,
  mainLogoFillForScroll,
}: {
  mainLogoPathLengthForScroll: MotionValue<number>;
  mainLogoFillForScroll: MotionValue<string>;
}) => {
  const pathStyle: MotionStyle = useMemo(
    () => ({
      pathLength: mainLogoPathLengthForScroll,
      fill: mainLogoFillForScroll,
    }),
    [mainLogoPathLengthForScroll, mainLogoFillForScroll],
  );
  return (
    <svg
      width="540"
      height="180"
      viewBox="0 0 540 180"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      id="logo"
    >
      <g clipPath="url(#clip0_2019_1454)">
        <motion.path
          d="M112.43 60.66H112.91L122.51 43.7H139.15L122.19 72.02L139.79 100.34H122.67L112.91 83.22H112.43L102.51 100.34H85.5498L102.99 72.02L86.0298 43.7H102.83L112.43 60.66Z"
          fill="none"
          stroke="#523EA1"
          strokeWidth={2}
          initial={pathInit}
          animate={pathAnim}
          transition={pathTrans}
          style={pathStyle}
        />
        <motion.path
          d="M147.51 43.7H196.31V55.86H179.35V100.34H164.63V55.86H147.51V43.7Z"
          fill="none"
          stroke="#523EA1"
          strokeWidth={2}
          initial={pathInit}
          animate={pathAnim}
          transition={pathTrans}
          style={pathStyle}
        />
        <motion.path
          d="M203.67 43.7H227.67C240.39 43.78 248.63 50.98 248.63 62.9C248.63 70.74 245.03 76.18 239.03 79.1399L250.55 100.34H234.39L224.23 81.4599H218.55V100.34H203.67V43.7ZM224.31 69.9399C229.91 69.8599 233.11 67.86 233.11 62.9C233.11 57.94 229.91 55.7 224.31 55.7H218.55V69.9399H224.31Z"
          fill="none"
          stroke="#523EA1"
          strokeWidth={2}
          initial={pathInit}
          animate={pathAnim}
          transition={pathTrans}
          style={pathStyle}
        />
        <motion.path
          d="M331.95 43.7L345.55 76.66H346.19L359.63 43.7H378.19V100.34H363.63V67.06H363.15L350.35 99.86H341.39L328.43 66.9H328.11V100.34H313.55V43.7H331.95Z"
          fill="none"
          stroke="#523EA1"
          strokeWidth={2}
          initial={pathInit}
          animate={pathAnim}
          transition={{
            pathLength: { duration: 2, ease: 'easeInOut' },
            fill: { delay: 2, duration: 0.6, ease: 'easeInOut' },
          }}
          style={pathStyle}
        />
        <motion.path
          d="M263.02 111.96H311.82V124.12H294.86V168.6H280.14V124.12H263.02V111.96Z"
          fill="none"
          stroke="#523EA1"
          strokeWidth={2}
          initial={pathInit}
          animate={pathAnim}
          transition={pathTrans}
          style={pathStyle}
        />
        <motion.path
          d="M408.14 168.6V111.96H429.42C446.86 112.04 457.74 122.6 457.74 140.28C457.74 157.96 446.86 168.6 429.58 168.6H408.14ZM429.1 155.96C437.82 155.96 442.78 152.2 442.7 140.28C442.78 128.36 437.82 124.68 428.78 124.6H423.02V155.96H429.1Z"
          fill="none"
          stroke="#523EA1"
          strokeWidth={2}
          initial={pathInit}
          animate={pathAnim}
          transition={pathTrans}
          style={pathStyle}
        />
        <motion.path
          d="M274.96 55.86C275.02 55.86 275.08 55.88 275.14 55.88V55.86H305.57V43.7H271.74C262.2 43.7 254.46 51.4399 254.46 60.9799C254.46 65.18 255.96 69.03 258.45 72.02C255.96 75.01 254.46 78.8599 254.46 83.0599C254.46 92.5999 262.2 100.34 271.74 100.34H305.57V88.3399H274.96C272.13 88.3399 269.84 86.0499 269.84 83.22C269.84 80.39 272.13 78.0999 274.96 78.0999H305.5V66.0999H275.14V66.08C275.08 66.08 275.02 66.0999 274.96 66.0999C272.13 66.0999 269.84 63.8099 269.84 60.9799C269.84 58.15 272.13 55.86 274.96 55.86Z"
          fill="none"
          stroke="#523EA1"
          strokeWidth={2}
          initial={pathInit}
          animate={pathAnim}
          transition={pathTrans}
          style={pathStyle}
        />
        <motion.path
          d="M407.47 55.86C407.53 55.86 407.59 55.88 407.65 55.88V55.86H438.08V43.7H404.25C394.71 43.7 386.97 51.4399 386.97 60.9799C386.97 65.18 388.47 69.03 390.96 72.02C388.47 75.01 386.97 78.8599 386.97 83.0599C386.97 92.5999 394.71 100.34 404.25 100.34H438.08V88.3399H407.47C404.64 88.3399 402.35 86.0499 402.35 83.22C402.35 80.39 404.64 78.0999 407.47 78.0999H438.01V66.0999H407.65V66.08C407.59 66.08 407.53 66.0999 407.47 66.0999C404.64 66.0999 402.35 63.8099 402.35 60.9799C402.35 58.15 404.64 55.86 407.47 55.86Z"
          fill="none"
          stroke="#523EA1"
          strokeWidth={2}
          initial={pathInit}
          animate={pathAnim}
          transition={pathTrans}
          style={pathStyle}
        />
        <motion.path
          d="M39.7002 100.34H76.7102V88.3401H57.7002L39.7002 100.34Z"
          fill="none"
          stroke="#523EA1"
          strokeWidth={2}
          initial={pathInit}
          animate={pathAnim}
          transition={pathTrans}
          style={pathStyle}
        />
        <motion.path
          d="M103.02 10L14 40.13L46.53 69.57L24.89 100.34H32.17L83.23 64.3L65.67 53.07L103.02 10Z"
          fill="none"
          stroke="#523EA1"
          strokeWidth={2}
          initial={pathInit}
          animate={pathAnim}
          transition={pathTrans}
          style={pathStyle}
        />
        <motion.path
          d="M334.98 114.09C334.98 114.09 334.09 107.58 335.87 104.39L342.89 105.67C342.89 105.67 340.34 110.65 340.72 113.07C340.72 113.07 343.22 111 350.04 109.56C353.34 108.86 357 107.39 357 107.39C357 107.39 357.26 111.96 347.87 119.84C347.87 119.84 347.81 126.48 347.49 128.27C347.49 128.27 340.09 123.67 338.81 122.27C338.81 122.27 333.07 125.21 329.62 126.87C329.62 126.87 329.3 123.68 329.3 122.27C329.3 122.27 324 121.31 320.3 118.5C320.3 118.5 325.73 117.67 328.66 116.33C331.59 114.99 334.98 114.1 334.98 114.1V114.09Z"
          fill="none"
          stroke="#523EA1"
          strokeWidth={1}
          initial={pathInit}
          animate={pathAnim}
          transition={pathTrans}
          style={pathStyle}
        />
        <motion.path
          d="M356.96 112.92C355.63 115.03 353.46 117.66 349.86 120.77C349.83 122.73 349.73 127.07 349.46 128.61L348.94 131.51L346.43 129.96C344.97 129.06 340.77 126.41 338.52 124.65C336.64 125.6 332.96 127.47 330.48 128.66L327.91 129.9L327.63 127.06C327.63 126.96 327.46 125.34 327.37 123.87C326.44 123.63 325.19 123.24 323.84 122.7C320.13 127.59 317.92 133.68 317.92 140.29C317.92 156.37 330.95 169.4 347.03 169.4C363.11 169.4 376.14 156.37 376.14 140.29C376.14 127.71 368.15 116.99 356.98 112.93L356.96 112.92Z"
          fill="none"
          stroke="#523EA1"
          strokeWidth={1}
          initial={pathInit}
          animate={pathAnim}
          transition={pathTrans}
          style={pathStyle}
        />
        <motion.path
          d="M483.68 114.09C483.68 114.09 482.79 107.58 484.57 104.39L491.59 105.67C491.59 105.67 489.04 110.65 489.42 113.07C489.42 113.07 491.92 111 498.74 109.56C502.04 108.86 505.7 107.39 505.7 107.39C505.7 107.39 505.96 111.96 496.57 119.84C496.57 119.84 496.51 126.48 496.19 128.27C496.19 128.27 488.79 123.67 487.51 122.27C487.51 122.27 481.77 125.21 478.32 126.87C478.32 126.87 478 123.68 478 122.27C478 122.27 472.7 121.31 469 118.5C469 118.5 474.43 117.67 477.36 116.33C480.29 114.99 483.68 114.1 483.68 114.1V114.09Z"
          fill="none"
          stroke="#523EA1"
          strokeWidth={1}
          initial={pathInit}
          animate={pathAnim}
          transition={pathTrans}
          style={pathStyle}
        />
        <motion.path
          d="M505.67 112.92C504.34 115.03 502.17 117.66 498.57 120.77C498.54 122.73 498.44 127.07 498.17 128.61L497.65 131.51L495.14 129.96C493.68 129.06 489.48 126.41 487.23 124.65C485.35 125.6 481.67 127.47 479.19 128.66L476.62 129.9L476.34 127.06C476.34 126.96 476.17 125.34 476.08 123.87C475.15 123.63 473.9 123.24 472.55 122.7C468.84 127.59 466.63 133.68 466.63 140.29C466.63 156.37 479.66 169.4 495.74 169.4C511.82 169.4 524.85 156.37 524.85 140.29C524.85 127.71 516.86 116.99 505.69 112.93L505.67 112.92Z"
          fill="none"
          stroke="#523EA1"
          strokeWidth={1}
          initial={pathInit}
          animate={pathAnim}
          transition={pathTrans}
          style={pathStyle}
        />
        <motion.path
          d="M397.66 121.36H384.77V134.25H397.66V121.36Z"
          fill="none"
          stroke="#523EA1"
          strokeWidth={2}
          initial={pathInit}
          animate={pathAnim}
          transition={pathTrans}
          style={pathStyle}
        />
        <motion.path
          d="M397.66 145.62H384.77V158.51H397.66V145.62Z"
          fill="none"
          stroke="#523EA1"
          strokeWidth={2}
          initial={pathInit}
          animate={pathAnim}
          transition={pathTrans}
          style={pathStyle}
        />
      </g>
      <defs>
        <clipPath id="clip0_2019_1454">
          <rect
            width="510.83"
            height="159.38"
            fill="white"
            transform="translate(14 10)"
          />
        </clipPath>
      </defs>
    </svg>
  );
};

const pathInit: TargetAndTransition = {
  pathLength: 0,
  fill: 'rgba(82, 62, 161, 0)',
};
const pathAnim: TargetAndTransition = {
  pathLength: 1,
  fill: 'rgba(82, 62, 161, 1)',
};
const pathTrans: Transition = {
  pathLength: { duration: 2, ease: 'easeInOut' },
  fill: { delay: 2, duration: 1, ease: 'easeInOut' },
};
