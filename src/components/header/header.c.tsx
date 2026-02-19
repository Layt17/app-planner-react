import { local, state } from "../../App";
import { TgAppDataI } from "../../interfaces/tg-web-app-data.interface";

export const HeaderC = ({ userInfo }: { userInfo: TgAppDataI }) => {
  return (
    <div id="header">
      {userInfo.user.username}{', на дворе '} 
      {state.weekInfo[0].date.toLocaleString(local, { month: "long" })}
    </div>
  );
};
