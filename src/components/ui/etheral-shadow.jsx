import React, { useRef, useId, useEffect } from 'react';
import { animate, useMotionValue } from 'framer-motion';

function mapRange(value, fromLow, fromHigh, toLow, toHigh) {
  if (fromLow === fromHigh) return toLow;
  return toLow + ((value - fromLow) / (fromHigh - fromLow)) * (toHigh - toLow);
}

export function EtherealShadow({
  sizing = 'fill',
  color = 'rgba(64, 144, 247, 0.6)',
  animation = { scale: 100, speed: 90 },
  noise = { opacity: 1, scale: 1.2 },
  style,
  className,
}) {
  const rawId = useId().replace(/:/g, '');
  const filterId = `shadowoverlay-${rawId}`;

  const animationEnabled = !!(animation && animation.scale > 0);
  const feColorMatrixRef = useRef(null);
  const hueRotateMotionValue = useMotionValue(180);
  const hueRotateAnimRef = useRef(null);

  const displacementScale = animation
    ? mapRange(animation.scale, 1, 100, 20, 100)
    : 0;
  const animationDuration = animation
    ? mapRange(animation.speed, 1, 100, 1000, 50)
    : 1;

  useEffect(() => {
    if (!feColorMatrixRef.current || !animationEnabled) return;

    if (hueRotateAnimRef.current) hueRotateAnimRef.current.stop();

    hueRotateMotionValue.set(0);
    hueRotateAnimRef.current = animate(hueRotateMotionValue, 360, {
      duration: animationDuration / 25,
      repeat: Infinity,
      repeatType: 'loop',
      repeatDelay: 0,
      ease: 'linear',
      delay: 0,
      onUpdate: (value) => {
        if (feColorMatrixRef.current) {
          feColorMatrixRef.current.setAttribute('values', String(value));
        }
      },
    });

    return () => {
      if (hueRotateAnimRef.current) hueRotateAnimRef.current.stop();
    };
  }, [animationEnabled, animationDuration]);

  const baseFreqX = mapRange(animation?.scale ?? 100, 0, 100, 0.001, 0.0005);
  const baseFreqY = mapRange(animation?.scale ?? 100, 0, 100, 0.004, 0.002);

  return (
    <div
      className={className}
      style={{
        overflow: 'hidden',
        position: 'relative',
        width: '100%',
        height: '100%',
        ...style,
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: -displacementScale,
          filter: animationEnabled ? `url(#${filterId}) blur(4px)` : 'none',
        }}
      >
        {animationEnabled && (
          /* SVG sits at 0,0 but overflow:visible so the filter defs are accessible */
          <svg
            xmlns="http://www.w3.org/2000/svg"
            style={{ position: 'absolute', top: 0, left: 0, width: '1px', height: '1px', overflow: 'visible' }}
          >
            <defs>
              <filter id={filterId} x="-50%" y="-50%" width="200%" height="200%" colorInterpolationFilters="sRGB">
                {/* Step 1: generate organic turbulence noise */}
                <feTurbulence
                  result="undulation"
                  numOctaves="2"
                  baseFrequency={`${baseFreqX},${baseFreqY}`}
                  seed="0"
                  type="turbulence"
                />
                {/* Step 2: animate hue of that noise — drives the morph */}
                <feColorMatrix
                  ref={feColorMatrixRef}
                  in="undulation"
                  type="hueRotate"
                  values="180"
                />
                {/* Step 3: extract bright regions from source for displacement map */}
                <feColorMatrix
                  in="SourceGraphic"
                  result="circulation"
                  type="matrix"
                  values="4 0 0 0 1  4 0 0 0 1  4 0 0 0 1  1 0 0 0 0"
                />
                {/* Step 4: first displacement using turbulence-colored map */}
                <feDisplacementMap
                  in="SourceGraphic"
                  in2="circulation"
                  scale={displacementScale}
                  xChannelSelector="R"
                  yChannelSelector="G"
                  result="dist"
                />
                {/* Step 5: second displacement against raw undulation = fluid organic look */}
                <feDisplacementMap
                  in="dist"
                  in2="undulation"
                  scale={displacementScale}
                  xChannelSelector="R"
                  yChannelSelector="G"
                  result="output"
                />
              </filter>
            </defs>
          </svg>
        )}

        {/* The colored shadow blob — masked to organic shape */}
        <div
          style={{
            backgroundColor: color,
            maskImage: `url('https://framerusercontent.com/images/ceBGguIpUU8luwByxuQz79t7To.png')`,
            WebkitMaskImage: `url('https://framerusercontent.com/images/ceBGguIpUU8luwByxuQz79t7To.png')`,
            maskSize: sizing === 'stretch' ? '100% 100%' : 'cover',
            WebkitMaskSize: sizing === 'stretch' ? '100% 100%' : 'cover',
            maskRepeat: 'no-repeat',
            WebkitMaskRepeat: 'no-repeat',
            maskPosition: 'center',
            WebkitMaskPosition: 'center',
            width: '100%',
            height: '100%',
          }}
        />
      </div>

      {/* Optional grain noise overlay */}
      {noise && noise.opacity > 0 && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url("https://framerusercontent.com/images/g0QcWrxr87K0ufOxIUFBakwYA8.png")`,
            backgroundSize: `${noise.scale * 200}px`,
            backgroundRepeat: 'repeat',
            opacity: noise.opacity / 2,
            pointerEvents: 'none',
          }}
        />
      )}
    </div>
  );
}
