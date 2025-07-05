import { useState } from "react";
import { getWeekDays, state, stateTest, updateState } from "../../App";

export const FooterC = () => {
  const [stateWeek, setStateWeek] = useState(state.weekInfo);
  const handleClickLeft = () => {
    const prevCursorDay = new Date(state.weekInfo[0].date);

    console.log(prevCursorDay.toISOString());

    const nextCursorDay = new Date(prevCursorDay).setDate(
      prevCursorDay.getDate() - 1
    );
    console.log(new Date(nextCursorDay).toISOString());
    // updateState(undefined, new Date(nextCursorDay));

    state.weekInfo = getWeekDays(new Date(nextCursorDay));
    setStateWeek(getWeekDays(new Date(nextCursorDay)));
  };

  const firstDayStr = `${state.weekInfo[0].date.getMonth()}.${
    state.weekInfo[0].digit
  }`;
  const lastDayStr = `${state.weekInfo[6].date.getMonth()}.${
    state.weekInfo[6].digit
  }`;

  return (
    <div id="footer">
      <div id="footerText">
        {firstDayStr} - {lastDayStr}
      </div>
      <button id="leftArrowButton" onClick={handleClickLeft}>
        🔙
      </button>
      <button id="rightArrowButton">🔜</button>
    </div>
  );
};
