import { useEffect, useRef, useState } from "react";
import { local, state } from "../../App";

export const HeaderC = () => {
  return (
    <div id="header">
      {state.weekInfo[0].date.toLocaleString(local, { month: "long" })}
    </div>
  );
};
