import { getWeekDays, state, currentDate } from "../../App";
import { useEffect, useRef } from "react";

type Props = {
  updateStateApp: (...args: any[]) => any;
};
export const FooterC = (props: Props & object) => {
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const handleClickLeft = () => {
    const prevCursorDay = new Date(state.weekInfo[0].date);

    const nextCursorDay = new Date(prevCursorDay).setDate(
      prevCursorDay.getDate() - 1,
    );

    state.weekInfo = getWeekDays(new Date(nextCursorDay));
    state.mainAnimation = "leftSlide";
    props.updateStateApp(state.weekInfo);
  };

  const handleClickRight = () => {
    const prevCursorDay = new Date(state.weekInfo[6].date);

    const nextCursorDay = new Date(prevCursorDay).setDate(
      prevCursorDay.getDate() + 1,
    );

    state.weekInfo = getWeekDays(new Date(nextCursorDay));
    state.mainAnimation = "rightSlide";
    props.updateStateApp(state.weekInfo);
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

  const handleTouchStart = (e: TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: TouchEvent) => {
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;

    const deltaX = touchEndX - touchStartX.current;
    const deltaY = touchEndY - touchStartY.current;

    // Минимальное расстояние для свайпа (в пикселях)
    const minSwipeDistance = 50;

    // Проверяем, что свайп более горизонтальный, чем вертикальный
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > minSwipeDistance) {
      if (deltaX > 0) {
        // Свайп вправо → переход на предыдущую неделю
        handleClickLeft();
      } else {
        // Свайп влево → переход на следующую неделю
        handleClickRight();
      }
    }
  };

  useEffect(() => {
    window.addEventListener("touchstart", handleTouchStart as EventListener);
    window.addEventListener("touchend", handleTouchEnd as EventListener);

    return () => {
      window.removeEventListener("touchstart", handleTouchStart as EventListener);
      window.removeEventListener("touchend", handleTouchEnd as EventListener);
    };
  }, []);

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
