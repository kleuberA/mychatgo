"use client"
import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:4000');

export default function Chat() {
    const [messages, setMessages] = useState<any>([]);
    const [newMessage, setNewMessage] = useState('');

    useEffect(() => {
        socket.on('message', (message) => {
            setMessages([...messages, message]);
        });
    }, [messages]);

    const sendMessage = () => {
        socket.emit('message', newMessage);
        setNewMessage('');
    };

    return (
        <div>
            <div className="chat" >
                {messages.map((msg: any, index: any) => (
                    <div key={index} >
                        {msg}
                    </div>
                ))}
            </div>
            <div className="input" >
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                />
                <button onClick={sendMessage} > Send </button>
            </div>
        </div>
    );
};