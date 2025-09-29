import { queryGeneric } from "convex/server";
import { validateUser } from "../_utils";

export const get = queryGeneric({
    args: {
        
    },
    handler: async (ctx, args) => {
        let currentUser = await validateUser({ ctx })

        console.log('currentUser--', currentUser)

        const conversationMemberships = await ctx.db.query('conversationMembers').withIndex('by_memberId', (q) => q.eq('memberId', currentUser._id)).collect()

        console.log('conversationMemberships----', conversationMemberships)

        const conversations = await Promise.all(
            conversationMemberships.map(async (conv) => {
                let details = ctx.db.get(conv?.conversationId)

                if (!details) {
                    return null;
                }

                return details;

            })
        )


        const conversationsListWithDetails = await Promise.all(conversations?.map(async (conversation, index) => {
            const allConversationMembers = await ctx.db.query('conversationMembers').withIndex('by_conversationId', (q) => q.eq('conversationId', conversation?._id)).collect()

            if (conversation?.isGroup) {
                return { conversation }
            } else {
                const otherMembership = allConversationMembers?.filter(m => m?.memberId !== currentUser?._id)[0]

                return await ctx.db.get(otherMembership?.memberId)

            }
        }))

        return conversationsListWithDetails
    }
})