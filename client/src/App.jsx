import { useState, useEffect } from "react";
import "./App.css";
import socket from "./socket/socket";

function App() {
    const [message, setMessage] = useState("");
    useEffect(() => {
        socket.on("welcome", data => {
            console.log(data);
            setMessage(data);
        });
    }, []);

    function sendMessage() {
        socket.emit("client-connect", "Hello from client");
    }

    return (
        <div className="App">
            <button onClick={sendMessage}>Emit message</button>
        </div>
    );
}

export default App;
