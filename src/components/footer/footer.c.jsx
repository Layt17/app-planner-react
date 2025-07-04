import { useState } from "react";
import { getWeekDays, state, updateState, useForceUpdate } from "../../App";

export const FooterC = () => {
  const handleClickLeft = () => {
    const prevCursorDay = new Date(state.weekInfo[0].date);

    const nextCursorDay = new Date(prevCursorDay).setDate(
      prevCursorDay.getDate() - 1
    );
    updateState(undefined, new Date(nextCursorDay));

    state.weekInfo = getWeekDays(new Date(nextCursorDay));
  };
  return (
    <div id="footer">
      <div id="footerText">30.06 - 06-07</div>
      <button id="leftArrowButton" onClick={handleClickLeft}>
        🔙
      </button>
      <button id="rightArrowButton">🔜</button>
    </div>
  );
};
