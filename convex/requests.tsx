import { queryGeneric } from "convex/server";
import { validateUser } from "./_utils";

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