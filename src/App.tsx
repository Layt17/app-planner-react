import "./App.css";
import { useState } from "react";
import { HeaderC } from "./components/header/header.c";
import { MainC } from "./components/main.c";
import { FooterC } from "./components/footer/footer.c";

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
      new Date(cursorDay).setDate(new Date(cursorDay).getDate() + 1)
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
  mainAnimation: '',
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
  const [appState, updateStateApp] = useState(state);
  return (
    <div className="App">
      <title>ПЛАНИРОВЩИК</title>
      <HeaderC></HeaderC>
      <MainC></MainC>
      <FooterC updateStateApp={updateStateApp}></FooterC>
    </div>
  );
}
export default App;
