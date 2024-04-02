"use client"

import { Button } from "@/components/ui/button";
import { FilesIcon, StarIcon } from "lucide-react";
import Link from "next/link";

export default function SideNav() {
    return (
        <div className="w-40 flex flex-col gap-4">
            <Link href="/dashboard/files">
                <Button variant={"link"} className="flex gap-2">
                    <FilesIcon /> All Files
                </Button>
            </Link>
            <Link href="/dashboard/favorites">
                <Button variant={"link"} className="flex gap-2">
                    <StarIcon /> Favorites
                </Button>
            </Link>
        </div>
    );
}