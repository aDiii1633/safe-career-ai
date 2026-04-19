import { cn } from "./utils";

// Simple cn utility if not already in utils
export function GradientBackground({ className, style }) {
  return (
    <div
      className={className}
      style={{
        width: '100%',
        minHeight: '500px',
        position: 'relative',
        overflow: 'hidden',
        ...style,
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 0,
          backgroundImage: `radial-gradient(125% 125% at 50% 10%, #ffffff 40%, #4090f7 100%)`,
          backgroundSize: '100% 100%',
        }}
      />
    </div>
  );
}
