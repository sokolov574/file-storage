import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getUser } from "./users";

export const createFile = mutation({
    args: {
        name: v.string(),
        orgId: v.string(),
    },
    async handler (ctx, args) {
      const identity = await ctx.auth.getUserIdentity();
      
      if (!identity) {
        throw new ConvexError("You must be signed in to create a file")
      }

      const user = await getUser(ctx, identity.tokenIdentifier)

      if(!user) {
        throw new ConvexError("user should have been defined")
      }


        await ctx.db.insert("files", { 
          name: args.name,
          orgId: args.orgId,
         })
    },
})

export const getFiles = query({
    args: {
        orgId: v.string(),
    },
    async handler(ctx, args) {
        const identity = await ctx.auth.getUserIdentity();

        if (!identity) {
            return [];
        }

        return ctx.db
        .query("files")
        .withIndex("by_orgId", q => q.eq("orgId", args.orgId))
        .collect();
    }
})