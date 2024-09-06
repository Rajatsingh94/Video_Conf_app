import React, {useEffect, useCallback, useState} from 'react';
import {useSocket} from "../provider/socket.js";
import { usePeer } from '../provider/Peer';
import ReactPlayer from 'react-player';

const RoomPage = () =>{
    const {socket} = useSocket();
    const {peer, createOffer, createAnswer, setRemoteAns} = usePeer();
    const [myStream, setMyStream] = useState(null);

    const handleNewUserJoined = useCallback(async (data)=>{
        const {emailId} = data;
        console.log("New User Joined the Room", emailId);
        const offer = await createOffer();
        socket.emit("call-user", {emailId, offer});
    },[createOffer, socket]);


    const handleIncomingCall = useCallback(
        async (data)=> {
            const {from, offer} = data;   
            console.log("Incoming call from ", from, offer);
            const ans = await createAnswer(offer);
            socket.emit("call-accepted", {emailId:from, ans});
        }, [createAnswer, socket]
    );

    const handleCallAccepted = useCallback(
        async(data)=>{
            const {ans} = data;
            console.log("call got accepted", ans);
            await setRemoteAns(ans);

        }, [setRemoteAns]
    );

    const getUserMediaStream = useCallback(async()=>{
        const stream = await navigator.mediaDevices.getUserMediaStream({audio:true, Video: true});
        setMyStream(stream);

    }, [])

    useEffect(()=>{
        socket.on("user-joined", handleNewUserJoined);
        socket.on("incoming-call", handleIncomingCall);
        socket.on("call-accepted", handleCallAccepted);

        return ()=>{
            socket.off("user-joined", handleNewUserJoined);
            socket.off("incoming-call", handleIncomingCall);
            socket.off("call-accepted", handleCallAccepted);
        }
    }, [handleCallAccepted, handleIncomingCall, handleNewUserJoined, socket]);

    useEffect(()=>{
        getUserMediaStream();
    }, [getUserMediaStream]);


    return (
        <div className="room-page-container">
            <h1>Room Page</h1>
            <ReactPlayer url={myStream} playing muted/>
        </div>
    );
};

export default RoomPage;