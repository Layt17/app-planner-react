import { state } from "../App";
import { WeekC } from "./week.c";

export const MainC = ({ updateAppState }: { updateAppState: (tasks: { date: string, name: string }[]) => void }) => {
  const cssClassAnimation = state.mainAnimation;
  return (
    <div id="main" key={state.weekInfo[0].digit} className={cssClassAnimation}>
      <WeekC updateAppState={updateAppState}></WeekC>
    </div>
  );
};
