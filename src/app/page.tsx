"use client";
import { Button } from "@/components/ui/button";
import { SignInButton, SignOutButton, SignedIn, SignedOut, useOrganization, useUser } from "@clerk/nextjs";
import Image from "next/image";
import { api } from "../../convex/_generated/api";
import { useMutation, useQuery } from "convex/react";

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
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
          
          {files?.map((file) => (
            <div key={file._id}>
              <p>{file.name}</p>
            </div>
          ))}

          <Button onClick={() => {if(!orgId) return; createFile({ name: "hello world", orgId })}}>Click Me!</Button>
        </main>
  );
}
