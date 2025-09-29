'use client';

import ItemList from '@/components/shared/item-list/ItemList';
import { api } from '@/convex/_generated/api';
import { useQuery } from 'convex/react';
import { LucideLoader2 } from 'lucide-react';
import React from 'react';
import ConversationsList from './_components/ConversationsList';
import Empty from './_components/Empty';

type Props = {
    children: React.PropsWithChildren<{}>;
}

const ConversationLayout = ({ children }: Props) => {
    const conversations = useQuery(api.conversations.conversations.get)

    return <>
        <ItemList
            title='Conversations'
            Action={null}
        >
            {
                conversations ? conversations?.length == 0 ? <Empty title='No Coversations found' /> : <ConversationsList conversations={conversations} /> : <div className='w-full h-full flex justify-center items-center' >
                    <LucideLoader2 className='w-8 h-8 animate-spin' />
                </div>
            }
        </ItemList>
        {children}
    </>
}

export default ConversationLayout