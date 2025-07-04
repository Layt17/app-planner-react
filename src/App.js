import "./App.css";
import { MainC } from "./components/main.c";
import { FooterC } from "./components/footer/footer.c";
import { HeaderC } from "./components/header/header.c";
import { useState } from "react";

const local = "ru-RU";
const currentDate = new Date();

export const getWeekDays = (date) => {
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

  const cursorDayNumb =
    dayPlaceDict[currentDay.toLocaleDateString(local, { weekday: "long" })];

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
    cursorDay = new Date(cursorDay).setDate(new Date(cursorDay).getDate() + 1);
    const date = new Date(cursorDay);
    weekInfo.push({
      dayName: date.toLocaleDateString(local, { weekday: "short" }),
      digit: date.getDate(),
      date,
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
};

export const updateState = (date, nextCursorDay) => {
  state.d = date ?? state.d;
  state.month = date?.getMonth() || state.month;
  state.year = date?.getFullYear() || state.year;
  state.day = date?.getDate() || state.day;
  state.dayName =
    date?.toLocaleDateString(local, { weekday: "long" }) ?? state.dayName;
  state.nextCursorDay = nextCursorDay ?? state.nextCursorDay;
};

export function useForceUpdate() {
  const [value, setValue] = useState(0);

  console.log('RERENDER');
  return () => setValue((value) => value + 1);
}

function App() {
  const [count, setCount] = useState(0);
  return (
    <div className="App">
      <title>ПЛАНИРОВЩИК</title>
      <HeaderC></HeaderC>
      <MainC></MainC>
      <FooterC></FooterC>
    </div>
  );
}

export default App;
