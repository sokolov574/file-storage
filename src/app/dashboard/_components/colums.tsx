"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Doc, Id } from "../../../../convex/_generated/dataModel"
import { formatRelative } from "date-fns"
import { useQuery } from "convex/react"
import { api } from "../../../../convex/_generated/api"
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar"

function UserCell({ userId }: { userId: Id<"users"> }) {
    const userProfile = useQuery(api.users.getUserProfile, {
        userId: userId,
    })

    return (
        <div className="flex gap-2 text-xs text-gray-700 w-40 items-center">
                <Avatar className="w-6 h-6">
                  <AvatarImage src={userProfile?.image} />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
            {userProfile?.name}
        </div>
    ) 
  }

export const columns: ColumnDef<Doc<"files">>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "type",
    header: "Type",
  },

  {
    header: "User",
    cell: ({ row }) => {
   
        return <UserCell userId={row.original.userId}/>;
      },
  },

  {
    header: "Upload On",
    cell: ({ row }) => {
        return (
        <div>
            {formatRelative(new Date(row.original._creationTime), new Date())}</div>
        );
      },
  },
]
