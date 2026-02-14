import { useState } from "react";
import { state } from "../App";

export const DayC = ({
  dayName,
  digit,
}: {
  dayName: string;
  digit: number;
}) => {
  const [selectedHour, setSelectedHour] = useState<string | null>(null);
  const [expandedTask, setExpandedTask] = useState<{ name: string; time: string } | null>(null);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [closingHourModal, setClosingHourModal] = useState(false);
  const [closingDetailModal, setClosingDetailModal] = useState(false);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    setTouchEnd(e.changedTouches[0].clientX);
    if (touchStart && e.changedTouches[0].clientX) {
      const distance = touchStart - e.changedTouches[0].clientX;
      if (Math.abs(distance) > 50) {
        if (distance > 0 && expandedTask) {
          setClosingDetailModal(true);
          setTimeout(() => {
            setExpandedTask(null);
            setClosingDetailModal(false);
          }, 300);
        } else if (distance < 0 && selectedHour) {
          setClosingHourModal(true);
          setTimeout(() => {
            setSelectedHour(null);
            setClosingHourModal(false);
          }, 300);
        }
      }
    }
  };

  const closeHourModal = () => {
    setClosingHourModal(true);
    setTimeout(() => {
      setSelectedHour(null);
      setClosingHourModal(false);
    }, 300);
  };

  const closeDetailModal = () => {
    setClosingDetailModal(true);
    setTimeout(() => {
      setExpandedTask(null);
      setClosingDetailModal(false);
    }, 300);
  };
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
      try {
        const actionDate = new Date(a.date);
        const actionHour = String(a.date).split("T")[1]?.split(":")[0];
        return actionDate.getDate() === digit && actionHour === h;
      } catch {
        return false;
      }
    });

    let className = 'hour';
    // if (hourActions.length) {
    //   className += ' busy'
    // };

    const displayDots = hourActions.slice(0, 3);
    const remainingCount = hourActions.length > 3 ? hourActions.length - 3 : 0;

    const divHour = (
      <div
        key={"hour" + h}
        className={className}
        onClick={() => setSelectedHour(h)}
        style={{ cursor: hourActions.length > 0 ? 'pointer' : 'default' }}
      >
        {displayDots.map((_, idx) => (
          <div key={idx} className="busyHour"></div>
        ))}
        {remainingCount > 0 && <span className="busyHourMore">+{remainingCount}</span>}
        {h}
      </div>
    );
    hoursDivs.push(divHour);
  }

  const selectedHourActions = selectedHour
    ? state.actionsDataOnCurrentWeek.filter((a) => {
        try {
          const actionDate = new Date(a.date);
          const actionHour = String(a.date).split("T")[1]?.split(":")[0];
          return actionDate.getDate() === digit && actionHour === selectedHour;
        } catch {
          return false;
        }
      })
    : [];

  const dayDiv = (
    <div key={"day" + dayName} className="day">
      {hoursDivs}
      {selectedHour && (
        <div
          className={`modal-overlay ${closingHourModal ? 'closing' : ''}`}
          onClick={closeHourModal}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div className={`modal-content ${closingHourModal ? 'slide-up' : ''}`} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{digit} {dayName} - {selectedHour}:00</h3>
              <button
                className="modal-close"
                onClick={closeHourModal}
              >
                ✕
              </button>
            </div>
            <div className="modal-body">
              {selectedHourActions.length > 0 ? (
                <ul>
                  {selectedHourActions
                    .sort((a, b) => {
                      const timeA = a.date.split("T")[1];
                      const timeB = b.date.split("T")[1];
                      return timeB.localeCompare(timeA);
                    })
                    .map((action, idx) => {
                      const time = action.date.split("T")[1].substring(0, 5);
                      return (
                        <li key={idx}>
                          <div className="task-time">{time}</div>
                          <div className="task-name">{action.name}</div>
                          <button
                            className="expand-btn"
                            onClick={() =>
                              setExpandedTask({ name: action.name, time })
                            }
                            title="Посмотреть полное описание"
                          >
                            ➤
                          </button>
                        </li>
                      );
                    })}
                </ul>
              ) : (
                <p>Нет заданий</p>
              )}
            </div>
          </div>
        </div>
      )}
      {expandedTask && (
        <div
          className={`modal-overlay ${closingDetailModal ? 'closing' : ''}`}
          onClick={closeDetailModal}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div className={`modal-content modal-details ${closingDetailModal ? 'slide-right' : ''}`} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{expandedTask.time} - Описание</h3>
              <button
                className="modal-close"
                onClick={closeDetailModal}
              >
                ✕
              </button>
            </div>
            <div className="modal-body details-body">
              <p>{expandedTask.name}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
  return dayDiv;
};
