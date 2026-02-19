import { DayC } from "./day.c";

interface WeekDayInfo {
  dayName: string;
  digit: number;
  date: Date;
}

export const WeekC = ({
  weekInfo,
  updateAppState,
}: {
  weekInfo: WeekDayInfo[];
  updateAppState: (
    tasks: { date: string; name: string; status: string }[],
  ) => void;
}) => {
  return (
    <div className="week">
      {weekInfo.map((d) => {
        const key = d.date.toISOString().split("T")[0];
        return (
          <DayC
            key={key}
            dayName={d.dayName}
            digit={d.digit}
            updateAppState={updateAppState}
          ></DayC>
        );
      })}
    </div>
  );
};
