import { mutationGeneric } from "convex/server";
import { ConvexError, v } from "convex/values";
import { getUserByEmail, validateUser } from "./_utils";

// const handleCreateRequest = 

export const create = mutationGeneric({
    args: {
        email: v.string()
    },
    handler: async (ctx, args) => {

        let currentUser = await validateUser({ ctx })


        // self request check 
        if (args?.email == currentUser?.email) {
            throw new ConvexError("You can't send request yourself")
        }


        // get receiver details by email
        const receiverDetails = await getUserByEmail({ ctx, email: args?.email })
        if (!receiverDetails) {
            throw new ConvexError("Receiver not found")
        }

        // validate if multiple requests
        const requestAlreadySent = await ctx.db
            .query("requests")
            .withIndex("by_receiver_sender", (q: any) =>
                q.eq("receiver", receiverDetails._id).eq("sender", currentUser._id)
            )
            .unique();

        if (requestAlreadySent) {
            throw new ConvexError("Request already sent");
        }

        // validate if request received  
        const requestAlreadyReceived = await ctx.db
            .query("requests")
            .withIndex("by_receiver_sender", (q: any) =>
                q.eq("receiver", currentUser._id).eq("sender", receiverDetails._id)
            )
            .unique();

        if (requestAlreadyReceived) {
            throw new ConvexError("This user has sent you a request. Please check your requests.");
        }



        const request = ctx.db.insert('requests', {
            sender: currentUser?._id,
            receiver: receiverDetails?._id
        })

        return request;
    }
})

export const action = mutationGeneric({
    args: {
        requestId: v.id('users'),
        action: v.union(v.literal('accept'), v.literal('deny'))
    },
    handler: async (ctx, args) => {
        let currentUser = await validateUser({ ctx })

        // get friend request details
        const requestDetails = await ctx.db.query('requests').withIndex("by_receiver_sender", (q: any) => {
            return q.eq('sender', args?.requestId).eq('receiver', currentUser?._id)
        }).unique()
        if (!requestDetails) {
            throw new ConvexError("Friend Request was not found")
        }


        let friendsRequest;
        // create friendship
        if (args.action === "accept") {
            let conversationId = await ctx.db.insert('conversations', {
                isGroup: false
            })

            friendsRequest = await ctx.db.insert('friends', {
                user1: requestDetails?.sender,
                user2: requestDetails?.receiver,
                conversationId
            }).then(async (d) => {
                await ctx.db.insert('conversationMembers', {
                    memberId: requestDetails?.sender,
                    conversationId
                })
                await ctx.db.insert('conversationMembers', {
                    memberId: requestDetails?.receiver,
                    conversationId
                })
                await ctx.db.delete(requestDetails?._id)
                return d
            }).catch((err) => {
                console.log('accept request err---', err)
                throw new ConvexError('Failed to accept friend request')
            })
        } else {
            await ctx.db.delete(requestDetails?._id)
        }

        return args.action === "accept" ? friendsRequest : 'declined'
    }
}) 