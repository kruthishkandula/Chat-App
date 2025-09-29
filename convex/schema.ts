import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    users: defineTable({
        username: v.string(),
        email: v.string(),
        imageUrl: v.string(),
        clerkId: v.string(),
    }).index("by_email", ["email"]).index("by_clerkId", ["clerkId"]),

    requests: defineTable({
        receiver: v.id("users"),
        sender: v.id("users"),
        requestSentBy: v.optional(v.id('users'))
    }).index("by_receiver_sender", ["receiver", "sender"]).index("by_receiver", ["receiver"]),

    friends: defineTable({
        user1: v.id("users"),
        user2: v.id("users"),
        conversationId: v.id('conversations')
    }).index('by_user1', ['user1']).index('by_user2', ['user2']).index('by_conversationId', ['conversationId']),

    conversations: defineTable({
        name: v.optional(v.string()),
        isGroup: v.boolean(),
        lastMessageId: v.optional(v.id('messages')),
        imageUrl: v.optional(v.string())
    }),

    conversationMembers: defineTable({
        memberId: v.id('users'),
        conversationId: v.id("conversations"),
        lastSeenMessage: v.optional(v.id('messages'))
    }).index('by_memberId', ['memberId']).index('by_conversationId', [
        'conversationId'
    ]).index('by_memberId_conversationId', ['memberId', 'conversationId']),

    messages: defineTable({
        senderId: v.id('users'),
        conversationId: v.id('conversations'),
        type: v.string(),
        content: v.array(v.string())
    }).index('by_conversationId', ['conversationId'])
})