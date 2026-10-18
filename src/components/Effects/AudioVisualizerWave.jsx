import { useEffect, useRef } from "react";

/**
 * Animated organic audio wave visualizer canvas
 */
const AudioVisualizerWave = ({ isActive = false, color = "#8b5cf6" }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!isActive) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let animationId;
    let step = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const width = canvas.width;
      const height = canvas.height;
      const midY = height / 2;

      ctx.beginPath();
      ctx.moveTo(0, midY);

      for (let x = 0; x < width; x++) {
        // Multi-frequency organic sine wave
        const y =
          midY +
          Math.sin(x * 0.08 + step) * 6 * Math.sin(step * 0.5) +
          Math.cos(x * 0.04 - step * 0.8) * 4;
        ctx.lineTo(x, y);
      }

      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.lineCap = "round";
      ctx.shadowBlur = 8;
      ctx.shadowColor = color;
      ctx.stroke();

      step += 0.08;
      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [isActive, color]);

  if (!isActive) return null;

  return (
    <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-violet-950/40 border border-violet-500/30 backdrop-blur-md shadow-sm animate-in fade-in">
      <span className="text-[10px] font-bold text-violet-300 uppercase tracking-widest hidden sm:inline">
        Audio Active
      </span>
      <canvas
        ref={canvasRef}
        width={70}
        height={20}
        className="h-4 w-16"
        aria-hidden="true"
      />
    </div>
  );
};

export default AudioVisualizerWave;
