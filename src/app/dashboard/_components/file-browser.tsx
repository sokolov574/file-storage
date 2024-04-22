"use client";
import { useOrganization, useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { UploadButton } from "./upload-button";
import { FileCard } from "./file-card";
import Image from "next/image";
import { GridIcon, Loader2, TableIcon } from "lucide-react";
import { SearchBar } from "./search-bar";
import { useState } from "react";
import { DataTable } from "./file-table";
import { columns } from "./columns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"


import { Doc } from "../../../../convex/_generated/dataModel";
import { Label } from "@/components/ui/label";




function Placeholder() {
  return (
    <div className="flex flex-col gap-8 items-center mt-24">
    <Image
      alt="an image of a picture and directory icon"
      width={200} 
      height={200}
      src="/empty.svg"
/>

      <div className="text-2xl">You have no files, go ahead and upload one now</div> 
      <UploadButton />
    </div>
  );
}

export default function FileBrowser({ 
  title, 
  favoritesOnly,
  deletedOnly,
  }: { 
    title: string, 
    favoritesOnly?: boolean;
    deletedOnly?: boolean;
  }) {

  const  organization = useOrganization();
  const user = useUser();
  const [query, setQuery] = useState("");

  let orgId: string | undefined = undefined;
  if (organization?.isLoaded && user?.isLoaded) {
    orgId = organization?.organization?.id ?? user?.user?.id;
  }

  const favorites = useQuery(
    api.files.getAllFavorites,
    orgId ? { orgId } : "skip"
  );

  const files = useQuery(
    api.files.getFiles,
    orgId ? { orgId, query, favorites: favoritesOnly, deletedOnly } : "skip"
  );

  const isLoading = files === undefined;

  const modifiedFiles =
    files?.map((file) => ({
      ...file,
      isFavorited: (favorites ?? []).some(
        (favorite) => favorite.fileId === file._id
      ),
    })) ?? [];

return (
    <div>
    {isLoading && (
    <div className="flex flex-col gap-8 items-center mt-24">
      <Loader2 className="h-32 w-32 animate-spin text-gray-500" />
      <div className="text-2xl">Loading your images...</div>
    </div>
    )}

    
{!isLoading && (
  <>
    <div className="flex justify-between items-center mb-8">
      <h1 className="text-4xl font-bold">{title}</h1>

      <SearchBar query={query} setQuery={setQuery} />
      
      <UploadButton />
    </div>

    <Tabs defaultValue="grid">
      <TabsList>
        <TabsTrigger value="grid" className="flex gap-2 items-center"> 
        <GridIcon /> 
          Grid
        </TabsTrigger>
        <TabsTrigger value="table" className="flex gap-2 items-center">
          <TableIcon />
           Table
          </TabsTrigger>
      </TabsList>
      <TabsContent value="grid">
          <div className="grid grid-cols-3 gap-4">
          {modifiedFiles?.map((file) => {
            return <FileCard key={file._id} file={file} />;
          })}
        </div>
        </TabsContent>
      <TabsContent value="table">
      <DataTable columns={columns} data={modifiedFiles} />
        </TabsContent>
    </Tabs>


    {files.length === 0 && <Placeholder />}

  </>
)}
</div>
)};