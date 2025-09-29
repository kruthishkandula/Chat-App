"use client"

import useNavigation from '@/app/hooks/useNavigation'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ThemeToggle } from '@/components/ui/theme/theme-toggle'
import { Tooltip, TooltipContent } from '@/components/ui/tooltip'
import { UserButton } from '@clerk/nextjs'
import { TooltipTrigger } from '@radix-ui/react-tooltip'
import Link from 'next/link'


const DesktopNav = () => {
    const paths = useNavigation({})

    return <Card className='hidden lg:flex lg:flex-col lg:justify-between lg:items-center lg:h-full lg:w-16 lg:px-2 lg:py-4'>

        <nav>
            <ul className='flex flex-col gap-4'>
                {paths.map((path) => {
                    return (
                        <li key={path.href} className='w-full'>
                            <Link href={path.href}>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            size={'icon'}
                                            variant={path?.active ? 'default' : 'outline'}
                                            className="relative" // <-- Add this
                                        >
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
                                    <TooltipContent side='right'>
                                        {path.name}
                                    </TooltipContent>
                                </Tooltip>
                            </Link>
                        </li>
                    )
                })}
            </ul>
        </nav>

        <div className='flex flex-col gap-4 items-center' >
            <ThemeToggle />
            <UserButton />
        </div>
    </Card>
}

export default DesktopNav