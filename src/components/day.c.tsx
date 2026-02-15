import { useState, useEffect } from "react";
import { state } from "../App";
import axios from "axios";

export const DayC = ({
  dayName,
  digit,
  updateAppState,
}: {
  dayName: string;
  digit: number;
  updateAppState: (tasks: { date: string; name: string; id?: string }[]) => void;
}) => {
  const [selectedHour, setSelectedHour] = useState<string | null>(null);
  const [expandedTask, setExpandedTask] = useState<{
    date: string;
    name: string;
    id?: string;
  } | null>(null);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [closingHourModal, setClosingHourModal] = useState(false);
  const [closingDetailModal, setClosingDetailModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [closingCreateModal, setClosingCreateModal] = useState(false);
  const [taskDescription, setTaskDescription] = useState("");
  const [taskMinutes, setTaskMinutes] = useState("00");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  useEffect(() => {
    // Initialize selectedDate when component mounts
    const weekDays = state.weekInfo;
    const dayDate = weekDays.find((d) => d.digit === digit)?.date;
    if (dayDate) {
      setSelectedDate(dayDate);
    }
  }, [digit]);

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

  const handleDeleteTask = () => {
    if (!expandedTask) return;

    // Find and remove the task from the list - match by exact date and name
    const updatedTasks = state.actionsDataOnCurrentWeek.filter((task) => {
      return !(task.id === expandedTask.id);
    });

    state.actionsDataOnCurrentWeek = updatedTasks;
    updateAppState(updatedTasks);

    closeDetailModal();
  };

  const openCreateModal = () => {
    // Find the date for this day
    const weekDays = state.weekInfo;
    const dayDate = weekDays.find((d) => d.digit === digit)?.date;
    setSelectedDate(dayDate || null);
    setTaskDescription("");
    setTaskMinutes("00");
    setShowCreateModal(true);
  };

  const closeCreateModal = () => {
    setClosingCreateModal(true);
    setTimeout(() => {
      setShowCreateModal(false);
      setClosingCreateModal(false);
    }, 300);
  };

  const handleSaveTask = async () => {
    if (!taskDescription.trim() || !selectedDate || !selectedHour) return;

    const newDate = new Date(selectedDate);
    const hour = parseInt(selectedHour);
    const minutes = parseInt(taskMinutes);
    newDate.setHours(hour, minutes, 0, 0);

    // Get timezone offset
    const tzOffset = newDate.getTimezoneOffset();
    const tzString = `${String(Math.floor(Math.abs(tzOffset) / 60)).padStart(2, "0")}:${String(Math.abs(tzOffset) % 60).padStart(2, "0")}`;
    const sign = tzOffset <= 0 ? "+" : "-";

    // Create ISO string with timezone info
    const year = newDate.getFullYear();
    const month = String(newDate.getMonth() + 1).padStart(2, "0");
    const day = String(newDate.getDate()).padStart(2, "0");
    const h = String(newDate.getHours()).padStart(2, "0");
    const m = String(newDate.getMinutes()).padStart(2, "0");
    const s = String(newDate.getSeconds()).padStart(2, "0");

    const dateWithTz = `${year}-${month}-${day}T${h}:${m}:${s}${sign}${tzString}`;

    try {
      const response = await axios.post("http://localhost:8000/notifications", {
        chatId: "927408284",
        text: taskDescription,
        time: `${h}:${m}`,
        date: `${day}-${month}-${year}`
      });

      // Использовать объект из ответа или создать новый с локальными данными
      const newTask = {
        date: response.data.time,
        name: response.data.text,
        id: response.data.id,
      };

      // Add to local state and trigger re-render
      const updatedTasks = [...state.actionsDataOnCurrentWeek, newTask];
      state.actionsDataOnCurrentWeek = updatedTasks;
      updateAppState(updatedTasks);
    } catch (error) {
      console.error("Error saving task:", error);
      // Если ошибка, все равно добавляем задачу локально
      // const newTask = {
      //   date: dateWithTz,
      //   name: taskDescription,
      // };
      // const updatedTasks = [...state.actionsDataOnCurrentWeek, newTask];
      // state.actionsDataOnCurrentWeek = updatedTasks;
      // updateAppState(updatedTasks);
    }

    // Close create modal but keep hour modal open
    closeCreateModal();
    // Reset form
    setTaskDescription("");
    setTaskMinutes("00");
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

  // Check if this is today's date
  const today = new Date();
  const isToday =
    selectedDate &&
    selectedDate.getDate() === today.getDate() &&
    selectedDate.getMonth() === today.getMonth() &&
    selectedDate.getFullYear() === today.getFullYear();
  let dayNameclassName = "dayName";

  if (isToday) {
    dayNameclassName += " today-name ";
  }

  let digitDiv = (
    <div key={"dayName" + dayName + digit} className={dayNameclassName}>
      {digit || 333}
    </div>
  );
  let dayNameDiv = (
    <div key={"dayName" + dayName} className={dayNameclassName}>
      {dayName}
    </div>
  );
  let hoursDivs = [digitDiv, dayNameDiv];

  for (let i = hours.length - 1; i >= 0; --i) {
    const h = hours[i];

    const hourActions = state.actionsDataOnCurrentWeek.filter((a) => {
      try {
        console.log("Filtering task:", a);
        // Parse hour directly from ISO string (before timezone info)
        const timePart = a.date.split("T")[1];
        const actionHour = timePart?.split(":")[0];

        // Parse date part
        const datePart = a.date.split("T")[0];
        const [year, month, day] = datePart.split("-").map(Number);

        // Create a date object for comparison
        const actionDate = new Date(year, month - 1, day);
        const currentDayDate = new Date(
          selectedDate?.getFullYear() || 0,
          selectedDate?.getMonth() || 0,
          digit,
        );

        console.log(
          "Task hour:",
          actionHour,
          "Current hour:",
          h,
          "Task date:",
          actionDate,
          "Current date:",
          currentDayDate,
        );

        return (
          actionDate.getTime() === currentDayDate.getTime() && actionHour === h
        );
      } catch (e) {
        console.error("Filter error:", e);
        return false;
      }
    });

    let className = "hour";
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
        style={{ cursor: hourActions.length > 0 ? "pointer" : "default" }}
      >
        {displayDots.map((_, idx) => (
          <div key={idx} className="busyHour"></div>
        ))}
        {remainingCount > 0 && (
          <span className="busyHourMore">+{remainingCount}</span>
        )}
        {h}
      </div>
    );
    hoursDivs.push(divHour);
  }

  const selectedHourActions = selectedHour
    ? state.actionsDataOnCurrentWeek.filter((a) => {
        try {
          // Parse hour directly from ISO string
          const timePart = a.date.split("T")[1];
          const actionHour = timePart?.split(":")[0];

          // Parse date part
          const datePart = a.date.split("T")[0];
          const [year, month, day] = datePart.split("-").map(Number);

          // Create a date object for comparison
          const actionDate = new Date(year, month - 1, day);
          const currentDayDate = new Date(
            selectedDate?.getFullYear() || 0,
            selectedDate?.getMonth() || 0,
            digit,
          );

          return (
            actionDate.getTime() === currentDayDate.getTime() &&
            actionHour === selectedHour
          );
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
          className={`modal-overlay ${closingHourModal ? "closing" : ""}`}
          onClick={closeHourModal}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div
            className={`modal-content ${closingHourModal ? "slide-up" : ""}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h3>
                {digit} {dayName} - {selectedHour}:00
              </h3>
              <div className="modal-header-buttons">
                <button
                  className="add-task-btn-header"
                  onClick={openCreateModal}
                  title="Добавить задание"
                >
                  +
                </button>
                <button className="modal-close" onClick={closeHourModal}>
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
                              setExpandedTask({
                                date: action.date,
                                name: action.name,
                                id: "new",
                              })
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
          className={`modal-overlay ${closingDetailModal ? "closing" : ""}`}
          onClick={closeDetailModal}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div
            className={`modal-content modal-details ${closingDetailModal ? "slide-right" : ""}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h3>
                {expandedTask.date.split("T")[1].substring(0, 5)} - Описание
              </h3>
              <div className="modal-header-buttons">
                <button
                  className="delete-task-btn"
                  onClick={handleDeleteTask}
                  title="Удалить задание"
                >
                  🗑️
                </button>
                <button className="modal-close" onClick={closeDetailModal}>
                  ✕
                </button>
              </div>
            </div>
            <div className="modal-body details-body">
              <p>{expandedTask.name}</p>
            </div>
          </div>
        </div>
      )}
      {showCreateModal && (
        <div
          className={`modal-overlay ${closingCreateModal ? "closing" : ""}`}
          onClick={closeCreateModal}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div
            className={`modal-content modal-create ${closingCreateModal ? "slide-up" : ""}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h3>Новое задание</h3>
              <button className="modal-close" onClick={closeCreateModal}>
                ✕
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Час: {selectedHour}</label>
              </div>
              <div className="form-group">
                <label>Минуты</label>
                <select
                  value={taskMinutes}
                  onChange={(e) =>
                    setTaskMinutes(e.target.value.padStart(2, "0"))
                  }
                  className="task-input"
                  style={{ height: "40px", fontSize: "14px" }}
                >
                  {Array.from({ length: 12 }, (_, i) => {
                    const minutes = i * 5;
                    return (
                      <option key={i} value={String(minutes).padStart(2, "0")}>
                        {String(minutes).padStart(2, "0")}
                      </option>
                    );
                  })}
                </select>
              </div>
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
