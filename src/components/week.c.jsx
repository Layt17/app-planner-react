import { state, updateState } from "../App";
import { DayC } from "./day.c";

export const WeekC = () => {
  const days = ["Пн", "Вт", "Ср", "Чт", "Пт", "С", "В"];

  //сделать на английском
  const dayPlaceDict = {
    понедельник: 1,
    вторник: 2,
    среда: 3,
    четверг: 4,
    пятница: 5,
    суббота: 6,
    воскресенье: 7,
  };

  //gen 7 days
  const weekInfo = [];

  const currentDay = new Date();

  const cursorDayNumb = dayPlaceDict[state.dayName];

  // get monday day
  let cursorDay = currentDay.setDate(
    currentDay.getDate() + (1 - cursorDayNumb)
  );
  // push firstDay
  weekInfo.push({
    dayName: new Date(cursorDay).toLocaleDateString(undefined, { weekday: 'short' }),
    digit: new Date(cursorDay).getDate(),
  });

  //gen next 6 days
  for (let i = 0; i < 6; i++) {
    cursorDay = new Date(cursorDay).setDate(new Date(cursorDay).getDate() + 1);
    const date = new Date(cursorDay);
    weekInfo.push({
      dayName: date.toLocaleDateString(undefined, { weekday: 'short' }),
      digit: date.getDate(),
    });
  }

  // set state on sutarday
  updateState(new Date(cursorDay));

  return (
    <div className="week">
      {weekInfo.map((d) => {
        const key = "day" + d.dayName;
        return <DayC key={key} dayName={d.dayName} digit={d.digit} ></DayC>;
      })}
    </div>
  );
};
