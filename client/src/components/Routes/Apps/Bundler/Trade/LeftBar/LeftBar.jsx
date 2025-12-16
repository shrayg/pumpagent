import { useState, useEffect, useRef } from "react";
import Comments from "./Comments";
import Holders from "./Holders";

const LeftBar = ({
  userData,
  ca,
  trackedHolders,
  holders,
  setHolders,
  form,
}) => {
  const leftBarRef = useRef(null);
  const [leftBarHeight, setLeftBarHeight] = useState(0);

  const updateHeight = () => {
    if (leftBarRef.current) {
      setLeftBarHeight(leftBarRef.current.offsetHeight);
    }
  };

  useEffect(() => {
    updateHeight(); // Initial measurement
    window.addEventListener("resize", updateHeight); // Update on resize
    return () => window.removeEventListener("resize", updateHeight);
  }, []);

  return (
    <div
      ref={leftBarRef}
      className="min-w-[280px] max-w-[280px] border-r border-gray-900 flex flex-col"
    >
      <Holders
        trackedHolders={trackedHolders}
        ca={ca}
        form={form}
        userData={userData}
        holders={holders}
        setHolders={setHolders}
      />
      <Comments userData={userData} leftBarHeight={leftBarHeight} ca={ca} />
    </div>
  );
};

export default LeftBar;
