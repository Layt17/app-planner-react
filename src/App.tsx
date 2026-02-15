import "./App.css";
import { useEffect, useState } from "react";
import { HeaderC } from "./components/header/header.c";
import { MainC } from "./components/main.c";
import { FooterC } from "./components/footer/footer.c";
import { TgAppDataI } from "./interfaces/tg-web-app-data.interface";
import axios from "axios";
import { NotificationI } from "./interfaces/notification.interface";

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
  actionsDataOnCurrentWeek: [] as { date: string; name: string; id?: string }[],
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

  useEffect(() => {
    // Перенесите логику с window и асинхронные запросы сюда
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const tgWebAppDataHash = new URLSearchParams(
      hashParams.get("tgWebAppData") || "",
    );

    const tgData = JSON.parse(tgWebAppDataHash.get("user") || "{}");
    setUserInfo({
      queryId: tgWebAppDataHash.get("query_id") || "",
      user: {
        username: tgData?.username || "username",
        firstName: tgData?.first_name || "firstName",
        lastName: tgData?.last_name || "lastName",
        languageCode: tgData?.language_code || "language_code",
        isPremium: tgData?.is_premium || false,
      },
    });

    // Асинхронный запрос
    axios
      .get("http://localhost:8000/notifications/my-notifs/927408284")
      .then((response) => {
        const mappedNotifs = (response.data as NotificationI[]).map((n) => {
          return {
            date: new Date(n.time).toISOString(),
            name: n.text,
            id: n.id,
          };
        });

        state.actionsDataOnCurrentWeek = mappedNotifs;
        setAppState((prev) => ({
          ...prev,
          actionsDataOnCurrentWeek: mappedNotifs,
        }));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading...</div>;

  const updateAppState = (newTasks: { date: string; name: string }[]) => {
    state.actionsDataOnCurrentWeek = newTasks;
    setAppState((prev) => ({ ...prev, actionsDataOnCurrentWeek: newTasks }));
  };

  return (
    <div className="App">
      <title>ПЛАНИРОВЩИК</title>
      <HeaderC userInfo={userInfo!} />
      <MainC updateAppState={updateAppState} />
      <FooterC updateStateApp={setAppState} />
    </div>
  );
}

export default App;
