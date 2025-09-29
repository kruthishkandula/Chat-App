'use client'

import { useForm } from 'react-hook-form'
import z from 'zod'

import useMutationState from '@/app/hooks/useMutationState'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { api } from '@/convex/_generated/api'
import { zodResolver } from '@hookform/resolvers/zod'
import { ConvexError } from 'convex/values'
import { UserPlus } from 'lucide-react'
import { toast } from 'sonner'

type Props = {}

const addFriendSchem = z.object({
  email: z.string().min(1, {
    message: "This Field cannot be empty "
  }).email({
    message: "Enter a valid email"
  })
})

type sop = z.infer<typeof addFriendSchem>

const AddFriendDialog = (props: Props) => {
  const form = useForm<sop>({
    resolver: zodResolver(addFriendSchem),
    defaultValues: {
      email: ''
    }
  })

  const { mutate: createRequest, pending } = useMutationState(api.request.create)

  const handleSubmit = async (data: sop) => {
    try {
      console.log('data', data)
      const resData = await createRequest({ email: data.email })
      console.log({ resData })
      toast.success("Friend request sent successfully")
    } catch (error) {
      toast.error(error instanceof ConvexError ? error.data : "Something went wrong")
    }
  }

  return (
    <Dialog>
      <Tooltip>
        <TooltipTrigger asChild>
          <DialogTrigger asChild>
            <Button size={'icon'} variant={'outline'} >
              <UserPlus />
            </Button>
          </DialogTrigger>
        </TooltipTrigger>
        <TooltipContent>
          <p>Add a friend</p>
        </TooltipContent>
      </Tooltip>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a Friend</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          Enter email address of friend to connect!
        </DialogDescription>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder='Email..' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )
              }}
            />
            <DialogFooter style={{ marginTop: 20 }}>
              <Button disabled={false} variant={'default'} type='submit'>Add Friend</Button>
            </DialogFooter>
          </form>
        </Form>

      </DialogContent>
    </Dialog >
  )
}

export default AddFriendDialog