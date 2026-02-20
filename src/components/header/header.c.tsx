import { useState } from "react";
import { local, state } from "../../App";
import { TgAppDataI } from "../../interfaces/tg-web-app-data.interface";

export const HeaderC = ({ userInfo }: { userInfo: TgAppDataI }) => {
  const [showSettings, setShowSettings] = useState(false);
  const [favoriteWord, setFavoriteWord] = useState(
    localStorage.getItem("favoriteWord") || "молодец!"
  );
  const [favoriteEmoji, setFavoriteEmoji] = useState(
    localStorage.getItem("favoriteEmoji") || "⛵"
  );
  const [tempWord, setTempWord] = useState(favoriteWord);
  const [tempEmoji, setTempEmoji] = useState(favoriteEmoji);

  const handleSave = () => {
    localStorage.setItem("favoriteWord", tempWord || "молодец!");
    localStorage.setItem("favoriteEmoji", tempEmoji || "⛵");
    setFavoriteWord(tempWord || "молодец!");
    setFavoriteEmoji(tempEmoji || "⛵");
    setShowSettings(false);
  };

  const handleClose = () => {
    setTempWord(favoriteWord);
    setTempEmoji(favoriteEmoji);
    setShowSettings(false);
  };

  return (
    <>
      <div id="header">
        <div className="header-content">
          <div className="header-username">{userInfo.user.username}</div>
          <div className="header-text">
            на дворе {state.weekInfo[0].date.toLocaleString(local, { month: "long" })}
          </div>
        </div>
        <button
          className="header-settings-btn"
          title="Настройки"
          onClick={() => setShowSettings(true)}
        >
          ⚙️
        </button>
      </div>

      {showSettings && (
        <div className="modal-overlay" onClick={handleClose}>
          <div className="modal-content settings-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Настройки</h3>
              <button className="modal-close" onClick={handleClose}>
                ✕
              </button>
            </div>
            <div className="modal-body settings-body">
              <div className="form-group">
                <label htmlFor="word-input">Любимое слово:</label>
                <input
                  id="word-input"
                  type="text"
                  className="task-input"
                  value={tempWord}
                  onChange={(e) => setTempWord(e.target.value)}
                  placeholder="Введите слово"
                />
              </div>
              <div className="form-group">
                <label htmlFor="emoji-input">Любимый эмодзи:</label>
                <input
                  id="emoji-input"
                  type="text"
                  className="task-input"
                  value={tempEmoji}
                  onChange={(e) => setTempEmoji(e.target.value)}
                  placeholder="Введите эмодзи"
                  maxLength={2}
                />
              </div>
              <div className="settings-preview">
                <span>Предпросмотр: {tempEmoji} {tempWord}</span>
              </div>
            </div>
            <div className="settings-actions">
              <button className="save-task-btn" onClick={handleSave}>
                Сохранить
              </button>
              <button
                className="save-task-btn"
                style={{ backgroundColor: "#999", marginTop: "10px" }}
                onClick={handleClose}
              >
                Отмена
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
