//framerMotion.tsx
import React from 'react';

type MotionComponentProps = {
  children?: React.ReactNode;
  [key: string]: any;
};

// data- 접두사를 붙이지 않을 속성들
const PRESERVED_PROPS = ['aria-label', 'className', 'role', 'id', 'style'];

// 속성 이름을 소문자로 변환하는 함수, 변환하지 않으면 에러발생
const toLowerCaseKey = (key: string): string => {
  return key.toLowerCase();
};

// 동적 프로퍼티 접근을 위한 Proxy 패턴 사용
// framer-motion 모킹시 props 앞에 data- 를 붙이기 위해 사용
export const motion = new Proxy(
  {},
  {
    get: (_, tag: string) => {
      return function MotionComponent({
        children,
        ...props
      }: MotionComponentProps) {
        const Tag = tag as keyof React.JSX.IntrinsicElements;
        return (
          <Tag
            data-testid={`motion-${tag}`}
            {...Object.entries(props).reduce(
              (acc, [key, value]) => ({
                ...acc,
                ...(key.startsWith('data-') || PRESERVED_PROPS.includes(key)
                  ? { [key]: value }
                  : { [`data-${toLowerCaseKey(key)}`]: JSON.stringify(value) }),
              }),
              {},
            )}
          >
            {children}
          </Tag>
        );
      };
    },
  },
);

export const AnimatePresence = ({
  children,
}: {
  children: React.ReactNode;
}) => <div data-testid="animate-presence">{children}</div>;

export default { motion, AnimatePresence };
