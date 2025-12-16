import { useSpring, animated } from "react-spring";

const NumberCounter = ({ n, fixed }) => {
  const { number } = useSpring({
    from: { number: 0 },
    number: n,
    delay: 200,
    config: { mass: 1, tension: 20, friction: 10, duration: 1000 },
  });
  return (
    <animated.span className="mr-[-6px] ml-[-6px]">
      {number.to((n) => n.toFixed(fixed))}
    </animated.span>
  );
};

export default NumberCounter;
