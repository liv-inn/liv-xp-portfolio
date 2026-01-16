import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import { WindowProvider } from "./context/WindowContext.jsx";

function App() {

  return (
    <BrowserRouter >
      <WindowProvider>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </WindowProvider>
    </BrowserRouter>
  );
} 

export default App;