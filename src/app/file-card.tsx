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
  import { DeleteIcon, FileTextIcon, GanttChartIcon, GanttChartSquareIcon, ImageIcon, MoreVertical, TextIcon } from "lucide-react";

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
import { ReactNode, useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useToast } from "@/components/ui/use-toast";
  

function FileCardActions({ file }: { file: Doc<"files"> }) {
    const deleteFile = useMutation(api.files.deleteFile)
    const { toast } = useToast();
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
        <AlertDialogAction 
        onClick={ async() => {
           await deleteFile({
                fileId: file._id
            })
            toast({
                variant: "default",
                title: "File  deleted",
                description: "Your file is now gone from the system",
              })
        }}
        >
            Continue
            </AlertDialogAction>
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

    const typeIcons = {
        "image": <ImageIcon />,
        "pdf": <FileTextIcon />,
        "csv": <GanttChartIcon />,
      } as Record<Doc<"files">["type"], ReactNode>;

    return (
        <Card>
            <CardHeader className="relative">
                <CardTitle className="flex gap-2">
                <div className="flex justify-center">{typeIcons[file.type]}</div>
                    {file.name}
                </CardTitle>
                <div className="absolute top-2 right-2">
                    <FileCardActions file={file}/>
                </div>
            </CardHeader>
            <CardContent>
            </CardContent>
            <CardFooter>
                <Button>Download</Button>
            </CardFooter>
        </Card>

    )
  }