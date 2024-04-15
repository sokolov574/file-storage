import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
import { Doc, Id } from "../../../../convex/_generated/dataModel"
import { Button } from "@/components/ui/button"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
  import { DeleteIcon, FileTextIcon, GanttChartIcon, GanttChartSquareIcon, ImageIcon, MoreVertical, StarHalf, StarIcon, TextIcon, TrashIcon, UndoIcon } from "lucide-react";
  import { FaStar } from "react-icons/fa";

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
import { api } from "../../../../convex/_generated/api";
import { useToast } from "@/components/ui/use-toast";
import Image from "next/image";
import { Protect } from "@clerk/nextjs";
  

function FileCardActions({ file, isFavorited 
}: { 
  file: Doc<"files">, 
  isFavorited: boolean}) {
    const deleteFile = useMutation(api.files.deleteFile)
    const restoreFile = useMutation(api.files.restoreFile)
    const toggleFavorite = useMutation(api.files.toggleFavorite)
    const { toast } = useToast();
    const [isConfirmOpen, serIsConfirmOpen] = useState(false);
 return (
    <>
    <AlertDialog open={isConfirmOpen} onOpenChange={serIsConfirmOpen}>
    <AlertDialogContent>
        <AlertDialogHeader>
        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
        <AlertDialogDescription>
            This action will mark the file for our deletion process. Files are deleted periodically
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
                title: "File marked for deletion",
                description: "Your file will be deleted soon",
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

        <DropdownMenuItem 
          onClick={() => {
            toggleFavorite({
              fileId: file._id,
            })
          }}
          className="flex-gap-1 items-center cursor-pointer"
          >
            {isFavorited ? (
              
              <div className="flex gap-1 items-center">
                <FaStar className="w-6 h-6"/>Unfavorite
              </div> 
             
              ) : (
                <div className="flex gap-1 items-center">
                  <StarIcon className="w-6 h-6" />Favorite
                </div>
              )} 
        </DropdownMenuItem>

        <DropdownMenuSeparator />
        <Protect
        role="org:admin"
        fallback={<></>}
        > 

        <DropdownMenuItem 
          onClick={() => {
            if (file.shouldDelete) {
              restoreFile({
                fileId: file._id,
              })
            } else {
            serIsConfirmOpen(true)
           }
          }}
          className="flex-gap-1 items-center cursor-pointer hover:text-red-600">

        {file.shouldDelete ? (
          <div className="flex-gap-1 items-center cursor-ponter hover:text-green-600">
            <UndoIcon className="w-6 h-6 mr-1" /> Restore
          </div>
        ) : (

          <div className="flex-gap-1 items-center cursor-pointer hover:text-red-700">
            <UndoIcon className="w-6 h-6 mr-1" /> Delete
          </div>
        )}
        </DropdownMenuItem>
        </Protect>
            </DropdownMenuContent>
      </DropdownMenu>
      </>
    )
}

/* function getFileUrl(fileId: Id<"_storage">): string {
    return `${process.env.NEXT_PUBLIC_CONVEX_URL}/api/storage/${fileId}`
} */


export function FileCard({ file, favorites 
}: { 
  file: Doc<"files">, 
  favorites: Doc<"favorites">[] }) {

    const typeIcons = {
        "image": <ImageIcon />,
        "pdf": <FileTextIcon />,
        "csv": <GanttChartIcon />,
      } as Record<Doc<"files">["type"], ReactNode>;

    const isFavorited = favorites.some(
      (favorite) => favorite.fileId === file._id
    )

    return (
        <Card>
            <CardHeader className="relative">
                <CardTitle className="flex gap-2">
                <div className="flex justify-center">{typeIcons[file.type]}</div>
                    {file.name}
                </CardTitle>
                <div className="absolute top-2 right-2">
                    <FileCardActions isFavorited={isFavorited} file={file}/>
                </div>
            </CardHeader>
            <CardContent className="h-[200px] flex justify-center items-center">

          {/*   <Image 
            alt={file.name}
            width="200"
            height="200"
            src={getFileUrl(file.fileId)}
            /> */}

                {file.type === "pdf" && <FileTextIcon className="w-20 h-20" />}
                {file.type === "csv" && <GanttChartIcon className="w-20 h-20" />}
            </CardContent>
            <CardFooter className="flex justify-center">
                <Button onClick={() => {
                    // open a new tab to the file location on convex
                    window.open(`https://precious-finch-286.convex.cloud/${file.fileId}`, "_blank")
                }}>Download</Button>
            </CardFooter>
        </Card>

    )
  }


 