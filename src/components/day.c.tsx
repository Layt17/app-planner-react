import { useState } from "react";
import { state } from "../App";

export const DayC = ({
  dayName,
  digit,
  updateAppState,
}: {
  dayName: string;
  digit: number;
  updateAppState: (tasks: { date: string, name: string }[]) => void;
}) => {
  const [selectedHour, setSelectedHour] = useState<string | null>(null);
  const [expandedTask, setExpandedTask] = useState<{ name: string; time: string } | null>(null);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [closingHourModal, setClosingHourModal] = useState(false);
  const [closingDetailModal, setClosingDetailModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [closingCreateModal, setClosingCreateModal] = useState(false);
  const [taskDescription, setTaskDescription] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

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

  const openCreateModal = () => {
    // Find the date for this day
    const weekDays = state.weekInfo;
    const dayDate = weekDays.find(d => d.digit === digit)?.date;
    setSelectedDate(dayDate || null);
    setTaskDescription("");
    setShowCreateModal(true);
  };

  const closeCreateModal = () => {
    setClosingCreateModal(true);
    setTimeout(() => {
      setShowCreateModal(false);
      setClosingCreateModal(false);
    }, 300);
  };

  const handleSaveTask = () => {
    if (!taskDescription.trim() || !selectedDate || !selectedHour) return;

    const newDate = new Date(selectedDate);
    newDate.setHours(parseInt(selectedHour), 0, 0, 0);

    const newTask = {
      date: newDate.toISOString(),
      name: taskDescription,
    };

    // Add to local state and trigger re-render
    const updatedTasks = [...state.actionsDataOnCurrentWeek, newTask];
    state.actionsDataOnCurrentWeek = updatedTasks;
    updateAppState(updatedTasks);

    closeCreateModal();
    // Close the hour modal after saving
    closeHourModal();
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
              <div className="modal-header-buttons">
                <button
                  className="add-task-btn-header"
                  onClick={openCreateModal}
                  title="Добавить задание"
                >
                  +
                </button>
                <button
                  className="modal-close"
                  onClick={closeHourModal}
                >
                  ✕
                </button>
              </div>
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
      {showCreateModal && (
        <div
          className={`modal-overlay ${closingCreateModal ? 'closing' : ''}`}
          onClick={closeCreateModal}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div className={`modal-content modal-create ${closingCreateModal ? 'slide-up' : ''}`} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Новое задание</h3>
              <button
                className="modal-close"
                onClick={closeCreateModal}
              >
                ✕
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Описание задания</label>
                <textarea
                  value={taskDescription}
                  onChange={(e) => setTaskDescription(e.target.value)}
                  placeholder="Введите описание задания..."
                  className="task-input"
                  rows={4}
                />
              </div>
              <button
                className="save-task-btn"
                onClick={handleSaveTask}
                disabled={!taskDescription.trim()}
              >
                Сохранить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
  return dayDiv;
};
