import { mutationGeneric, paginationOptsValidator } from "convex/server";
import { v } from "convex/values";
import { query } from "../_generated/server";
import { validateUser } from "../_utils";

export const list = query({
    args: { paginationOpts: paginationOptsValidator, conversationId: v.id('conversations') },
    handler: async (ctx, args) => {
        const currentUser = await validateUser({ ctx })

        if (!currentUser) {
            throw new Error("User not authenticated")
        }

        const paginated = await ctx.db
            .query("messages")
            .withIndex("by_conversationId", (q) => q.eq("conversationId", args.conversationId))
            .order("desc") // changed from "asc" to "desc"
            .paginate(args.paginationOpts);

        // Map the page to add senderDetails and is_user
        const mappedPage = await Promise.all(
            paginated.page.map(async (msg) => {
                let is_user = msg.senderId.toString() === currentUser._id.toString();
                // let senderDetails = await ctx.db.get(msg.senderId)
                return {
                    ...msg,
                    is_user
                }
            })
        );

        // Return the paginated object, but with the mapped page
        return {
            ...paginated,
            page: mappedPage,
        };
    },
});

export const create = mutationGeneric({
    args: {
        conversationId: v.id('conversations'),
        body: v.string()
    },
    handler: async (ctx, args) => {

        const currentUser = await validateUser({ ctx })

        if (!currentUser) {
            throw new Error("User not authenticated")
        }

        const messageId = await ctx.db.insert("messages", {
            senderId: currentUser?._id,
            conversationId: args.conversationId,
            type: 'text',
            content: [args.body]
        });


        await ctx.db.patch(args.conversationId, {
            lastMessageId: messageId
        })

        return messageId;
    }
})