import { Card } from "@/components/ui/card"

type Props = React.PropsWithChildren<{}>

const ConversationContainer = ({ children }: Props) => {
    return (
        <Card className='h-[calc(100svh-32px)] justify-center items-center w-full lg:h-full p-2 flex-col gap-2'>{children}</Card>
    )
}

export default ConversationContainer