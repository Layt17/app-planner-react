import { useState, useEffect } from "react";
import { state } from "../App";
import axios from "axios";
import { TaskI } from "../interfaces/task.interface";

export const DayC = ({
  dayName,
  digit,
  updateAppState,
}: {
  dayName: string;
  digit: number;
  updateAppState: (tasks: TaskI[]) => void;
}) => {
  const [selectedHour, setSelectedHour] = useState<string | null>(null);
  const [expandedTask, setExpandedTask] = useState<TaskI | null>(null);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [closingHourModal, setClosingHourModal] = useState(false);
  const [closingDetailModal, setClosingDetailModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [closingCreateModal, setClosingCreateModal] = useState(false);
  const [showDayModal, setShowDayModal] = useState(false);
  const [closingDayModal, setClosingDayModal] = useState(false);
  const [taskDescription, setTaskDescription] = useState("");
  const [taskMinutes, setTaskMinutes] = useState("00");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    // Initialize selectedDate when component mounts
    const weekDays = state.weekInfo;
    const dayDate = weekDays.find((d) => d.digit === digit)?.date;
    if (dayDate) {
      setSelectedDate(dayDate);
    }
  }, [digit]);

  useEffect(() => {
    // Update current time every minute to update the line position
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  const SWIPE_THRESHOLD = 50;
  const ANIMATION_DURATION = 300;

  const closeModal = (
    setClosing: (val: boolean) => void,
    setState: (val: any) => void,
    newValue: any,
  ) => {
    setClosing(true);
    setTimeout(() => {
      setState(newValue);
      setClosing(false);
    }, ANIMATION_DURATION);
  };

  // const handleTouchStart = (e: React.TouchEvent) => {
  //   setTouchStart(e.targetTouches[0].clientX);
  // };

  // const handleTouchEnd = (e: React.TouchEvent) => {
  //   setTouchEnd(e.changedTouches[0].clientX);
  //   if (touchStart && e.changedTouches[0].clientX) {
  //     const distance = touchStart - e.changedTouches[0].clientX;
  //     if (Math.abs(distance) > SWIPE_THRESHOLD) {
  //       if (distance > 0 && expandedTask) {
  //         closeDetailModal();
  //       } else if (distance < 0 && selectedHour) {
  //         closeHourModal();
  //       }
  //     }
  //   }
  // };

  const closeHourModal = () => {
    closeModal(setClosingHourModal, setSelectedHour, null);
  };

  const closeDetailModal = () => {
    closeModal(setClosingDetailModal, setExpandedTask, null);
  };

  const handleDeleteTask = async () => {
    if (!expandedTask) return;

    await axios.delete(
      `${process.env.REACT_APP_BACKEND_HOST}/notifications/${expandedTask.id}`,
    );
    // Find and remove the task from the list - match by exact date and name
    const updatedTasks = state.actionsDataOnCurrentWeek.filter((task) => {
      return !(task.id === expandedTask.id);
    });

    state.actionsDataOnCurrentWeek = updatedTasks;
    updateAppState(updatedTasks);

    closeDetailModal();
  };

  const handleCompleteTask = async (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!expandedTask) return;

    createSparkles(e);

    await axios.patch(
      `${process.env.REACT_APP_BACKEND_HOST}/notifications/${expandedTask.id}`,
      { status: "completed" },
    );

    // todo - надо сделать чтобы таски хранились key-value и доставать их по ключу
    state.actionsDataOnCurrentWeek.forEach((t) => {
      if (t.id === expandedTask.id) {
        t.status = "completed";
      }
    });

    updateAppState(state.actionsDataOnCurrentWeek);

    closeDetailModal();
  };

  const getDayDate = () => {
    return state.weekInfo.find((d) => d.digit === digit)?.date || null;
  };

  const getDayTasks = () => {
    return state.actionsDataOnCurrentWeek
      .filter((a) => {
        try {
          const datePart = a.date.split("T")[0];
          const [year, month, day] = datePart.split("-").map(Number);
          const actionDate = new Date(year, month - 1, day);
          const currentDayDate = new Date(
            selectedDate?.getFullYear() || 0,
            selectedDate?.getMonth() || 0,
            digit,
          );
          return actionDate.getTime() === currentDayDate.getTime();
        } catch {
          return false;
        }
      })
      .sort((a, b) => {
        const timeA = a.date.split("T")[1];
        const timeB = b.date.split("T")[1];
        return timeB.localeCompare(timeA);
      });
  };

  const formatFullDate = () => {
    if (!selectedDate) return "";
    const days = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];
    const months = [
      "января",
      "февраля",
      "марта",
      "апреля",
      "мая",
      "июня",
      "июля",
      "августа",
      "сентября",
      "октября",
      "ноября",
      "декабря",
    ];
    const dayOfWeek =
      days[selectedDate.getDay() === 0 ? 6 : selectedDate.getDay() - 1];
    const day = selectedDate.getDate();
    const month = months[selectedDate.getMonth()];
    const year = selectedDate.getFullYear();
    return `${dayOfWeek} ${day} ${month} ${year}г`;
  };

  const formatDateWithTz = (date: Date) => {
    const tzOffset = date.getTimezoneOffset();
    const tzString = `${String(Math.floor(Math.abs(tzOffset) / 60)).padStart(2, "0")}:${String(Math.abs(tzOffset) % 60).padStart(2, "0")}`;
    const sign = tzOffset <= 0 ? "+" : "-";

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const h = String(date.getHours()).padStart(2, "0");
    const m = String(date.getMinutes()).padStart(2, "0");
    const s = String(date.getSeconds()).padStart(2, "0");

    return {
      dateWithTz: `${year}-${month}-${day}T${h}:${m}:${s}${sign}${tzString}`,
      time: `${h}:${m}`,
      date: `${day}-${month}-${year}`,
    };
  };

  const openCreateModal = () => {
    setSelectedDate(getDayDate());
    setTaskDescription("");
    setTaskMinutes("00");
    setShowCreateModal(true);
  };

  const closeCreateModal = () => {
    closeModal(setClosingCreateModal, setShowCreateModal, false);
  };

  const closeDayModal = () => {
    closeModal(setClosingDayModal, setShowDayModal, false);
  };

  const addTaskToState = (newTask: any) => {
    const updatedTasks = [...state.actionsDataOnCurrentWeek, newTask];
    state.actionsDataOnCurrentWeek = updatedTasks;
    updateAppState(updatedTasks);
  };

  const createSparkles = (e: React.MouseEvent<HTMLButtonElement>) => {
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const sparkleEmojis = ["✨", "🎉", "⭐", "💫", "🌟", "🎊", "💥"];

    // Салюты из центра кнопки
    for (let i = 0; i < 40; i++) {
      const angle = Math.random() * Math.PI * 2;
      const distance = 150 + Math.random() * 300;
      const tx = Math.cos(angle) * distance;
      const ty = Math.sin(angle) * distance;

      const sparkle = document.createElement("div");
      sparkle.className = "sparkle";
      sparkle.textContent =
        sparkleEmojis[Math.floor(Math.random() * sparkleEmojis.length)];
      sparkle.style.left = centerX + "px";
      sparkle.style.top = centerY + "px";
      sparkle.style.setProperty("--tx", `${tx}px`);
      sparkle.style.setProperty("--ty", `${ty}px`);
      sparkle.style.setProperty(
        "--duration",
        `${2 + Math.random() * 1.5}s`
      );

      document.body.appendChild(sparkle);

      setTimeout(() => sparkle.remove(), 3500);
    }

    // Салюты слева (летят вправо)
    for (let i = 0; i < 20; i++) {
      const distance = 100 + Math.random() * 250;
      const tx = distance; // вправо
      const ty = (Math.random() - 0.5) * 300; // вверх/вниз

      const sparkle = document.createElement("div");
      sparkle.className = "sparkle";
      sparkle.textContent =
        sparkleEmojis[Math.floor(Math.random() * sparkleEmojis.length)];
      sparkle.style.left = "20px";
      sparkle.style.top = window.innerHeight / 2 + "px";
      sparkle.style.setProperty("--tx", `${tx}px`);
      sparkle.style.setProperty("--ty", `${ty}px`);
      sparkle.style.setProperty(
        "--duration",
        `${2 + Math.random() * 1.5}s`
      );

      document.body.appendChild(sparkle);

      setTimeout(() => sparkle.remove(), 3500);
    }

    // Салюты справа (летят влево)
    for (let i = 0; i < 20; i++) {
      const distance = 100 + Math.random() * 250;
      const tx = -distance; // влево
      const ty = (Math.random() - 0.5) * 300; // вверх/вниз

      const sparkle = document.createElement("div");
      sparkle.className = "sparkle";
      sparkle.textContent =
        sparkleEmojis[Math.floor(Math.random() * sparkleEmojis.length)];
      sparkle.style.left = window.innerWidth - 20 + "px";
      sparkle.style.top = window.innerHeight / 2 + "px";
      sparkle.style.setProperty("--tx", `${tx}px`);
      sparkle.style.setProperty("--ty", `${ty}px`);
      sparkle.style.setProperty(
        "--duration",
        `${2 + Math.random() * 1.5}s`
      );

      document.body.appendChild(sparkle);

      setTimeout(() => sparkle.remove(), 3500);
    }

    // Салюты сверху (летят вниз)
    for (let i = 0; i < 25; i++) {
      const distance = 150 + Math.random() * 250;
      const tx = (Math.random() - 0.5) * 300; // влево/вправо
      const ty = distance; // вниз

      const sparkle = document.createElement("div");
      sparkle.className = "sparkle";
      sparkle.textContent =
        sparkleEmojis[Math.floor(Math.random() * sparkleEmojis.length)];
      sparkle.style.left = window.innerWidth / 2 + "px";
      sparkle.style.top = "40px";
      sparkle.style.setProperty("--tx", `${tx}px`);
      sparkle.style.setProperty("--ty", `${ty}px`);
      sparkle.style.setProperty(
        "--duration",
        `${2 + Math.random() * 1.5}s`
      );

      document.body.appendChild(sparkle);

      setTimeout(() => sparkle.remove(), 3500);
    }
  };

  const handleSaveTask = async (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!taskDescription.trim() || !selectedDate || !selectedHour) return;

    const newDate = new Date(selectedDate);
    newDate.setHours(parseInt(selectedHour), parseInt(taskMinutes), 0, 0);

    const { time, date } = formatDateWithTz(newDate);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_HOST}/notifications`,
        {
          chatId: state.userInfo?.chatId || "",
          text: taskDescription,
          time,
          date,
        },
      );

      const newTask: TaskI = {
        date: response.data.time,
        name: response.data.text,
        status: response.data.status,
        id: response.data.id,
      };

      addTaskToState(newTask);
    } catch (error) {
      console.error("Error saving task:", error);
    }

    closeCreateModal();
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

  // Get current hour for highlighting
  const getCurrentHour = () => {
    if (!isToday) return null;
    return String(currentTime.getHours()).padStart(2, "0");
  };

  let dayNameclassName = "dayName";

  if (isToday) {
    dayNameclassName += " today-name ";
  }

  let digitDiv = (
    <div
      key={"dayName" + dayName + digit}
      className={dayNameclassName}
      onClick={() => setShowDayModal(true)}
      style={{ cursor: "pointer" }}
    >
      {digit || 333}
    </div>
  );
  let dayNameDiv = (
    <div
      key={"dayName" + dayName}
      className={dayNameclassName}
      onClick={() => setShowDayModal(true)}
      style={{ cursor: "pointer" }}
    >
      {dayName}
    </div>
  );
  let hoursDivs = [digitDiv, dayNameDiv];

  for (let i = hours.length - 1; i >= 0; --i) {
    const h = hours[i];

    const hourActions = state.actionsDataOnCurrentWeek.filter((a) => {
      try {
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
    if (isToday) {
      className += " today-hour";
    }

    const currentHourStr = getCurrentHour();
    const isCurrentHour = isToday && currentHourStr === h;

    // Calculate line position based on minutes (0-59 minutes = 100-0%, moving up)
    const getLineTopPosition = () => {
      const minutes = currentTime.getMinutes();
      return 100 - (minutes / 60) * 100;
    };

    const divHour = (
      <div
        key={"hour" + h}
        className={className}
        onClick={() => setSelectedHour(h)}
        style={{
          cursor: hourActions.length > 0 ? "pointer" : "default",
          position: "relative",
        }}
      >
        {displayDots.map((v, idx) => {
          const taskClass =
            v.status === "completed" ? "completedTask" : "inProcessingTask";
          return <div key={idx} className={`busyHour ${taskClass}`}></div>;
        })}
        {isCurrentHour && (
          <>
            <div
              style={{
                position: "absolute",
                right: "2px",
                top: `${getLineTopPosition()}%`,
                transform: "translateY(-50%)",
                width: 0,
                height: 0,
                borderRight: "6px solid rgb(162, 134, 165)",
                borderTop: "4px solid transparent",
                borderBottom: "4px solid transparent",
                zIndex: 5,
              }}
            />
            <div
              style={{
                position: "absolute",
                right: "8px",
                top: `${getLineTopPosition()}%`,
                left: 0,
                height: "1px",
                backgroundColor: "rgba(162, 134, 165, 0.3)",
                transform: "translateY(-50%)",
                zIndex: 4,
              }}
            />
          </>
        )}
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
    <div key={"day" + dayName} className="day" style={{ position: "relative" }}>
      {hoursDivs}
      {selectedHour && (
        <div
          className={`modal-overlay ${closingHourModal ? "closing" : ""}`}
          onClick={closeHourModal}
          // onTouchStart={handleTouchStart}
          // onTouchEnd={handleTouchEnd}
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
                        <li
                          key={idx}
                          className={
                            action.status === "completed"
                              ? "completedTaskList"
                              : "inProcessingTaskList"
                          }
                        >
                          <div className="task-time">{time}</div>
                          <div className="task-name">{action.name}</div>
                          <button
                            className="expand-btn"
                            onClick={() =>
                              setExpandedTask({
                                date: action.date,
                                name: action.name,
                                id: action.id,
                                status: action.status,
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
          className={`modal-overlay ${showDayModal ? "details-on-day" : ""} ${closingDetailModal ? "closing" : ""}`}
          onClick={closeDetailModal}
          // onTouchStart={handleTouchStart}
          // onTouchEnd={handleTouchEnd}
        >
          <div
            className={`modal-content modal-details ${closingDetailModal ? "slide-right" : ""}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h3>
                {expandedTask.date.split("T")[1].substring(0, 5)} - Описание
              </h3>
              <div
                className={
                  expandedTask.status === "completed"
                    ? "completedTaskDetails"
                    : "inProcessingTaskDetails"
                }
              >
                {expandedTask.status === "completed"
                  ? "Выполнено"
                  : "В процессе"}
              </div>
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
            {expandedTask.status !== "completed" && (
              <button
                className="complete-task-btn"
                onClick={handleCompleteTask}
              >
                Выполнить
              </button>
            )}
          </div>
        </div>
      )}
      {showCreateModal && (
        <div
          className={`modal-overlay ${closingCreateModal ? "closing" : ""}`}
          onClick={closeCreateModal}
          // onTouchStart={handleTouchStart}
          // onTouchEnd={handleTouchEnd}
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
                  style={{ height: "40px" }}
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
      {showDayModal && (
        <div
          className={`modal-overlay day-modal-overlay ${closingDayModal ? "closing" : ""}`}
          onClick={closeDayModal}
        >
          <div
            className={`modal-content modal-day ${closingDayModal ? "slide-down" : ""}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h3>{formatFullDate()}</h3>
              <button className="modal-close" onClick={closeDayModal}>
                ✕
              </button>
            </div>
            <div className="modal-body">
              {getDayTasks().length > 0 ? (
                <ul>
                  {getDayTasks().map((action, idx) => {
                    const time = action.date.split("T")[1].substring(0, 5);
                    return (
                      <li
                        key={idx}
                        className={
                          action.status === "completed"
                            ? "completedTaskList"
                            : "inProcessingTaskList"
                        }
                      >
                        <div className="task-time">{time}</div>
                        <div className="task-name">{action.name}</div>
                        <button
                          className="expand-btn"
                          onClick={() =>
                            setExpandedTask({
                              date: action.date,
                              name: action.name,
                              id: action.id,
                              status: action.status,
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
                <p>Нет заданий на этот день</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
  return dayDiv;
};
