import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import socket from "../socket/socket";

const Main = props => {
    const roomRef = useRef();
    const userRef = useRef();
    const navigate = useNavigate();
    const [err, setErr] = useState(false);
    const [errMsg, setErrMsg] = useState("");

    useEffect(() => {
        socket.on("[SERVER]-ERROR-OCCURRED-USER-EXISTS", ({ error }) => {
            if (!error) {
                const roomName = roomRef.current.value;
                const userName = userRef.current.value;

                sessionStorage.setItem("user", userName);
                navigate(`/room/${roomName}`);
            } else {
                setErr(error);
                setErrMsg("User name already exist");
            }
        });
    }, [props.history]);

    function clickJoin() {
        const roomName = roomRef.current.value;
        const userName = userRef.current.value;

        if (!roomName || !userName) {
            setErr(true);
            setErrMsg("Enter Room Name or User Name");
        } else {
            socket.emit("[SERVER]-CHECK-USER", { roomId: roomName, userName });
        }
    }

    return (
        <MainContainer>
            <Row>
                <Label htmlFor="roomName">Room Name</Label>
                <Input type="text" id="roomName" ref={roomRef} />
            </Row>
            <Row>
                <Label htmlFor="userName">User Name</Label>
                <Input type="text" id="userName" ref={userRef} />
            </Row>
            <JoinButton onClick={clickJoin}> Join </JoinButton>
            {err ? <Error>{errMsg}</Error> : null}
        </MainContainer>
    );
};

const MainContainer = styled.div`
    display: flex;
    flex-direction: column;
`;

const Row = styled.div`
    display: flex;
    align-items: center;
    justify-content: flex-end;
    margin-top: 15px;
    line-height: 35px;
`;

const Label = styled.label``;

const Input = styled.input`
    width: 150px;
    height: 35px;
    margin-left: 15px;
    padding-left: 10px;
    outline: none;
    border: none;
    border-radius: 5px;
`;

const Error = styled.div`
    margin-top: 10px;
    font-size: 20px;
    color: #e85a71;
`;

const JoinButton = styled.button`
    height: 40px;
    margin-top: 35px;
    outline: none;
    border: none;
    border-radius: 15px;
    color: #d8e9ef;
    background-color: #4ea1d3;
    font-size: 25px;
    font-weight: 500;

    :hover {
        background-color: #7bb1d1;
        cursor: pointer;
    }
`;

export default Main;
