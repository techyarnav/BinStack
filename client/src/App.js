import React from "react";
import { ThemeProvider } from "./contexts/ThemeContext";
import Popup from "./components/Popup";

function App() {
  return (
    <ThemeProvider>
      <div className="w-[400px] h-[600px] shadow-2xl border border-slate-200/50 overflow-hidden">
        <Popup />
      </div>
    </ThemeProvider>
  );
}

export default App;
