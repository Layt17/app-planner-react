import { state } from "../App";
import { TaskI } from "../interfaces/task.interface";
import { WeekC } from "./week.c";

export const MainC = ({
  updateAppState,
}: {
  updateAppState: (
    tasks: TaskI[],
  ) => void;
}) => {
  const cssClassAnimation = state.mainAnimation;
  return (
    <div id="main" key={state.weekInfo[0].digit} className={cssClassAnimation}>
      <WeekC updateAppState={updateAppState}></WeekC>
    </div>
  );
};
