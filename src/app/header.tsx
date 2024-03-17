import { UserButton, UserProfile } from "@clerk/nextjs";

export function Header() {
    return <div className="border-b">
        <div className="container mx-auto justify-between flex">
            HELLO WORLD
            <UserButton />
        </div>
    </div>
}