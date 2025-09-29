import { Card } from "@/components/ui/card"
import { MessageCircleIcon } from 'lucide-react'

type Props = {}

const ConversationFallback = (props: Props) => {
    return (
        <Card className='hidden bg-secondary text-secondary-foreground lg:flex lg:items-center lg:justify-center lg:h-full lg:w-full'>
            <MessageCircleIcon /> Select a Conversation to Get Started !!
        </Card>
    )
}

export default ConversationFallback