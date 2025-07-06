import { useEffect, useRef, useState } from "react";
import { state } from "../../App";

export const HeaderC = () => {
  const [weekInfo, setState] = useState(state.weekInfo);
  const weekInfoRef = useRef(weekInfo);

  useEffect(() => {
    weekInfoRef.current = weekInfo;
  }, [weekInfo]);

  const firstDayStr = `${state.weekInfo[0].date.getMonth()}.${
    state.weekInfo[0].digit
  }`;
  const lastDayStr = `${state.weekInfo[6].date.getMonth()}.${
    state.weekInfo[6].digit
  }`;
  const handleClick = () => {
    console.log("clickOnHeader");
    return undefined;
  };
  return <div id="header" onClick={handleClick()}>{firstDayStr} - {lastDayStr}</div>;
};
