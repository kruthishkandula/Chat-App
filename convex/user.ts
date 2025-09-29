import { internalMutationGeneric, internalQueryGeneric } from "convex/server"
import { v } from "convex/values"


export const create = internalMutationGeneric({
    args: { 
        clerkId: v.string(),
        username: v.string(), 
        email: v.string() ,
        imageUrl: v.string(),
    },
    handler: async (ctx, args) => {
        ctx.db.insert("users", args)
    }
       
})

export const get = internalQueryGeneric({
    args: { clerkId: v.string() },
    handler: async (ctx, args) => {
        return ctx.db
            .query("users")
            .filter(q => q.eq("clerkId", args.clerkId))
            .first()
    }
})