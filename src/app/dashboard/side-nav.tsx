"use client"

import { Button } from "@/components/ui/button";
import { FilesIcon, Gamepad2, StarIcon, TrashIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from 'clsx';

export default function SideNav() {

    const pathName = usePathname()

    return (
        <div className="w-40 flex flex-col gap-4">
            <Link href="/dashboard/files">
                <Button 
                variant={"link"} 
                className={clsx("flex gap-2", {
                    "text-blue-400": pathName.includes("/dashboard/files")
                })}
                >
                    <FilesIcon /> All Files
                </Button>
            </Link>
            <Link href="/dashboard/favorites">
                <Button 
                variant={"link"} 
                className={clsx("flex gap-2", {
                    "text-blue-400": pathName.includes("/dashboard/favorites")
                })}>
                    <StarIcon /> Favorites
                </Button>
            </Link>


            <Link href="/dashboard/trash">
                <Button 
                variant={"link"} 
                className={clsx("flex gap-2", {
                    "text-blue-400": pathName.includes("/dashboard/trash")
                })}>
                    <TrashIcon /> Trash
                </Button>
            </Link>
            
        </div>
    );
}