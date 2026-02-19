import { getWeekDays, state, currentDate } from "../../App";

type Props = {
  updateStateApp: (...args: any[]) => any;
};
export const FooterC = (props: Props & object) => {
  const handleClickLeft = () => {
    const mainElement = document.getElementById("main");
    if (mainElement) {
      mainElement.style.transition = "transform 0.4s ease-out";
      mainElement.style.transform = "translateX(0)";
    }

    const prevCursorDay = new Date(state.weekInfo[0].date);
    const nextCursorDay = new Date(prevCursorDay).setDate(
      prevCursorDay.getDate() - 1,
    );

    setTimeout(() => {
      state.weekInfo = getWeekDays(new Date(nextCursorDay));
      props.updateStateApp(state.weekInfo);
      if (mainElement) {
        mainElement.style.transition = "none";
        mainElement.style.transform = "translateX(-100%)";
      }
    }, 400);
  };

  const handleClickRight = () => {
    const mainElement = document.getElementById("main");
    if (mainElement) {
      mainElement.style.transition = "transform 0.4s ease-out";
      mainElement.style.transform = "translateX(-200%)";
    }

    const prevCursorDay = new Date(state.weekInfo[6].date);
    const nextCursorDay = new Date(prevCursorDay).setDate(
      prevCursorDay.getDate() + 1,
    );

    setTimeout(() => {
      state.weekInfo = getWeekDays(new Date(nextCursorDay));
      props.updateStateApp(state.weekInfo);
      if (mainElement) {
        mainElement.style.transition = "none";
        mainElement.style.transform = "translateX(-100%)";
      }
    }, 400);
  };

  const handleClickToday = () => {
    // Определить, в какую сторону анимировать
    const currentFirstDay = state.weekInfo[0].date.getTime();
    const todayFirstDay = getWeekDays(currentDate)[0].date.getTime();

    if (todayFirstDay < currentFirstDay) {
      state.mainAnimation = "leftSlide";
    } else if (todayFirstDay > currentFirstDay) {
      state.mainAnimation = "rightSlide";
    } else {
      state.mainAnimation = "";
    }

    state.weekInfo = getWeekDays(currentDate);
    props.updateStateApp(state.weekInfo);
  };


  const firstDayStr = `${
    state.weekInfo[0].digit
  }.${state.weekInfo[0].date.getMonth() + 1}.${state.weekInfo[0].date.getFullYear()}`;
  const lastDayStr = `${
    state.weekInfo[6].digit
  }.${state.weekInfo[6].date.getMonth() + 1}.${state.weekInfo[6].date.getFullYear()}`;

  return (
    <div id="footer">
      <div id="footerDates">
        <div id="footerText">
          {firstDayStr} - {lastDayStr}
        </div>
        <button id="todayButton" onClick={handleClickToday}>
          Сегодня
        </button>
      </div>
      <button id="leftArrowButton" onClick={handleClickLeft}>
        🔙
      </button>
      <button id="rightArrowButton" onClick={handleClickRight}>
        🔜
      </button>
    </div>
  );
};
