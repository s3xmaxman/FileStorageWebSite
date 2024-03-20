import { formatRelative } from "date-fns";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
import { Doc, Id } from "../../../../convex/_generated/dataModel"

import {FileTextIcon, GanttChartIcon, ImageIcon } from "lucide-react"
import { ReactNode} from "react"
import { useQuery } from "convex/react"
import { api } from "../../../../convex/_generated/api"

import Image from "next/image"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { FileCardActions, getFileUrl } from "./file-actions";

  

export function FileCard({ file, favorites }: { file: Doc<"files">, favorites: Doc<"favorites">[] }) {
    const userProfile = useQuery(api.users.getUserProfile,{ userId: file.userId})
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
                <CardTitle className="flex gap-2 text-base font-normal">
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
            <CardFooter className="flex gap-2 text-xs text-gray-700">
                <div className="flex gap-2 text-xs text-gray-700 w-40 items-center">
                    <Avatar className="w-8 h-8">
                        <AvatarImage src={userProfile?.image} />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    {userProfile?.name}
                </div>
                <div className="text-xs text-gray-700">
                    Uploaded on {formatRelative(new Date(file._creationTime), new Date())}
                </div>
            </CardFooter>
        </Card>
    )
}