"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Doc, Id } from "../../../../convex/_generated/dataModel"
import { formatRelative } from "date-fns"
import { useQuery } from "convex/react"
import { api } from "../../../../convex/_generated/api"

function UserCell({ userId }: { userId: Id<"users"> }) {
    const userProfile = useQuery(api.users.getUserProfile, {
        userId: userId,
    })

    return<div>{userProfile?.name}</div>
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
