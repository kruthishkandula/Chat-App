import useMutationState from "@/app/hooks/useMutationState"
import { api } from "@/convex/_generated/api"
import { ConvexError } from "convex/values"
import { toast } from "sonner"
import { FriendCard } from "./Cards"

type Props = {
    requests: any
}

const Friends = ({ requests = [] }: Props) => {
    const { mutate, pending } = useMutationState(api.friends.requests.removeFriend)

    const handleFriendRemoval = async (requestId: string, action: 'accept' | 'deny') => {
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
                    <FriendCard key={request._id} request={request} handleRemoval={handleFriendRemoval} pending={pending} />
                ))
            }
        </>
    )
}

export default Friends