// ChatPage.js
import React, { useEffect, useState, useRef } from 'react';
import ChatBar from './Chatbar';
import ChatBody from './ChatBody';
import ChatFooter from './ChatFooter';

const ChatPage = ({ socket }) => {
    const [messages, setMessages] = useState([]);
    const [typingStatus, setTypingStatus] = useState('');
    const lastMessageRef = useRef(null);

    useEffect(() => {
    socket.on('messageResponse', (data) => setMessages(prevMessages => [...prevMessages, data]));
}, [socket]);

useEffect(() => {
    lastMessageRef.current?.scrollIntoView({ behavior: 'smooth' });
}, [messages]);

useEffect(() => {
    socket.on('typingResponse', (data) => setTypingStatus(data));
}, [socket]);


    return (
        <div className="chat">
            <ChatBar socket={socket} />
            <div className="chat__main">
                <ChatBody 
                    messages={messages} 
                    typingStatus={typingStatus} 
                    lastMessageRef={lastMessageRef} 
                />
                <ChatFooter socket={socket} />
            </div>
        </div>
    );
};

export default ChatPage;
