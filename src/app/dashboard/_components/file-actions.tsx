import { useToast } from "@/components/ui/use-toast"
import { useMutation, useQuery } from "convex/react"
import { Doc, Id } from "../../../../convex/_generated/dataModel"
import { api } from "../../../../convex/_generated/api"
import { useState } from "react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
  import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"
import { FileIcon, MoreVertical, StarIcon, TrashIcon, UndoIcon } from "lucide-react"
import { Protect } from "@clerk/nextjs"
export function FileCardActions({ file, isFavorite }: { file: Doc<"files">, isFavorite: boolean }) {
    const { toast } = useToast()
    const deleteFile = useMutation(api.files.deleteFile)
    const restoreFile = useMutation(api.files.restoreFile)
    const toggleFavorite = useMutation(api.files.toggleFavorite)
    const me = useQuery(api.users.getMe)
    const [ isConfirmOpen, setIsConfirmOpen ] = useState(false)
    return (
        <>
            <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your account
                        and remove your data from our servers.
                    </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={() => {
                            deleteFile({
                                fileId: file._id,
                            })
                            toast({
                                variant: "default",
                                title: "File marked for deletion",
                                description: "Your file will be deleted soon",
                            });
                        }}
                    >
                        Continue
                    </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <DropdownMenu>
              <DropdownMenuTrigger>
                <MoreVertical />
              </DropdownMenuTrigger>
                <DropdownMenuContent>
                <DropdownMenuItem
                    onClick={() => {
                    window.open(file.url, "_blank");
                    }}
                    className="flex gap-1 items-center cursor-pointer"
                >
                    <FileIcon className="w-4 h-4" /> Download
                </DropdownMenuItem>
                    <DropdownMenuItem 
                        className="flex gap-1 cursor-pointer"
                        onClick={() => toggleFavorite({ fileId: file._id })}
                    >   
                        {isFavorite ? (
                            <div className="flex gap-1 items-center">
                                <StarIcon className="w-4 h-4 fill-[hsl(222.2,47.4%,11.2%)]" /> Favorite
                            </div>
                        ) : (
                            <div className="flex gap-1 items-center">
                                <StarIcon className="w-4 h-4" /> Favorite
                            </div>
                        )}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <Protect
                        condition={(check) => {
                            return (
                              check({
                                role: "org:admin",
                              }) || file.userId === me?._id
                            );
                        }}
                        fallback={<></>}
                    >
                    <DropdownMenuItem 
                        className="flex gap-1 items-center cursor-pointer"
                        onClick={() => {
                            if(file.shouldDelete) {
                                restoreFile({
                                    fileId: file._id
                                })
                            } else {
                                setIsConfirmOpen(true)
                            }
                          } 
                        }
                    >    
                        {file.shouldDelete ? (
                            <div className="flex gap-1 items-center cursor-pointer text-green-600">
                                <UndoIcon className="w-4 h-4" /> Restore
                            </div>
                        ) : (
                            <div className="flex gap-1 items-center cursor-pointer text-red-600">
                                <TrashIcon className="w-4 h-4" /> Delete
                            </div>
                        )}
                       
                    </DropdownMenuItem>
                    </Protect>
                </DropdownMenuContent>
             </DropdownMenu>
       </>
    )
}

export function getFileUrl(fileId: Id<"_storage">): string {
    return `${process.env.NEXT_PUBLIC_CONVEX_URL}/api/storage/${fileId}`;
}
