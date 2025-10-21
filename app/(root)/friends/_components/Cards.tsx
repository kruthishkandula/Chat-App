import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar"
import { Check, Trash2, User, X } from "lucide-react"

type Props = {
    request: any,
    handleFriendRequest: (requestId: string, action: 'accept' | 'deny') => void,
    pending: boolean
}

export const RequestCard = ({ request, handleFriendRequest, pending }: Props) => {

    type FriendProps = {
        request: any,
        handleRemoval: (requestId: string, action: 'accept' | 'deny') => void,
        pending: boolean
    }
    return (
        <Card key={request._id} className="w-full  mt-4 p-2 flex-row items-center justify-between gap-2">
            <div className="flex items-center gap-4">
                <Avatar>
                    <AvatarImage src={request.imageUrl} alt={request.name} />
                    <AvatarFallback>
                        <User />
                    </AvatarFallback>
                </Avatar>

                <div className="flex-col">
                    <h2 className="truncate">{request.username}</h2>
                    <p className="text-xs text-muted-foreground truncate">{request.email}</p>
                </div>
            </div>
            <div className="flex lg:flex-col items-center gap-2" >
                <Button disabled={pending} size={'icon'} onClick={() => { handleFriendRequest(request?._id, 'accept') }} >
                    <Check />
                </Button>
                <Button disabled={pending} size={'icon'} onClick={() => { handleFriendRequest(request?._id, 'deny') }} variant={'destructive'} >
                    <X />
                </Button>
            </div>
        </Card>
    )
}

type FriendProps = {
    request: any,
    handleRemoval: (requestId: string) => void,
    pending: boolean
}

export const FriendCard = ({ request, handleRemoval, pending }: FriendProps) => {

    return (
        <Card key={request._id} className="w-full mt-2 p-2 flex-row items-center justify-between gap-2">
            <div className="flex items-center gap-4">
                <Avatar >
                    <AvatarImage className="rounded-4xl" src={request.imageUrl} alt={request.name} />
                    <AvatarFallback>
                        <User />
                    </AvatarFallback>
                </Avatar>

                <div className="flex-col">
                    <h2 className="truncate">{request.username}</h2>
                    <p className="text-xs text-muted-foreground truncate">{request.email}</p>
                </div>
            </div>
            <div className="flex lg:flex-col items-center gap-2" >
                <Dialog>
                    <DialogTrigger asChild>
                        <Button disabled={pending} size={'icon'} variant={'destructive'} >
                            <Trash2 />
                        </Button>
                    </DialogTrigger>

                    <DialogContent>
                        <DialogTitle>
                            Remove Friend
                        </DialogTitle>
                        <DialogDescription>
                            <div className="flex flex-col items-center" >
                                <h2 className="text-lg font-bold text-card-foreground text-center">Are you sure you want to remove {request.username} from your friends?</h2>
                            </div>
                        </DialogDescription>
                        <DialogTrigger asChild>
                            <Button disabled={pending} variant={'destructive'} onClick={() => { handleRemoval(request?._id) }} >Confirm</Button>
                        </DialogTrigger>
                        <DialogTrigger asChild>
                            <Button variant={'outline'} onClick={() => { }} style={{ marginLeft: 10 }}>Cancel</Button>
                        </DialogTrigger>
                    </DialogContent>
                </Dialog>
            </div>
        </Card>
    )
}


