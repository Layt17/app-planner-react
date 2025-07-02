export const DayC = ({ dayName }) => {
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
    "24",
  ];


  let hoursDivs = [(<div key={'dayName' + dayName} className="dayName">{dayName}</div>)];
  for (let i = hours.length - 1; i >= 0; --i) {
    const h = hours[i];
    const divHour = (<div key={'hour' + h} className="hour">{h}</div>);
    hoursDivs.push(divHour);
  }

  const dayDiv = (<div key={'day' + dayName} className="day">{hoursDivs}</div>);
  return dayDiv;
}