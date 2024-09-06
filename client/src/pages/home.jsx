import React, { useState, useEffect, useCallback } from 'react';
import {useSocket} from '../provider/socket.js'
import {useNavigate} from 'react-router-dom';
const Homepage = () => {
    const { socket } = useSocket();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [roomId, setRoomId] = useState('');

    const handleRoomJoined = useCallback(({ roomId }) => {
        navigate(`/room/${roomId}`)
    }, [navigate]);

    useEffect(() => {
        socket.on("joined-room", handleRoomJoined);

        return ()=> {
            socket.off("joined-room", handleRoomJoined);
        }
    }, [handleRoomJoined, socket]);

    const handleJoinRoom = () => {
        socket.emit('join-room', { emailId: email, roomId });
    };

    return (
        <div className='homepage-container'>
            <div>
                <input
                    value={email}
                    type="email"
                    onChange={e => setEmail(e.target.value)}
                    placeholder="Enter your email here"
                />  
                <br/> <br/>
                <input
                    value={roomId}
                    type="text"
                    onChange={e => setRoomId(e.target.value)}
                    placeholder="Enter Room Code"
                /> 
                <br/> <br/>
                <button className='enter-room-button' onClick={handleJoinRoom}>
                    Enter Room for Video Chat
                </button>
            </div>
        </div>
    );
};

export default Homepage;