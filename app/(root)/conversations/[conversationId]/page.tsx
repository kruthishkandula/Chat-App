'use client'
import useMutationState from '@/app/hooks/useMutationState'
import ConversationContainer from '@/components/shared/conversation/ConversationContainer'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { api } from '@/convex/_generated/api'
import { zodResolver } from '@hookform/resolvers/zod'
import { usePaginatedQuery, useQuery } from 'convex/react'
import { ConvexError } from 'convex/values'
import { Image, Phone, User, Video } from 'lucide-react'
import { useParams } from 'next/navigation'
import { useCallback, useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import z from 'zod'
import ChatCard from './_components/ChatCard'


const messageSchem = z.object({
  message: z.string().min(1, {
    message: "This Field cannot be empty "
  })
})

type sop = z.infer<typeof messageSchem>

const ConversationPage = () => {
  const params = useParams()

  const form = useForm<sop>({
    resolver: zodResolver(messageSchem),
    defaultValues: {
      message: ''
    }
  })

  const conversationDetails = useQuery(api.conversations.conversation.get)
  const {
    results,
    status,
    loadMore,
    isLoading
  } = usePaginatedQuery(
    api.conversations.messages.list,
    {
      conversationId: params?.conversationId as any,
    },
    { initialNumItems: 5 },
  );
  const { mutate: createMessage, pending } = useMutationState(api.conversations.messages.create)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const prevResultsLength = useRef<number>(0)

  // Maintain scroll position when loading more messages at the top
  const prevScrollHeight = useRef<number>(0);
  const prevStatus = useRef<string>("");

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    // Save scrollHeight before loading more
    if (status === "LoadingMore" && prevStatus.current !== "LoadingMore") {
      prevScrollHeight.current = container.scrollHeight;
    }

    // After loading more, restore scrollTop
    if (
      prevStatus.current === "LoadingMore" &&
      status !== "LoadingMore" &&
      prevScrollHeight.current
    ) {
      // Wait for DOM to update
      setTimeout(() => {
        if (container && prevScrollHeight.current) {
          container.scrollTop = container.scrollHeight - prevScrollHeight.current;
          prevScrollHeight.current = 0;
        }
      }, 0);
    }

    prevStatus.current = status;
  }, [results.length, status]);

  // Scroll to bottom ONLY when a new message is added at the end (not when loading more at the top)
  useEffect(() => {
    // If not loading more and results increased, scroll to bottom
    if (
      status !== "LoadingMore" &&
      results.length > prevResultsLength.current
    ) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
    prevResultsLength.current = results.length;
  }, [results.length, status]);

  // Scroll to bottom on mount
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'auto' });
  }, [])

  // Infinite scroll up to load more messages
  const handleScroll = useCallback(() => {
    const container = messagesContainerRef.current;
    if (!container) return;
    if (container.scrollTop === 0 && status === "CanLoadMore" && !isLoading) {
      loadMore(5)
    }
  }, [status, isLoading, loadMore])

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;
    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [handleScroll])

  const handleSubmit = (d: { message: string }) => {
    try {
      const { message } = d;
      createMessage({
        conversationId: params?.conversationId as any,
        body: message
      });

      form.reset()
      // toast.success('Message Sent Successfully', {
      //   duration: 2000,
      //   position: 'top-center'
      // })
    } catch (error) {
      toast.error(error instanceof ConvexError ? error.data : 'Failed to send message')
    }
  }

  return (
    <ConversationContainer>
      <div className='flex w-full flex-col h-full justify-between' >
        {/* header */}
        <div className='w-full flex flex-row py-4 justify-between border-b' >
          <div className='flex flex-row justify-start items-center gap-2' >
            <Avatar>
              <AvatarImage src={conversationDetails?.[0]?.imageUrl} />
              <AvatarFallback>
                <User />
              </AvatarFallback>
            </Avatar>
            {conversationDetails && <div className='text-foreground font-bold text-[24px]' >{conversationDetails?.[0]?.username}</div>}
          </div>

          <div className='flex flex-row gap-2' >
            <Button onClick={() => { }}>
              <Phone />
            </Button>
            <Button onClick={() => { }}>
              <Video />
            </Button>
          </div>
        </div>

        {/* messages */}
        <div
          className='flex flex-col overflow-y-auto p-4 space-y-4 flex-1'
          ref={messagesContainerRef}
          style={{ height: '100%', minHeight: 0 }}
        >
          {/* Loader for initial load */}
          {status === "LoadingFirstPage" && (
            <div className="flex w-full justify-center items-center py-4">
              <span className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
              <span className="ml-2">Loading messages...</span>
            </div>
          )}

          {/* Loader for fetching more (pagination) */}
          {status === "LoadingMore" && (
            <div className="flex w-full justify-center items-center py-2">
              <span className="animate-spin rounded-full h-6 w-6 border-b-2 border-muted" />
              <span className="ml-2 text-sm text-muted-foreground">Fetching more...</span>
            </div>
          )}

          <div className='flex w-full justify-center items-center' >
            {
              results?.length === 0 && status !== "LoadingFirstPage" && <div>No Chat Found. Start conversation</div>
            }
          </div>
          {/* Render messages in reverse so newest is at the bottom */}
          {results.length > 0 && [...results].reverse().map(({ _id, content, ...d }: any) => (
            <ChatCard key={_id.toString()} message={content[0]} {...d} />
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* input */}
        <div className='w-full p-4 border-t' >
          <Form {...form}>
            <form className=' flex flex-row gap-4' onSubmit={form.handleSubmit(handleSubmit)}>
              <Button onClick={() => {
              }} >
                <Image />
              </Button>
              <FormField
                control={form.control}
                name='message'
                render={({ field }) => {
                  return (
                    <FormItem className='w-full' >
                      <FormControl className='w-full' >
                        <Input type="text" height={400} placeholder='Enter Message...' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )
                }}
              />
              <Button
                type='submit'
              >Send</Button>
            </form>
          </Form>
        </div>
      </div>
    </ConversationContainer>
  );
}

export default ConversationPage