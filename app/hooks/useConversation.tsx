import { useParams } from 'next/navigation'
import { useMemo } from 'react'


const useConversation = () => {
    const params = useParams<any>()

    const conversationId = useMemo(() => {
        return params?.conversationId || ("" as string)
    }, [params?.conversationId])

    const isActive = useMemo(() => {
        return !!conversationId
    }, [conversationId])

    return { conversationId, isActive }
}

export default useConversation