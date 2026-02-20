import { local, state } from "../../App";
import { TgAppDataI } from "../../interfaces/tg-web-app-data.interface";

export const HeaderC = ({ userInfo }: { userInfo: TgAppDataI }) => {
  return (
    <div id="header">
      <div className="header-content">
        <div className="header-username">{userInfo.user.username}</div>
        <div className="header-text">
          на дворе {state.weekInfo[0].date.toLocaleString(local, { month: "long" })}
        </div>
      </div>
    </div>
  );
};
