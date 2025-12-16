import { useRef, useEffect, useState } from "react";
import useAnimationFrame from "../../../utils/useAnimationFrame";
import Cross from "./Cross";

const CanvasContainer = ({ config }) => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [crosses, setCrosses] = useState([]);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const animationRef = useRef();
  const requestRef = useRef();

  // Initialize canvas dimensions
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        setDimensions({ width, height });
      }
    };

    // Set initial dimensions
    updateDimensions();

    // Add resize listener
    window.addEventListener("resize", updateDimensions);

    // Clean up
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  // Initialize crosses
  useEffect(() => {
    if (dimensions.width === 0 || dimensions.height === 0) return;

    const newCrosses = [];
    for (let i = 0; i < config.crossCount; i++) {
      newCrosses.push(
        new Cross(
          dimensions.width,
          dimensions.height,
          config.sizeVariation,
          config.speedFactor
        )
      );
    }

    setCrosses(newCrosses);

    // Clean up existing animation frame
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [dimensions, config.crossCount, config.sizeVariation]);

  // Handle click to add crosses
  const handleCanvasClick = (e) => {
    if (!config.allowInteraction) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newCross = new Cross(
      dimensions.width,
      dimensions.height,
      config.sizeVariation,
      config.speedFactor,
      x,
      y
    );

    setCrosses((prev) => [...prev, newCross]);
  };

  // Animation loop
  useAnimationFrame((deltaTime) => {
    if (!canvasRef.current || crosses.length === 0) return;

    const ctx = canvasRef.current.getContext("2d");
    const { width, height } = dimensions;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Update and draw crosses
    crosses.forEach((cross) => {
      cross.update(deltaTime, config.speedFactor);
      cross.draw(ctx);
    });
  });

  return (
    <div className="w-full h-full opacity-30" ref={containerRef}>
      {dimensions.width > 0 && dimensions.height > 0 && (
        <canvas
          ref={canvasRef}
          width={dimensions.width}
          height={dimensions.height}
          onClick={handleCanvasClick}
        />
      )}
    </div>
  );
};

export default CanvasContainer;
