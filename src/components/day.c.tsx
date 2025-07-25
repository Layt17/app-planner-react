import { state } from "../App";

export const DayC = ({
  dayName,
  digit,
}: {
  dayName: string;
  digit: number;
}) => {
  const hours = [
    "00",
    "01",
    "02",
    "03",
    "04",
    "05",
    "06",
    "07",
    "08",
    "09",
    "10",
    "11",
    "12",
    "13",
    "14",
    "15",
    "16",
    "17",
    "18",
    "19",
    "20",
    "21",
    "22",
    "23",
  ];

  let digitDiv = (
    <div key={"dayName" + dayName + digit} className="dayName">
      {digit || 333}
    </div>
  );
  let dayNameDiv = (
    <div key={"dayName" + dayName} className="dayName">
      {dayName}
    </div>
  );
  let hoursDivs = [digitDiv, dayNameDiv];
  for (let i = hours.length - 1; i >= 0; --i) {

    const h = hours[i];

    const hourActions = state.actionsDataOnCurrentWeek.filter((a) => {
      return a.date.split("T")[1].split(":")[0] === h;
    });

    let className = 'hour';
    // if (hourActions.length) {
    //   className += ' busy'
    // };

    const divHour = (
      <div key={"hour" + h} className={className}>
        {hourActions.length ? <div className="busyHour"> V </div> : ''}{h}
      </div>
    );
    hoursDivs.push(divHour);
  }

  const dayDiv = (
    <div key={"day" + dayName} className="day">
      {hoursDivs}
    </div>
  );
  return dayDiv;
};
