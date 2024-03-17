"use client";

import {  useOrganization, useUser } from "@clerk/nextjs";
import { api } from "../../convex/_generated/api";
import {  useQuery } from "convex/react";

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { UploadButton } from "./upload-button";
import { FileCard } from "./file-card";

const formSchema = z.object({
  title: z.string().min(1).max(200),
  file: z
        .custom<FileList>((val) => val instanceof FileList, "Required")
        .refine((files) => files.length > 0, "Required"),
})


export default function Home() {
  const organization = useOrganization();
  const user = useUser()
  let orgId: string | undefined = undefined
  if(organization.isLoaded && user.isLoaded) { 
    orgId = organization.organization?.id ?? user.user?.id 
  }
  const files = useQuery(api.files.getFiles,orgId ? { orgId } : "skip");


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
          <div className="flex justify-between items-center">
            <h1 className="text-4xl font-bold">Your Files</h1>
            <UploadButton />
              {files?.map((file) => (
                <FileCard key={file._id} file={file} />
              ))}
          </div>
        </main>
  );
}
