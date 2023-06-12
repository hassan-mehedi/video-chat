import { BrowserRouter, Route, Routes } from "react-router-dom";

import Home from "./pages/Home";
import Room from "./pages/Room";

import "./App.css";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route exact path="/" element={<Home />} />
                <Route exact path="/room/:roomId" element={<Room />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
