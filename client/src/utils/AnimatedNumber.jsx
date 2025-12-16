// utils/AnimatedNumber.js
import { useEffect, useRef, useState } from "react";

const AnimatedNumber = ({ children }) => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect(); // Only trigger once
        }
      },
      {
        threshold: 0.3,
      }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return <div ref={ref}>{visible ? children : null}</div>;
};

export default AnimatedNumber;
