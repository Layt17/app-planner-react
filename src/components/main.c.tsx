import { state } from "../App";
import { WeekC } from "./week.c";

export const MainC = () => {
  return (
    <div id="main" key={state.weekInfo[0].digit}>
      <WeekC></WeekC>
    </div>
  );
};
