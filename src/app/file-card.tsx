import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
import { Doc } from "../../convex/_generated/dataModel"
import { Button } from "@/components/ui/button"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
  import { DeleteIcon, MoreVertical } from "lucide-react";

  import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"
import { useState } from "react";
  

function FileCardActions() {
    const [isConfirmOpen, serIsConfirmOpen] = useState(false);
 return (
    <>
    <AlertDialog open={isConfirmOpen} onOpenChange={serIsConfirmOpen}>
    <AlertDialogContent>
        <AlertDialogHeader>
        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
        <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your account
            and remove your data from our servers.
        </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <AlertDialogAction onClick={() => {
            // TODO: Delete the file
        }}>Continue</AlertDialogAction>
        </AlertDialogFooter>
    </AlertDialogContent>
    </AlertDialog>

      <DropdownMenu>
        <DropdownMenuTrigger><MoreVertical/></DropdownMenuTrigger>
        <DropdownMenuContent>         
          <DropdownMenuLabel 
          onClick={() => serIsConfirmOpen(true)}
          className="flex-gap-1 text-red-600 items-center cursor-pointer">
            <DeleteIcon /> Delete
            </DropdownMenuLabel>
            </DropdownMenuContent>
      </DropdownMenu>
      </>
    )
}

export function FileCard({ file }: { file: Doc<"files"> }) {
    return (
        <Card>
            <CardHeader className="relative">
                <CardTitle>
                    {file.name} <FileCardActions /> 
                </CardTitle>
                <div className="absolute top-2 right-2">
                    <FileCardActions />
                </div>
                {/* <CardDescription>Card Description</CardDescription> */}
            </CardHeader>
            <CardContent>
                <p>Card Content</p>
            </CardContent>
            <CardFooter>
                <Button>Download</Button>
            </CardFooter>
        </Card>

    )
  }