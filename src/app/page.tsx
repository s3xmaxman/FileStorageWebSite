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
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
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
  const files = useQuery(
    api.files.getFiles,
    orgId ? { orgId } : "skip"
  );
  const createFile = useMutation(api.files.createFile);

    // 1. Define your form.
    const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        title: "",
        file: undefined,
      },
    })

    const fileRef = form.register("file")
    
    function onSubmit(values: z.infer<typeof formSchema>) {
      // Do something with the form values.
      // ✅ This will be type-safe and validated.
      console.log(values)
    }

  return (
        <main className="container mx-auto pt-12">
          <div className="flex justify-between items-center">
            <h1 className="text-4xl font-bold">Your Files</h1>
            <Dialog>
            <DialogTrigger>
              <Button onClick={() => {if(!orgId) return; createFile({ name: "hello world", orgId })}}>Click Me!</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="mb-8">Upload File Here</DialogTitle>
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
              </DialogHeader>
            </DialogContent>
          </Dialog>
          {files?.map((file) => (
            <div key={file._id}>
              <p>{file.name}</p>
            </div>
          ))}
     
          </div>
        </main>
  );
}
