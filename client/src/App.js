// App.js
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './Copmponents/Home';
import ChatPage from './Copmponents/ChatPage';
import socketIO from 'socket.io-client';

const socket = socketIO.connect('https://chat-app-server-care.onrender.com/');

function App() {
    return (
        <BrowserRouter>
            <div>
                <Routes>
                    <Route path="/" element={<Home socket={socket} />} />
                    <Route path="/chat" element={<ChatPage socket={socket} />} />
                </Routes>
            </div>
        </BrowserRouter>
    );
}

export default App;
