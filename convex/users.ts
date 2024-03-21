import { ConvexError, v } from "convex/values";
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
    args: { tokenIdentifier: v.string(), clerkId: v.string(), orgId: v.string() },
    async handler(ctx, args) {
        const user = await ctx.db
            .query("users")
            .withIndex('by_tokenIdentifier', q => 
                q.eq('tokenIdentifier', args.tokenIdentifier)
            )
            .first();

        if(!user) {
            throw new ConvexError('User not found');
        }

        await ctx.db.insert("users", {
            tokenIdentifier: args.tokenIdentifier,
            clerkId: args.clerkId,
            orgIds: [...user.orgIds, args.orgId],
        })
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