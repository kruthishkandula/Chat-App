import { api } from '@/convex/_generated/api'
import { useQuery } from 'convex/react'
import { MessageCircle, Users } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { useMemo } from 'react'

type Props = {}

const useNavigation = (props: Props) => {
    const pathname = usePathname()

    const requestsCount = useQuery(api.requests.requestsCount)

    const paths = useMemo(() => {
        return [
            {
                name: 'Conversations',
                href: '/conversations',
                icon: <MessageCircle />,
                active: pathname?.startsWith('/conversations') || false
            },
            {
                name: 'Friends',
                href: '/friends',
                icon: <Users />,
                count: requestsCount || undefined,
                active: pathname == '/friends' || false
            }
        ]
    }, [pathname, requestsCount])


    return paths
}

export default useNavigation