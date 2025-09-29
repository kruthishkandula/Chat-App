
'use client'

import ItemList from '@/components/shared/item-list/ItemList'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { api } from '@/convex/_generated/api'
import { useQuery } from 'convex/react'
import { LucideLoader2 } from 'lucide-react'
import React, { JSX } from 'react'
import AddFriendDialog from './_components/AddFriendDialog'
import EmptyRequests from './_components/EmptyRequests'
import FriendRequests from './_components/FriendRequests'

type Props = {
    children: React.ReactNode
}

const Friends_cms_data = [
    {
        title: 'Friends Requests',
        description: 'Manage your friend requests',
        content: 'friendrequests'
    },
    {
        title: 'Friends',
        description: 'Manage your friends',
        content: 'friends'
    },
]

const FriendsLayout = ({ children }: Props) => {
    const requests = useQuery(api.requests.getRequests)

    const AccordionView = ({ title, Content, description, index }: { title: string, Content: JSX.Element, description: string, index: number }) => {
        return (
            <AccordionItem value={`item-${index}`}>
                <AccordionTrigger className='flex flex-row items-center' style={{ fontSize: '1.5rem', fontWeight: 'bold', textDecoration: 'none' }}>
                    {title}
                </AccordionTrigger>
                <AccordionContent>
                    {Content}
                </AccordionContent>
            </AccordionItem>
        )
    }

    return <>
        <ItemList title='Friends'
            Action={<AddFriendDialog />}
        >
            <Accordion
                type="single"
                collapsible
                className="w-full "
                defaultValue={`item-1`}  >
                {Friends_cms_data?.map((item: any, index: any) => {
                    let Content = () => (<>
                        {
                            requests ? requests?.length == 0 ? <EmptyRequests /> : <FriendRequests requests={requests} /> : <div className='w-full h-full flex justify-center items-center' >
                                <LucideLoader2 className='w-8 h-8 animate-spin' />
                            </div>
                        }
                    </>)

                    return (
                        <AccordionView title={item.title} Content={<Content />} description={item.description} index={index} />
                    )
                })}
            </Accordion>
        </ItemList>
        {children}
    </>
}

export default FriendsLayout