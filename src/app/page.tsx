'use client'

import { SignIn, SignInButton, SignOutButton, SignedIn, SignedOut, useOrganization, useSession, useUser } from "@clerk/nextjs";

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import clsx from "clsx";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

import { z } from "zod"
 
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
 
const formSchema = z.object({
  title: z.string().min(1).max(200),
  file: z
        .custom<FileList>((val) => val instanceof FileList, "Required")
        .refine((files) => files.length > 0, "Required"), 
})


export default function Home() {
  const  organization = useOrganization();
  const user = useUser();
  const generateUploadUrl = useMutation(api.files.generateUploadUrl)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
    },
  })
  const fileRef = form.register("file");

  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values.file)
    const postUrl = await generateUploadUrl();

    const result = await fetch(postUrl, {
      method: "POST",
      headers: { "Content-Type": values.file[0]!.type },
      body: values.file[0],
    });

    const { storageId } = await result.json();

    if (!orgId) return

    createFile({
      name: values.title,
      fileId: storageId,
      orgId
    })
  }

  let orgId: string | undefined = undefined;
  if(organization?.isLoaded && user?.isLoaded) {
  orgId = organization?.organization?.id ?? user?.user?.id;
}

const files = useQuery(api.files.getFiles, orgId ? { orgId } : "skip");
const createFile = useMutation(api.files.createFile);

return (
  <main className="container mx-auto pt-12">
    <div className="flex justify-between items-center">
      <h1 className="text-4xl font-bold">Your Files</h1>

      <Dialog>
        <DialogTrigger asChild>
          <Button onClick={() => {}}>Upload File</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="mb-4">Upload your File Here</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="shadcn" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="file"
                  render={() => (
                    <FormItem>
                      <FormLabel>File</FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          {...fileRef}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit">Submit</Button>
              </form>
            </Form>
          </DialogDescription>
        </DialogContent>
      </Dialog>

    </div>

    {files?.map(file => {
      return <div key={file._id}>{file.name}</div>
    })}

  </main>
)};
