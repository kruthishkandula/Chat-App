import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card } from "@/components/ui/card"
import { User } from "lucide-react"
import Link from "next/link"

type Props = {
    conversations: any
}

const ConversationsList = ({ conversations = [] }: Props) => {


    return (
        <>
            {
                conversations?.map((request: any) => (
                    <Card key={request._id} className="w-full  mt-4 p-2 flex-row items-center justify-between gap-2">
                        <Link href={{
                            pathname: `/conversations/${request.conversationId}`,
                        }} >
                            <div className="flex items-center gap-4">
                                <Avatar>
                                    <AvatarImage src={request?.imageUrl} alt={request.name} />
                                    <AvatarFallback>
                                        <User />
                                    </AvatarFallback>
                                </Avatar>

                                <div className="flex-col">
                                    <h2 className="truncate">{request?.username || "Conv"}</h2>
                                    <h2 className="truncate text-muted-foreground">{request?.email || "Conv"}</h2>
                                </div>
                            </div>
                        </Link>
                    </Card>
                ))
            }
        </>
    )
}

export default ConversationsList