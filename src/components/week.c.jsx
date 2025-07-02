import { DayC } from "./day.c";

export const WeekC = () => {
  const days = ["Пн", "Вт", "Ср", "Чт", "Пт", "С", "В"];

  return (
    <div className="week">
      {days.map((d) => {
        const key = "day" + d;
        return <DayC key={key} dayName={d}></DayC>;
      })}
    </div>
  );
};
