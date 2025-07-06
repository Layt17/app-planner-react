import { useState } from "react";
import { getWeekDays, state } from "../../App";

type Props = {
  updateStateApp: (...args: any[]) => any;
};
export const FooterC = (props: Props & object) => {
  const [stateWeek, setStateWeek] = useState(state.weekInfo);
  const handleClickLeft = () => {
    const prevCursorDay = new Date(state.weekInfo[0].date);

    console.log(prevCursorDay.toISOString());

    const nextCursorDay = new Date(prevCursorDay).setDate(
      prevCursorDay.getDate() - 1
    );
    console.log(new Date(nextCursorDay).toISOString());

    state.weekInfo = getWeekDays(new Date(nextCursorDay));
    props.updateStateApp(state.weekInfo);
    setStateWeek(getWeekDays(new Date(nextCursorDay)));
  };

  const handleClickRight = () => {
    const prevCursorDay = new Date(state.weekInfo[6].date);

    const nextCursorDay = new Date(prevCursorDay).setDate(
      prevCursorDay.getDate() + 1
    );

    state.weekInfo = getWeekDays(new Date(nextCursorDay));
    props.updateStateApp(state.weekInfo);
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
      <button id="rightArrowButton" onClick={handleClickRight}>🔜</button>
    </div>
  );
};
