import React, {useMemo} from 'react';

const PeerContext = React.createContext(null);

export const usePeer = () => React.useContext(PeerContext);

const PeerProvider = (props)=>{

    const peer = useMemo(()=> new RTCPeerConnection({
            iceServers: [
                {
                    urls: [
                        "stun:stun.l.lgoogle.com:19302",
                        "stun:global.stun.twilio.com:3478"
                    ],
                },
            ],
        }),
         []);
    

    const createOffer = async () =>{
        const offer = await peer.createOffer();
        await peer.setLocalDescription(offer);
        return offer;
    };

    const createAnswer = async(offer)=>{
        await peer.setRemoteDescription(offer);
        const answer = peer.createAnswer();
        await peer.setLocalDescription(answer);
        return answer;
    };

    const setRemoteAns = async(ans)=>{
        await peer.setRemoteDescription(ans);
    };

    return <PeerContext.Provider value={{peer, createOffer, createAnswer, setRemoteAns}}>{props.children}</PeerContext.Provider>;
};

export default PeerProvider;