import { v } from "convex/values";
import { internalMutation } from "./_generated/server";

export const createUser = internalMutation({
    args: { tokenIdentifier: v.string(), clerkId: v.string() },
    async handler(ctx, args) {
        await ctx.db.insert("users", {
            tokenIdentifier: args.tokenIdentifier,
            clerkId: args.clerkId,
            orgIds: [],
        });
    }
});

export const addOrgIdToUser = internalMutation({
    args: { tokenIdentifier: v.string(), clerkId: v.string(),  },
    async handler(ctx, args) {
        await ctx.db.insert("users", {
            const user = await.ctx.db.query("users", { tokenIdentifier: args.tokenIdentifier });
            tokenIdentifier: args.tokenIdentifier,
            clerkId: args.clerkId,
            orgIds: [],
        });
    }
});


/* import { v } from "convex/values";
import { internalMutation } from "./_generated/server";

export const createUser = internalMutation({
    args: { tokenIdentifier: v.string(), clerkId: v.string() },
    async handler(ctx, args) {
        await ctx.db.insert("users", { 
            tokenIdentifier: args.tokenIdentifier,
        });
    }

}) */