"use client"
import React, { useState, useEffect } from 'react';
import { Socket } from 'socket.io-client';
import NavBar from './Navbar';
import { Input } from './ui/input';
import { PaperPlaneIcon } from '@radix-ui/react-icons';
import { Button } from './ui/button';

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
            const hours = new Date(Date.now()).getHours().toString().padStart(2, '0');
            const minutes = new Date(Date.now()).getMinutes().toString().padStart(2, '0');
            const time = `${hours}:${minutes}`;
            const dataMessage = {
                autorDaMensagem: username,
                message: newMessage,
                room,
                time: time
            }
            await socket.emit('message', dataMessage);
            setNewMessage('');
        }
    };

    return (
        <div>
            <NavBar />
            <div className="w-full h-[calc(100dvh_-_5rem)] flex flex-col">
                <div className='flex-1 w-full h-full overflow-y-scroll p-4' >
                    {messages.map((msg: any, index: any) => (
                        <div key={index} className={`flex gap-3 p-1 ${username === msg.autorDaMensagem ? 'justify-end items-end' : 'justify-start items-start'}`}>
                            <div className='flex flex-col'>
                                <span className={`${username === msg.autorDaMensagem ? 'bg-primary text-primary-foreground hover:bg-primary/90 rounded-tr-sm' : 'bg-secondary rounded-sm hover:bg-secondary/90'} p-3 rounded-sm`}>
                                    {msg.message}
                                </span>
                                <span className={`text-secondary-foreground text-xs pt-1 flex ${username === msg.autorDaMensagem ? "justify-end" : "justify-start"} `}>
                                    {msg.time}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="flex flex-row gap-3 p-3" >
                    <Input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                    />
                    <Button size="icon" onClick={sendMessage}> <PaperPlaneIcon /> </Button>
                </div>
            </div>

        </div>
    );
};