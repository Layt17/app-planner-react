import "./App.css";
import { MainC } from "./components/main.c";
import { FooterC } from "./components/footer/footer.c";
import { HeaderC } from "./components/header/header.c";

const local = 'ru-RU';
const currentDate = new Date();
export const state = {
  d: currentDate,
  month: currentDate.getMonth(),
  year: currentDate.getFullYear(),
  day: currentDate.getDate(),
  dayName: currentDate.toLocaleDateString(local, { weekday: 'long' }),
  local,
}

export const updateState = (date) => {
  state.d = date;
  state.month = date.getMonth();
  state.year = date.getFullYear();
  state.day = date.getDate();
  state.dayName = date.toLocaleDateString(local, { weekday: 'long' });
}

function App() {
  return (
    <div className="App">
      <title>ПЛАНИРОВЩИК</title>
      <HeaderC></HeaderC>
      <MainC></MainC>
      <FooterC></FooterC>
    </div>
  );
}

export default App;
