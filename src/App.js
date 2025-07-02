import "./App.css";
import { MainC } from "./components/main.c";
import { FooterC } from "./components/footer/footer.c";
import { HeaderC } from "./components/header/header.c";

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
