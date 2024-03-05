import { ToggleTheme } from "./toggle-theme";

export default function NavBar() {
    return (
        <nav className="w-full h-20 flex items-center border-b border-b-border">
            <div className="w-[80dvw] h-full flex items-center mx-auto justify-between flex-row">
                <div>
                    <span className="text-primary font-bold text-lg">My Chat <span className="bg-secondary p-2 rounded-sm">Go</span> </span>
                </div>
                <div>
                    <ToggleTheme />
                </div>
            </div>
        </nav>
    )
}