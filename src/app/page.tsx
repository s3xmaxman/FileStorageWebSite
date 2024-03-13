"use client";
import { Button } from "@/components/ui/button";
import { SignInButton, SignOutButton, SignedIn, SignedOut } from "@clerk/nextjs";
import Image from "next/image";
import { api } from "../../convex/_generated/api";
import { useMutation, useQuery } from "convex/react";

export default function Home() {
  const files = useQuery(api.files.getFiles);
  const createFile = useMutation(api.files.createFile);
  return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
          <SignedIn>
            <SignOutButton>
              <Button>Sign Out</Button>
            </SignOutButton>
          </SignedIn>
          <SignedOut>
            <SignInButton mode="modal">
              <Button>Sign In</Button>
            </SignInButton>
          </SignedOut>

          {files?.map((file) => (
            <div key={file._id}>
              <p>{file.name}</p>
            </div>
          ))}

          <Button onClick={() => createFile({ name: "unko world"}) }>Click Me!</Button>
        </main>
  );
}
