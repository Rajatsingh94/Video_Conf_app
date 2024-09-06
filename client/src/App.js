import './App.css';
import {Routes, Route} from 'react-router-dom';
import Homepage from './pages/home.jsx';
import RoomPage from './pages/roomPage.jsx';
import PeerProvider from './provider/Peer.jsx';
  

import {SocketProvider} from './provider/socket';
  
function App() {
  return (
    <div className="App">
      <SocketProvider>
      <PeerProvider>
        <Routes>
          <Route path="/" element={<Homepage />}/>
          <Route path="/room/:roomId" element={<RoomPage/>}/>
        </Routes>
        </PeerProvider>
      </SocketProvider>
    </div>
  );
}

export default App;
