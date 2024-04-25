import { Doc, Id } from "../../../../convex/_generated/dataModel";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  FileIcon,
  MoreVertical,
  StarHalf,
  StarIcon,
  TrashIcon,
  UndoIcon,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useToast } from "@/components/ui/use-toast";
import { Protect } from "@clerk/nextjs";
import { FaStar } from "react-icons/fa";



export function FileCardActions({ 
  file, 
  isFavorited,
}: { 
  file: Doc<"files">, 
  isFavorited: boolean
}) {
    const deleteFile = useMutation(api.files.deleteFile)
    const restoreFile = useMutation(api.files.restoreFile)
    const toggleFavorite = useMutation(api.files.toggleFavorite)
    const { toast } = useToast();
    const me = useQuery(api.users.getMe);

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
            window.open(`https://precious-finch-286.convex.cloud/${file.fileId}`, "_blank")
}}
          className="flex gap-1 items-center cursor-pointer"
          >
            <FileIcon /> Download 
        </DropdownMenuItem>   

        <DropdownMenuItem 
          onClick={() => {
            toggleFavorite({
              fileId: file._id,
            })
          }}
          className="flex gap-1 items-center cursor-pointer"
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

        <Protect condition={(check) => {
          return check({
            role: "org:admin",
          }) || file.userId === me?._id
        }} fallback={<></>}> 

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
          className="flex gap-1 items-center cursor-pointer hover:text-red-600">

        {file.shouldDelete ? (
          <div className="flex gap-1 items-center cursor-ponter hover:text-green-600">
            <UndoIcon className="w-6 h-6 mr-1" /> Restore
          </div>
        ) : (

          <div className="flex gap-1 items-center cursor-pointer hover:text-red-700">
            <TrashIcon className="w-6 h-6" /> Delete
          </div>
        )}
        </DropdownMenuItem>
        </Protect>
            </DropdownMenuContent>
      </DropdownMenu>
      </>
    )
}

/* export function getFileUrl(fileId: Id<"_storage">): string {
    return `${process.env.NEXT_PUBLIC_CONVEX_URL}/api/storage/${fileId}`
} */
