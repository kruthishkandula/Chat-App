import { ConvexError } from "convex/values";
import { MutationCtx, QueryCtx } from "./_generated/server";

export const getUserByClerkId = async ({ ctx, clerkId }: { ctx: MutationCtx | QueryCtx, clerkId: string }) => {
    return await ctx.db.query("users").withIndex("by_clerkId", (q) => {
        return q.eq('clerkId', clerkId)
    }).unique()

}


export const getUserByEmail = async ({ ctx, email }: { ctx: MutationCtx | QueryCtx, email: string }) => {

    return await ctx.db.query("users").withIndex("by_email", (q) => {
        return q.eq('email', email)
    }).first()

}

export const validateUser: any = async ({ ctx }: { ctx: MutationCtx | QueryCtx }) => {
    // user validation
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) {
        throw new ConvexError("Unauthorized")
    }

    // get current user details
    const currentUser = await getUserByClerkId({ ctx, clerkId: identity?.subject })
    if (!currentUser) {
        throw new ConvexError("User not found")
    }

    return currentUser
}