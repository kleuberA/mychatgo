"use client"
import React, { useState, useEffect } from 'react';
import { Socket } from 'socket.io-client';

interface ChatProps {
    socket: Socket;
    username: string;
    room: string;
}


export default function Chat({ socket, username, room }: ChatProps) {
    const [messages, setMessages] = useState<any>([]);
    const [newMessage, setNewMessage] = useState('');

    useEffect(() => {
        socket.on('message', (message) => {
            setMessages([...messages, message]);
        });
    }, [messages]);

    const sendMessage = async () => {
        if (newMessage !== '') {
            const dataMessage = {
                autorDaMensagem: username,
                message: newMessage,
                room,
                time:
                    new Date(Date.now()).getHours() +
                    ":" +
                    new Date(Date.now()).getMinutes(),
            }
            await socket.emit('message', dataMessage);
            setNewMessage('');
        }
    };

    return (
        <div>
            <div className="chat" >
                {messages.map((msg: any, index: any) => (
                    <div key={index} >
                        {msg.message}
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