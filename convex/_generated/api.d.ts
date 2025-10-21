/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as _utils from "../_utils.js";
import type * as conversations_conversation from "../conversations/conversation.js";
import type * as conversations_conversations from "../conversations/conversations.js";
import type * as conversations_messages from "../conversations/messages.js";
import type * as friends_requests from "../friends/requests.js";
import type * as http from "../http.js";
import type * as user from "../user.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  _utils: typeof _utils;
  "conversations/conversation": typeof conversations_conversation;
  "conversations/conversations": typeof conversations_conversations;
  "conversations/messages": typeof conversations_messages;
  "friends/requests": typeof friends_requests;
  http: typeof http;
  user: typeof user;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
