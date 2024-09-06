import React, {useMemo, useEffect} from 'react';
import {io} from "socket.io-client";

const SocketContext = React.createContext(null);

export const useSocket = () =>{
    return React.useContext(SocketContext);
}

export const SocketProvider = (props) =>{
    const socket = useMemo(
        () =>
            io("http://localhost:8001"),
            []
    );

    // useEffect(() => {
    //     // This effect runs on mount and cleanup occurs on unmount
    //     return () => {
    //         if (socket) {
    //             socket.disconnect(); // Clean up the socket connection
    //             console.log('Socket disconnected');
    //         }
    //     };
    // }, [socket]);

    return (
        <SocketContext.Provider value={{socket}}>
            {props.children}
        </SocketContext.Provider>      
    );
};