import { state } from "../App";
import { WeekC } from "./week.c";

export const MainC = () => {
  const cssClassAnimation = state.mainAnimation;
  return (
    <div id="main" key={state.weekInfo[0].digit} className={cssClassAnimation}>
      <WeekC></WeekC>
    </div>
  );
};
