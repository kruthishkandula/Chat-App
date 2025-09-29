import useMutationState from "@/app/hooks/useMutationState"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { api } from "@/convex/_generated/api"
import { ConvexError } from "convex/values"
import { Check, User, X } from "lucide-react"
import { toast } from "sonner"

type Props = {
    requests: any
}

const FriendRequests = ({ requests = [] }: Props) => {
    const { mutate, pending } = useMutationState(api.request.action)

    const handleFriendRequest = async (requestId: string, action: 'accept' | 'deny') => {
        try {
            const resData = await mutate({
                requestId: requestId,
                action: action
            })

            console.log('resData', resData)

            toast.success('Friend request accepted !!')
        } catch (error) {
            toast.error(error instanceof ConvexError ? error?.data : "Something Wen't wrong")
        }
    }

    return (
        <>
            {
                requests?.map((request: any) => (
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
                ))
            }
        </>
    )
}

export default FriendRequests