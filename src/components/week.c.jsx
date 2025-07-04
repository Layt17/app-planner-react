import { state, updateState } from "../App";
import { DayC } from "./day.c";

export const WeekC = () => {
  const weekInfo = state.weekInfo;

  // set state.nextCursorDay on sutarday
  // updateState(new Date(cursorDay));

  return (
    <div className="week">
      {weekInfo.map((d) => {
        const key = "day" + d.dayName;
        return <DayC key={key} dayName={d.dayName} digit={d.digit} ></DayC>;
      })}
    </div>
  );
};
