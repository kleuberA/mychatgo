"use client"

import { useState } from "react"
import Chat from "./Chat";

interface ChatContainerProps {

}
export default function ChatContainer(props: ChatContainerProps) {

    const [username, setUsername] = useState<string>("");
    const [room, setRoom] = useState<string>("");
    const [addInfo, setAddInfo] = useState<boolean>(true);
    const [disabled, setDisabled] = useState<boolean>(true);

    const handleSubmit = (e: any) => {
        e.preventDefault();

        if (username.trim().length != 0 || room.trim().length != 0) {
            setAddInfo(true);
            console.log(username, room);
            return;
        }
    }

    return (
        <>
            {!addInfo && (
                <section className="w-full h-screen flex flex-col bg-zinc-950 gap-3 justify-center items-center">
                    <h1 className="font-bold font-mono text-4xl text-white">My Chat Go</h1>
                    <div className="w-[30dvw] h-[40dvh] bg-zinc-800 rounded-md p-5">
                        <form
                            onSubmit={(e) => handleSubmit(e)}
                            action=""
                            className="flex flex-col justify-center w-full gap-5 h-full"
                        >
                            <input
                                type="text"
                                placeholder="Username"
                                className="p-2 rounded-sm outline-none bg-zinc-500 text-white"
                                onChange={(e) => { setUsername(e.target.value) }}
                            />
                            <input
                                type="text"
                                placeholder="Room"
                                className="p-2 rounded-sm outline-none bg-zinc-500 text-white"
                                onChange={(e) => { setRoom(e.target.value) }}
                            />
                            <button
                                disabled={room === "" || username === "" ? true : false}
                                type="submit"
                                className="bg-zinc-500 p-2 rounded-md disabled:bg-zinc-700 text-white hover:bg-zinc-600 transition-all duration-300 ease-in-out disabled:cursor-not-allowed"
                            >
                                Join
                            </button>
                        </form>
                    </div>
                </section>
            )}
            {addInfo && (
                <Chat />
            )}
        </>
    )
}