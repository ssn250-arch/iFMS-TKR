import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ICTLog from "./pages/ICTLog";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/elog" element={<ICTLog />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;