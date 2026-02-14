import { state } from "../App";
import { DayC } from "./day.c";

export const WeekC = ({ updateAppState }: { updateAppState: (tasks: { date: string, name: string }[]) => void }) => {
  const weekInfo = state.weekInfo;

  return (
    <div className="week">
      {weekInfo.map((d) => {
        const key = d.date.toISOString().split('T')[0];
        return <DayC key={key} dayName={d.dayName} digit={d.digit} updateAppState={updateAppState} ></DayC>;
      })}
    </div>
  );
};
