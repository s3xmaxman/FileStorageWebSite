"use client";

import {  useOrganization, useUser } from "@clerk/nextjs";
import { api } from "../../../../convex/_generated/api";
import {  useQuery } from "convex/react";

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { UploadButton } from "./upload-button";
import { FileCard } from "./file-card";
import Image from "next/image";
import { Loader2 } from "lucide-react";
import { SearchBar } from "./search-bar";
import { useState } from "react";

function Placeholder() {
  return (
    <div className="flex flex-col gap-8 w-full items-center mt-24">
      <Image
        alt= "an image of a picture and directory icon"
        width={"300"}
        height={"300"}
        src="/empty.svg" 
      />
          <div className="text-2xl">
            You have no files!
          </div>
          <UploadButton />
    </div>
  )
}

const formSchema = z.object({
  title: z.string().min(1).max(200),
  file: z
        .custom<FileList>((val) => val instanceof FileList, "Required")
        .refine((files) => files.length > 0, "Required"),
})


export  function FileBrowser({ title, favoriteOnly }: { title: string, favoriteOnly?: boolean }) {
  const organization = useOrganization();
  const user = useUser()
  const [query, setQuery] = useState("")

  let orgId: string | undefined = undefined

  if(organization.isLoaded && user.isLoaded) { 
    orgId = organization.organization?.id ?? user.user?.id 
  }

  const favorites = useQuery(api.files.getAllFavorites, orgId ? { orgId }: "skip");
  const files = useQuery(api.files.getFiles,orgId ? { orgId, query, favorites: favoriteOnly } : "skip");
  const isLoading = files === undefined


    // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
      defaultValues: {
        title: "",
        file: undefined,
      },
  })
   
  return (
        <main className="container mx-auto pt-12">

          {isLoading && 
            <div className="flex flex-col gap-8 w-full items-center mt-24">
              <Loader2 className="h-32 w-32 animate-spin text-gray-500" />
              <div className="text-2xl">Loading...</div>
            </div>
          }

          {!isLoading && !query && files.length === 0 && <Placeholder/>}
        
          {!isLoading && !query && files.length > 0 &&(
          <> 
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-4xl font-bold">{title}</h1>
                <SearchBar query={query} setQuery={setQuery} />
                <UploadButton />
            </div>

              {files?.length === 0 && <Placeholder />}

              <div className="grid grid-cols-3 gap-4">
                {files?.map((file) => {
                  return <FileCard favorites={favorites ?? []} key={file._id} file={file} />
                })}
            </div>
          </>
          )}
        </main>
  );
}
