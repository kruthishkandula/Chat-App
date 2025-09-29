"use client"

import useConversation from '@/app/hooks/useConversation'
import useNavigation from '@/app/hooks/useNavigation'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ThemeToggle } from '@/components/ui/theme/theme-toggle'
import { Tooltip, TooltipContent } from '@/components/ui/tooltip'
import { UserButton } from '@clerk/nextjs'
import { TooltipTrigger } from '@radix-ui/react-tooltip'
import Link from 'next/link'


const MobileNav = () => {
    const paths = useNavigation({})
    const { isActive } = useConversation()

    if (isActive) return null

    return <Card className='fixed bottom-4 w-[calc(100%-32px)] flex-row items-center h-16 p-2 lg:hidden'>
        <nav className='w-full'>
            <ul className='flex flex-row justify-evenly items-center'>
                {paths.map((path) => {
                    return (
                        <li key={path.href} className='relative'>
                            <Link href={path.href}>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button className='relative' size={'icon'} variant={path?.active ? 'default' : 'outline'} >
                                            {path.icon}
                                            {
                                                path.count ? (
                                                    <div className="absolute left-6 bottom-7">
                                                        <Badge variant="default">
                                                            {path.count}
                                                        </Badge>
                                                    </div>
                                                ) : null
                                            }
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent side='top'>
                                        {path.name}
                                    </TooltipContent>
                                </Tooltip>
                            </Link>
                        </li>
                    )
                })}
                <li className='relative' >
                    <ThemeToggle />
                </li>
                <li className='relative' >
                    <UserButton />
                </li>
            </ul>
        </nav>

    </Card>
}

export default MobileNav