'use client'

import useConversation from '@/app/hooks/useConversation';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

type Props = {
    title: string
    Action: any;
    items?: any[]
    renderItem?: (item: any) => React.ReactNode
    children?: React.ReactNode
}

const ItemList = ({ title, Action, children }: Props) => {
    const { isActive } = useConversation()

    return (
        <Card className={cn('hidden h-full w-full lg:flex-none lg:w-80 p-2', {
            'block': !isActive,
            'lg:block': isActive
        })}>
            <div className='flex items-center justify-between'>
                <h2 className='text-2xl tracking-tight font-semibold'>{title}</h2>
                {Action ? Action : null}
            </div>
            <div className='w-full h-full flex-col items-center justify-start gap-4' >
                {children}
            </div>
        </Card>
    )
}

export default ItemList