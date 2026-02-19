import { state, getWeekDays } from "../App";
import { TaskI } from "../interfaces/task.interface";
import { WeekC } from "./week.c";

export const MainC = ({
  updateAppState,
}: {
  updateAppState: (
    tasks: TaskI[],
  ) => void;
}) => {
  const currentWeekInfo = state.weekInfo;
  const prevWeekDate = new Date(currentWeekInfo[0].date);
  prevWeekDate.setDate(prevWeekDate.getDate() - 1);
  const prevWeekInfo = getWeekDays(prevWeekDate);

  const nextWeekDate = new Date(currentWeekInfo[6].date);
  nextWeekDate.setDate(nextWeekDate.getDate() + 1);
  const nextWeekInfo = getWeekDays(nextWeekDate);

  return (
    <div id="main" style={{ display: "flex", overflow: "hidden" }}>
      <div style={{ width: "100%", minWidth: "100%", flexShrink: 0 }}>
        <WeekC weekInfo={prevWeekInfo} updateAppState={updateAppState}></WeekC>
      </div>
      <div style={{ width: "100%", minWidth: "100%", flexShrink: 0 }}>
        <WeekC weekInfo={currentWeekInfo} updateAppState={updateAppState}></WeekC>
      </div>
      <div style={{ width: "100%", minWidth: "100%", flexShrink: 0 }}>
        <WeekC weekInfo={nextWeekInfo} updateAppState={updateAppState}></WeekC>
      </div>
    </div>
  );
};
