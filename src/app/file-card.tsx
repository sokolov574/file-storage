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
  import { DeleteIcon } from "lucide-react";

  function FileCardActions() {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger>Open</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel className="flex-gap-1 text-red-600">
            <DeleteIcon /> Delete
            </DropdownMenuLabel>
            </DropdownMenuContent>
      </DropdownMenu>
  
    )
  }

export function FileCard({ file }: { file: Doc<"files"> }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    {file.name} <FileCardActions /> 
                </CardTitle>
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