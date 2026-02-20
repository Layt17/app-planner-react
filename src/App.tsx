import "./App.css";
import { useEffect, useState } from "react";
import { HeaderC } from "./components/header/header.c";
import { MainC } from "./components/main.c";
import { FooterC } from "./components/footer/footer.c";
import { FloatingStarC } from "./components/floating-star.c";
import { TgAppDataI } from "./interfaces/tg-web-app-data.interface";
import axios from "axios";
import { NotificationI } from "./interfaces/notification.interface";
import { TaskI } from "./interfaces/task.interface";

export const local = "ru-RU";
export const currentDate = new Date();

export const getWeekDays = (date?: Date) => {
  const dayPlaceDict = {
    понедельник: 1,
    вторник: 2,
    среда: 3,
    четверг: 4,
    пятница: 5,
    суббота: 6,
    воскресенье: 7,
  };

  const weekInfo = [];

  const currentDay = date ?? new Date();

  const dayName = currentDay.toLocaleDateString(local, {
    weekday: "long",
  }) as keyof typeof dayPlaceDict;

  const cursorDayNumb = dayPlaceDict[dayName];

  // get monday day
  let cursorDay = new Date(currentDay);
  cursorDay.setDate(currentDay.getDate() + (1 - cursorDayNumb));
  // push firstDay
  const firstDayDate = new Date(cursorDay);
  weekInfo.push({
    dayName: firstDayDate.toLocaleDateString(local, {
      weekday: "short",
    }),
    digit: firstDayDate.getDate(),
    date: firstDayDate,
  });

  //gen next 6 days
  for (let i = 0; i < 6; i++) {
    cursorDay = new Date(
      new Date(cursorDay).setDate(new Date(cursorDay).getDate() + 1),
    );
    weekInfo.push({
      dayName: cursorDay.toLocaleDateString(local, { weekday: "short" }),
      digit: cursorDay.getDate(),
      date: cursorDay,
    });
  }

  return weekInfo;
};

export const state = {
  currentWeek: null,
  d: currentDate,
  month: currentDate.getMonth(),
  year: currentDate.getFullYear(),
  day: currentDate.getDate(),
  dayName: currentDate.toLocaleDateString(local, { weekday: "long" }),
  local,
  nextCursorDay: currentDate,
  weekInfo: getWeekDays(),
  mainAnimation: "",
  actionsDataOnCurrentWeek: [] as TaskI[],
  userInfo: null as TgAppDataI | null,
};

export const updateState = (date?: Date, nextCursorDay?: Date) => {
  state.d = date ?? state.d;
  state.month = date?.getMonth() || state.month;
  state.year = date?.getFullYear() || state.year;
  state.day = date?.getDate() || state.day;
  state.dayName =
    date?.toLocaleDateString(local, { weekday: "long" }) ?? state.dayName;
  state.nextCursorDay = nextCursorDay ?? state.nextCursorDay;
};

function App() {
  const [appState, setAppState] = useState(state);
  const [userInfo, setUserInfo] = useState<TgAppDataI | null>(null);
  const [loading, setLoading] = useState(true);
  const [isTg, setIsTg] = useState(true);

  useEffect(() => {
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const tgWebAppDataHash = new URLSearchParams(
      hashParams.get("tgWebAppData") || "",
    );
    
    const tgData = JSON.parse(tgWebAppDataHash.get("user") || "{}");
    
    // local
    if (process.env.REACT_APP_ENV === 'local'){
      tgData['id'] = '927408284';
    }

    if (!tgData.id) {
      setIsTg(false);
      setLoading(false);
      return;
    }

    const userInfoData = {
      queryId: tgWebAppDataHash.get("query_id") || "",
      chatId: tgData?.id,
      user: {
        username: tgData?.username || "username",
        firstName: tgData?.first_name || "firstName",
        lastName: tgData?.last_name || "lastName",
        languageCode: tgData?.language_code || "language_code",
        isPremium: tgData?.is_premium || false,
      },
    };
    state.userInfo = userInfoData;
    setUserInfo(userInfoData);

    // Асинхронный запрос
    axios
      .get(
        `${process.env.REACT_APP_BACKEND_HOST}/notifications/my-notifs/${state.userInfo?.chatId}`,
      )
      .then((response) => {
        const mappedNotifs: TaskI[] = (response.data as NotificationI[]).map(
          (n) => ({
            date: new Date(n.time).toISOString(),
            name: n.text,
            status: n.status,
            id: n.id,
          }),
        );

        state.actionsDataOnCurrentWeek = mappedNotifs;
        setAppState((prev) => ({
          ...prev,
          actionsDataOnCurrentWeek: mappedNotifs,
        }));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // Если не Telegram — показываем кнопку
  if (!isTg) {
    return (
      <div className="not-tg" style={{ textAlign: "center", marginTop: "50px" }}>
        <h2>Откройте приложение через Telegram</h2>
        <a
          href={process.env.REACT_APP_TG_BOT_LINK}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-block",
            marginTop: "20px",
            padding: "10px 20px",
            backgroundColor: "#0088cc",
            color: "#fff",
            borderRadius: "5px",
            textDecoration: "none",
            fontWeight: "bold",
          }}
        >
          Открыть Telegram-бот
        </a>
      </div>
    );
  }

  if (loading) return <div>Loading...</div>;

  return (
    <div className="App">
      <title>ПЛАНИРОВЩИК</title>
      <FloatingStarC />
      <HeaderC userInfo={userInfo!} />
      <MainC updateAppState={(tasks) =>
        setAppState((prev) => ({ ...prev, actionsDataOnCurrentWeek: tasks }))
      } />
      <FooterC updateStateApp={setAppState} />
    </div>
  );
}

export default App;
