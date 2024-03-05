"use client"

import { useState } from "react"
import Chat from "./Chat";
import { io } from "socket.io-client";
import NavBar from "./Navbar";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

interface ChatContainerProps {

}

const socket = io('http://localhost:4000');

export default function ChatContainer(props: ChatContainerProps) {

    const [username, setUsername] = useState<string>("");
    const [room, setRoom] = useState<string>("");
    const [showChat, setshowChat] = useState<boolean>(false);
    const [disabled, setDisabled] = useState<boolean>(true);

    const handleSubmit = (e: any) => {
        e.preventDefault();
        if (username !== "" && room !== "") {
            socket.emit('join_room', room);
            setshowChat(true);
        }
    }

    return (
        <>
            {!showChat && (
                <section className="w-full h-[calc(100dvh_-_5rem)] bg-background">
                    <NavBar />
                    <div className="w-full h-full flex flex-col gap-3 justify-center items-center">
                        <h1 className="font-bold font-mono text-4xl text-primary">My Chat Go</h1>
                        <div className="w-[30dvw] h-[40dvh] bg-background border border-border rounded-md p-5">
                            <form
                                onSubmit={(e) => handleSubmit(e)}
                                action=""
                                className="flex flex-col justify-center w-full gap-5 h-full"
                            >
                                <Input
                                    type="text"
                                    placeholder="Username"
                                    onChange={(e) => { setUsername(e.target.value) }}
                                />
                                <Input
                                    type="text"
                                    placeholder="Room"
                                    onChange={(e) => { setRoom(e.target.value) }}
                                />
                                <Button
                                    disabled={room === "" || username === "" ? true : false}
                                    type="submit"
                                    className="transition-all duration-300 ease-in-out disabled:cursor-not-allowed"
                                >
                                    Join Room
                                </Button>
                            </form>
                        </div>
                    </div>
                </section>
            )}
            {showChat && (
                <Chat socket={socket} username={username} room={room} />
            )}
        </>
    )
}