/* eslint-disable */
import React from "react";
import { motion } from "framer-motion";

export const BoxesCore = ({ className, ...rest }) => {
  const rows = new Array(150).fill(1);
  const cols = new Array(100).fill(1);

  // Color palette matched to the site's sky-blue / indigo claymorphism theme
  const colors = [
    "rgba(64, 144, 247, 0.7)",   // accent blue
    "rgba(86, 176, 255, 0.6)",   // light blue
    "rgba(147, 197, 253, 0.5)",  // sky-300
    "rgba(99, 102, 241, 0.6)",   // indigo-500
    "rgba(165, 180, 252, 0.5)",  // indigo-300
    "rgba(196, 181, 253, 0.5)",  // violet-300
    "rgba(125, 211, 252, 0.5)",  // sky-300
    "rgba(167, 243, 208, 0.4)",  // emerald-200
    "rgba(253, 224, 71, 0.35)",  // yellow-300
  ];

  const getRandomColor = () => colors[Math.floor(Math.random() * colors.length)];

  return (
    <div
      style={{
        transform: "translate(-40%,-60%) skewX(-48deg) skewY(14deg) scale(0.675) rotate(0deg) translateZ(0)",
        position: "absolute",
        left: "25%",
        padding: "1rem",
        top: "-25%",
        display: "flex",
        width: "100%",
        height: "100%",
        zIndex: 0,
      }}
      {...rest}
    >
      {rows.map((_, i) => (
        <motion.div
          key={`row` + i}
          style={{
            width: "4rem",
            height: "2rem",
            borderLeft: "1px solid rgba(148, 163, 184, 0.25)",
            position: "relative",
            flexShrink: 0,
          }}
        >
          {cols.map((_, j) => (
            <motion.div
              whileHover={{
                backgroundColor: getRandomColor(),
                transition: { duration: 0 },
              }}
              animate={{ transition: { duration: 2 } }}
              key={`col` + j}
              style={{
                width: "4rem",
                height: "2rem",
                borderRight: "1px solid rgba(148, 163, 184, 0.25)",
                borderTop: "1px solid rgba(148, 163, 184, 0.25)",
                position: "relative",
              }}
            >
              {j % 2 === 0 && i % 2 === 0 ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  style={{
                    position: "absolute",
                    height: "1.5rem",
                    width: "2.5rem",
                    top: "-14px",
                    left: "-22px",
                    color: "rgba(148, 163, 184, 0.2)",
                    strokeWidth: "1px",
                    pointerEvents: "none",
                  }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6v12m6-6H6"
                  />
                </svg>
              ) : null}
            </motion.div>
          ))}
        </motion.div>
      ))}
    </div>
  );
};

export const Boxes = React.memo(BoxesCore);
