import { ConvexError, v } from "convex/values";
import { MutationCtx, QueryCtx, mutation, query } from "./_generated/server";
import { getUser } from "./users";
import { fileTypes } from "./schema";



export const generateUploadUrl = mutation(async (ctx) => {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw new ConvexError("You must be signed in to create a file")
  }

  return await ctx.storage.generateUploadUrl();
});

async function hasAccessToOrg(ctx: QueryCtx | MutationCtx, tokenIdentifier: string, orgId: string) {
  const user = await getUser(ctx, tokenIdentifier)

  const hasAccess = 
   user.orgIds.includes(orgId) ||
   user.tokenIdentifier.includes(orgId);

  return hasAccess;

}


export const createFile = mutation({
    args: {
      name: v.string(),
      fileId: v.id("_storage"),
      orgId: v.string(),
      type: fileTypes,
    },
    async handler (ctx, args) {
      const identity = await ctx.auth.getUserIdentity();
      
      if (!identity) {
        throw new ConvexError("You must be signed in to create a file")
      }

      const hasAccess = await hasAccessToOrg(
        ctx, 
        identity.tokenIdentifier, 
        args.orgId);

    if (!hasAccess) 
       {
      throw new ConvexError("You do not have access to this organization")
    }

        await ctx.db.insert("files", { 
          name: args.name,
          fileId: args.fileId,
          orgId: args.orgId,
          type: args.type
         })
    },
})



export const getFiles = query({
    args: {
        orgId: v.string(),
        query: v.optional(v.string())
    },
    async handler(ctx, args) {
        const identity = await ctx.auth.getUserIdentity();

        if (!identity) {
            return [];
        }

        const hasAccess = await hasAccessToOrg(
          ctx, 
          identity.tokenIdentifier, 
          args.orgId);


          if (!hasAccess) {
            return [];
          }

          const files = await ctx.db
            .query("files")
            .withIndex("by_orgId", q => q.eq("orgId", args.orgId))
            .collect();

          const query = args.query;

          if (query) {
            return files.filter(file => 
              file.name.toLowerCase().includes(query.toLowerCase())
              );
          } else {
            return files;
          }
        }
})

export const deleteFile = mutation({
  args: { fileId: v.id("files") },
  async handler(ctx, args) {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new ConvexError("You do not have access to this organization")
    }

    const file = await ctx.db.get(args.fileId);

    if (!file) {
      throw new ConvexError("this File does not exist");
    }

    //TODO delete or no
    if (!file.orgId) {
      throw new ConvexError("File does not have an organization ID");
    }

    const hasAccess = await hasAccessToOrg(
      ctx, 
      identity.tokenIdentifier, 
      file.orgId);

    if (!hasAccess) {
      throw new ConvexError("You do not have access to delete this file")
    }

    await ctx.db.delete(args.fileId);
  }
});


export const toggleFavorite = mutation({
  args: { fileId: v.id("files") },
  async handler(ctx, args) {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new ConvexError("You do not have access to this organization")
    }

    const file = await ctx.db.get(args.fileId);

    if (!file) {
      throw new ConvexError("this File does not exist");
    }

    //TODO delete or no
    if (!file.orgId) {
      throw new ConvexError("File does not have an organization ID");
    }

    const hasAccess = await hasAccessToOrg(
      ctx, 
      identity.tokenIdentifier, 
      file.orgId);

    if (!hasAccess) {
      throw new ConvexError("You do not have access to delete this file")
    }

   const user = await ctx.db
   .query("users")
   .withIndex("by_tokenIdentifier", 
    q => q.eq("tokenIdentifier", identity.tokenIdentifier)
   )
   .first();

 /*    const favorites = await ctx.db.query("favorites")
    .withIndex("by_userId_orgId_fileId", q => {
      return q
      q.eq("orgId", file.orgId)
      .eq("fileId", file._id)
      .eq("userId", identity.userId)
    }) */

  }
});