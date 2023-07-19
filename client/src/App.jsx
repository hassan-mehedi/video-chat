import { BrowserRouter, Route, Routes } from "react-router-dom";
import styled from "styled-components";

import Main from "./components/Main";
import Room from "./components/Room";

import "./App.css";

function App() {
    return (
        <BrowserRouter>
            <AppContainer>
                <Routes>
                    <Route exact path="/" element={<Main />} />
                    <Route exact path="/room/:roomId" element={<Room />} />
                </Routes>
            </AppContainer>
        </BrowserRouter>
    );
}

const AppContainer = styled.div`
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    align-items: center;
    justify-content: center;
    font-size: calc(8px + 2vmin);
    color: white;
    background-color: #454552;
    text-align: center;
`;

export default App;
