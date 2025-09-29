import { WebhookEventType } from "@clerk/nextjs/server";
import { httpActionGeneric, httpRouter } from "convex/server";
import { Webhook } from "svix";
import { internal } from './_generated/api';

const http = httpRouter();

const validatePayload = async (req: Request): Promise<any> => {
    const payload = await req.text();

    const svixHeaders = {
        'svix-id': req.headers.get('svix-id') || '',
        'svix-timestamp': req.headers.get('svix-timestamp') || '',
        'svix-signature': req.headers.get('svix-signature') || ''
    }

    const webhook = new Webhook(process.env.CLERK_WEBHOOK_SECRET || '');

    try {
        const evt = webhook.verify(payload, svixHeaders) as WebhookEventType;
        return evt;
    } catch (err) {
        console.error("Error verifying Clerk webhook:", err);
        return undefined;
    }
};


const handleClerkWebhook = httpActionGeneric(async (ctx, req) => {
    const event = await validatePayload(req);
    console.log('event----', event)
    if (!event) {
        return new Response("Invalid webhook", { status: 400 });
    }

    let user;
    switch (event.type) {
        case "user.created":
            user = await ctx.runQuery(internal.user.get, { clerkId: event.data.id });
            if (user) {
                return new Response("User already exists", { status: 200 });
            }
        case "user.updated":
             if (!user) {
                user = await ctx.runQuery(internal.user.get, { clerkId: event.data.id });
            }
            console.log('updating/creating user---', user )
            await ctx.runMutation(internal.user.create, {
                username: `${event.data.first_name} ${event.data.last_name}`.trim(),
                clerkId: event.data.id,
                email: event.data.email_addresses?.[0]?.email_address || undefined,
                imageUrl: event.data.image_url || undefined,

            });
            break;
        default:
            console.log(`Unhandled event type: ${event.type}`);
            break;
    }

    return new Response("Webhook received", { status: 200 });
});

http.route({
    path: "/clerk-users-webhook",
    method: "POST",
    handler: handleClerkWebhook
})


export default http;