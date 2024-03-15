"use client";
import { Button } from "@/components/ui/button";
import { SignInButton, SignOutButton, SignedIn, SignedOut, useOrganization, useUser } from "@clerk/nextjs";
import Image from "next/image";
import { api } from "../../convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"


export default function Home() {
  const organization = useOrganization();
  const user = useUser()
  let orgId: string | undefined = undefined
  if(organization.isLoaded && user.isLoaded) {
    orgId = organization.organization?.id ?? user.user?.id
  }
  const files = useQuery(
    api.files.getFiles,
    orgId ? { orgId } : "skip"
  );
  const createFile = useMutation(api.files.createFile);
  return (
        <main className="container mx-auto pt-12">
          <div className="flex justify-between items-center">
            <h1 className="text-4xl font-bold">Your Files</h1>
            <Dialog>
            <DialogTrigger>Open</DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Are you absolutely sure?</DialogTitle>
                <DialogDescription>
                  This action cannot be undone. This will permanently delete your account
                  and remove your data from our servers.
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
          {files?.map((file) => (
            <div key={file._id}>
              <p>{file.name}</p>
            </div>
          ))}
     
          <Button onClick={() => {if(!orgId) return; createFile({ name: "hello world", orgId })}}>Click Me!</Button>

          </div>
        </main>
  );
}
