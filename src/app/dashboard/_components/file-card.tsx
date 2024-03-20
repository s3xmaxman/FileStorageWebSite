import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
import { Doc, Id } from "../../../../convex/_generated/dataModel"
import { Button } from "@/components/ui/button"
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
  
import { FileTextIcon, GanttChartIcon, ImageIcon, MoreVertical, StarHalf, StarIcon, TrashIcon, UndoIcon } from "lucide-react"
import { ReactNode, useState } from "react"
import { useMutation } from "convex/react"
import { api } from "../../../../convex/_generated/api"
import { useToast } from "@/components/ui/use-toast"
import Image from "next/image"
import { Protect } from "@clerk/nextjs"
  

function FileCardActions({ file, isFavorite }: { file: Doc<"files">, isFavorite: boolean }) {
    const { toast } = useToast()
    const deleteFile = useMutation(api.files.deleteFile)
    const restoreFile = useMutation(api.files.restoreFile)
    const toggleFavorite = useMutation(api.files.toggleFavorite)
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
                        role="org:admin"
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

function getFileUrl(fileId: Id<"_storage">): string {
    return `${process.env.NEXT_PUBLIC_CONVEX_URL}/api/storage/${fileId}`;
}



export function FileCard({ file, favorites }: { file: Doc<"files">, favorites: Doc<"favorites">[] }) {
    const isFavorite = (fileId: Id<"files">) => {
        return favorites.some(favorite => favorite.fileId === fileId)
    }
    
    const typeIcons = {
        image: <ImageIcon />,
        pdf: <FileTextIcon />,
        csv: <GanttChartIcon />,
    } as Record<Doc<"files">["type"], ReactNode>

    return (
        <Card>
            <CardHeader className="relative">
                <CardTitle className="flex gap-2">
                    <div className="flex justify-center">
                        {typeIcons[file.type]}
                    </div>{" "}
                    {file.name}
                </CardTitle>
                <div className="absolute top-2 right-2">
                    <FileCardActions isFavorite={isFavorite(file._id)} file={file} />
                </div>
            </CardHeader>
            <CardContent className="h-[200px] flex justify-center items-center">
                {file.type === "image" && 
                    <Image 
                        alt={file.name} 
                        width="200" 
                        height="100" 
                        src={getFileUrl(file.fileId)} 
                        className="object-cover max-h-full max-w-full"
                    />
                }
                {file.type === "csv" && <FileTextIcon className="w-20 h-20" />}
                {file.type === "pdf" && <FileTextIcon className="w-20 h-20" />}
            </CardContent>
            <CardFooter className="flex justify-center">
                <Button
                    onClick={() => {
                        window.open(getFileUrl(file.fileId), "_blank")
                    }}
                >
                    Download
                </Button>
            </CardFooter>
        </Card>
    )
}