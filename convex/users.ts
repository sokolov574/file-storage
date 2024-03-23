import { ConvexError, v } from "convex/values";
import { QueryCtx, internalMutation, MutationCtx } from "./_generated/server";

export async function getUser(ctx: QueryCtx | MutationCtx, tokenIdentifier: string) 

{
    const user = await ctx.db
            .query("users")
            .withIndex('by_tokenIdentifier', q => 
                q.eq('tokenIdentifier', tokenIdentifier)
            )
            .first();

            if(!user) {
                throw new ConvexError('User not found');
            }


            return user;
}

export const createUser = internalMutation({
    args: { tokenIdentifier: v.string(), clerkId: v.string() },
    async handler(ctx, args) {
        await ctx.db.insert("users", {
            tokenIdentifier: args.tokenIdentifier,

            orgIds: [],
        });
    }
});

export const addOrgIdToUser = internalMutation({
    args: { tokenIdentifier: v.string(), clerkId: v.string(), orgId: v.string() },
    async handler(ctx, args) {
        const user = await getUser(ctx, args.tokenIdentifier)

        await ctx.db.insert("users", {
            tokenIdentifier: args.tokenIdentifier,

            orgIds: [...user.orgIds, args.orgId],
        })
    }
});
