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

export function FileCard({ file }: { file: Doc<"files"> }): JSX.Element {
    return (
        <Card>
            <CardHeader>
                <CardTitle>{file.name} Title</CardTitle>
                {/* <CardDescription>Card Description</CardDescription> */}
            </CardHeader>
            <CardContent>
                <p>Card Content</p>
            </CardContent>
            <CardFooter>
                <p>Card Footer</p>
                <Button>Download</Button>
            </CardFooter>
        </Card>

    )
  }