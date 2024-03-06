"use client"
import { DotsHorizontalIcon, PaperPlaneIcon } from '@radix-ui/react-icons';
import React, { useState, useEffect, useCallback } from 'react';
import { WarningCircle } from '@phosphor-icons/react';
import { Socket } from 'socket.io-client';
import { Button } from './ui/button';
import { Input } from './ui/input';
import NavBar from './Navbar';
import { motion } from 'framer-motion';

interface ChatProps {
    socket: Socket;
    username: string;
    room: string;
}

const variants = {
    initial: { opacity: 0, y: "100%" },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: "100%" },
};

export default function Chat({ socket, username, room }: ChatProps) {

    const [messages, setMessages] = useState<any>([]);
    const [newMessage, setNewMessage] = useState('');
    const [isHovering, setIsHovering] = useState(false);

    useEffect(() => {
        socket.on('message', (message) => {
            setMessages([...messages, message]);
        });

        socket.on('delete_message', (deletedMessage) => {
            setMessages((prevMessages: any) => {
                const updatedMessages = prevMessages.map((msg: any) => {
                    if (msg.id === deletedMessage.id) {
                        return { ...msg, deleted: true, message: 'Mensagem removida' };
                    }
                    return msg;
                });
                return updatedMessages;
            });
        });
    }, [socket, messages]);


    const sendMessage = async () => {
        if (newMessage !== '') {
            const hours = new Date(Date.now()).getHours().toString().padStart(2, '0');
            const minutes = new Date(Date.now()).getMinutes().toString().padStart(2, '0');
            const time = `${hours}:${minutes}`;
            const dataMessage = {
                id: Math.random().toString(36).substr(2, 9),
                autorDaMensagem: username,
                message: newMessage,
                room,
                time: time,
                deleted: false,
            }
            await socket.emit('message', dataMessage);
            setNewMessage('');
        }
    };

    const handleDeleteMessage = useCallback(async (id: string, autorDaMensagem: string) => {
        if (autorDaMensagem === username) {
            await socket.emit('delete_message', id);

            setMessages((prevMessages: any) => {
                const updatedMessages = prevMessages.map((msg: any) => {
                    if (msg.id === id) {
                        return { ...msg, deleted: true, message: 'Mensagem removida' };
                    }
                    return msg;
                });
                socket.emit('message', updatedMessages);
                return updatedMessages;
            });
        }
    }, [socket, username]);

    const handleEventMouseMessage = (name: string) => {
        if (name === username) {
            setIsHovering(true);
        }
    }

    return (
        <div>
            <NavBar />
            <div className="w-full h-[calc(100dvh_-_5rem)] flex flex-col">
                <div className='flex-1 w-full h-full overflow-y-scroll p-4' >
                    {messages.map((msg: any, index: any) => (
                        <div
                            onMouseEnter={(e) => handleEventMouseMessage(msg.autorDaMensagem)}
                            onMouseLeave={() => setIsHovering(false)}
                            onDoubleClick={() => handleDeleteMessage(msg.id, msg.autorDaMensagem)}
                            key={index}
                            className={`flex gap-3 relative p-1 ${username === msg.autorDaMensagem ? 'justify-end items-end' : 'justify-start items-start'}`}>
                            {isHovering && username === msg.autorDaMensagem && (
                                <motion.div
                                    initial="initial"
                                    animate={isHovering ? "animate" : "initial"}
                                    exit="exit"
                                    variants={variants}
                                    transition={{ duration: 0.3 }}
                                    className='absolute -top-4 right-1 bg-secondary p-2 rounded-sm'>
                                    <div className='w-full h-full flex flex-row gap-3'>
                                        <DotsHorizontalIcon width={20} height={20} />
                                    </div>
                                </motion.div>
                            )}
                            <div className='flex flex-col'>
                                <span className={`text-accent-foreground text-xs pt-1 flex ${username === msg.autorDaMensagem ? "justify-end" : "justify-start"} `}>
                                    {msg.autorDaMensagem}
                                </span>
                                <span className={`${username === msg.autorDaMensagem ? 'bg-primary text-primary-foreground hover:bg-primary/90 rounded-tr-sm' : 'bg-secondary rounded-sm hover:bg-secondary/90'} p-3 rounded-sm`}>
                                    {msg.deleted ? (
                                        <div className='w-full h-full flex flex-row gap-1 items-center'>
                                            <WarningCircle size={20} /> Mensagem removida.
                                        </div>
                                    ) : msg.message}
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
                        onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                                sendMessage();
                            }
                        }}
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                    />
                    <Button
                        disabled={newMessage === ''}
                        size="icon"
                        onClick={sendMessage}>
                        <PaperPlaneIcon />
                    </Button>
                </div>
            </div>
        </div>
    );
};