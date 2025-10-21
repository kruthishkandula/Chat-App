import { mutationGeneric, queryGeneric } from "convex/server";
import { ConvexError, v } from "convex/values";
import { getUserByEmail, validateUser } from "../_utils";


export const getRequests = queryGeneric({
    args: {
    },
    handler: async (ctx, args) => {
        // user validation
        let currentUser = await validateUser({ ctx })

        // get friend requests
        const requests = await ctx.db
            .query("requests")
            .withIndex("by_receiver", (q) => q.eq("receiver", currentUser._id))
            .collect();

        // get sender details for each request
        const requestsWithSenderDetails = await Promise.all(
            requests.map(async (request) => {
                const senderDetails = await ctx.db.get(request.sender);

                if (!senderDetails) {
                    return null
                }
                return senderDetails
            })
        )

        return requestsWithSenderDetails
    }
}
)

export const requestsCount = queryGeneric({
    args: {
    },
    handler: async (ctx, args) => {

        let currentUser = await validateUser({ ctx })

        const requestCount = await ctx.db
            .query("requests")
            .withIndex("by_receiver", (q: any) =>
                q.eq("receiver", currentUser._id)
            )
            .collect();

        return requestCount.length;
    }
})

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

export const friendsList = queryGeneric({
    args: {
    },
    handler: async (ctx, args) => {
        let currentUser = await validateUser({ ctx })

        // get friends where user is user1
        const friendsAsUser1 = await ctx.db
            .query("friends")
            .withIndex("by_user1", (q: any) => q.eq("user1", currentUser._id))
            .collect();

        // get friends where user is user2
        const friendsAsUser2 = await ctx.db
            .query("friends")
            .withIndex("by_user2", (q: any) => q.eq("user2", currentUser._id))
            .collect();

        const allFriends = [...friendsAsUser1, ...friendsAsUser2];

        // get friend details for each friend
        const friendsWithDetails = await Promise.all(
            allFriends.map(async (friend) => {
                const friendId = friend.user1 == currentUser._id ? friend.user2 : friend.user1;
                const friendDetails = await ctx.db.get(friendId);

                if (!friendDetails) {
                    return null
                }
                return { ...friendDetails, friendshipId: friend._id, conversationId: friend.conversationId }
            })
        )

        return friendsWithDetails.filter(f => f !== null);
    }
})

export const friendsCount = queryGeneric({
    args: {
    },
    handler: async (ctx, args) => {

        let currentUser = await validateUser({ ctx })

        // get friends where user is user1
        const friendsAsUser1 = await ctx.db
            .query("friends")
            .withIndex("by_user1", (q: any) => q.eq("user1", currentUser._id))
            .collect();

        // get friends where user is user2
        const friendsAsUser2 = await ctx.db
            .query("friends")
            .withIndex("by_user2", (q: any) => q.eq("user2", currentUser._id))
            .collect();

        return friendsAsUser1.length + friendsAsUser2.length;
    }
})

export const removeFriend = mutationGeneric({
    args: {
        friendshipId: v.id('friends')
    },
    handler: async (ctx, args) => {
        let currentUser = await validateUser({ ctx })

        // get friendship details
        const friendshipDetails = await ctx.db.get(args?.friendshipId)
        if (!friendshipDetails) {
            throw new ConvexError("Friendship not found")
        }

        // validate if current user is part of the friendship
        if (!friendshipDetails?.user1 == currentUser._id && !friendshipDetails?.user2 == currentUser._id) {
            throw new ConvexError("You are not authorized to remove this friend")
        }

        // delete friendship
        await ctx.db.delete(args?.friendshipId)

        // delete conversation members
        const conversationMembers = await ctx.db.query('conversationMembers').withIndex('by_conversation', (q: any) => q.eq('conversationId', friendshipDetails?.conversationId)).collect()
        for (const member of conversationMembers) {
            await ctx.db.delete(member._id)
        }

        // delete conversation
        await ctx.db.delete(friendshipDetails?.conversationId)

        return "Friend removed successfully"
    }
})
