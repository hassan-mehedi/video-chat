import { useState, useEffect } from "react";
import "./App.css";
import socket from "./socket/socket";

function App() {
    const [message, setMessage] = useState("");
    useEffect(() => {
        socket.on("server-connect", message => {
            setMessage(message);
        });
    }, []);

    function sendMessage() {
        socket.emit("client-connect", "Hello from client");
    }

    return (
        <div className="App">
            <button onClick={sendMessage}>Emit message</button>
            <p>{message}</p>
        </div>
    );
}

export default App;
