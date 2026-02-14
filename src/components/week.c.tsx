import { state, updateState } from "../App";
import { DayC } from "./day.c";

export const WeekC = () => {
  const weekInfo = state.weekInfo;

  return (
    <div className="week">
      {weekInfo.map((d) => {
        const key = d.date.toISOString().split('T')[0];
        return <DayC key={key} dayName={d.dayName} digit={d.digit} ></DayC>;
      })}
    </div>
  );
};
