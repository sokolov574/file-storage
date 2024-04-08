import { ConvexError, v } from "convex/values";
import { MutationCtx, QueryCtx, mutation, query } from "./_generated/server";
import { getUser } from "./users";
import { fileTypes } from "./schema";
import { Id } from "./_generated/dataModel";

export const generateUploadUrl = mutation(async (ctx) => {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw new ConvexError("You must be signed in to create a file")
  }

  return await ctx.storage.generateUploadUrl();
});

async function hasAccessToOrg(
  ctx: QueryCtx | MutationCtx, 
  orgId: string) {

    const identity = await ctx.auth.getUserIdentity();
      
      if (!identity) {
        return null;
      }

    const user = await ctx.db
    .query("users")
    .withIndex("by_tokenIdentifier", 
     (q) => q.eq("tokenIdentifier", identity.tokenIdentifier)
    )
    .first();

    if(!user) {
      return null; 
    }

    
  const hasAccess = 
   user.orgIds.some((item) => item.orgId === orgId) ||
   user.tokenIdentifier.includes(orgId);

   if(!hasAccess) {
    return null
   }

  return { user };

}

export const createFile = mutation({
    args: {
      name: v.string(),
      fileId: v.id("_storage"),
      orgId: v.string(),
      type: fileTypes,
    },
    async handler (ctx, args) {
      const hasAccess = await hasAccessToOrg(
        ctx, args.orgId);

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
        query: v.optional(v.string()),
        favorites: v.optional(v.boolean()),
        deletedOnly: v.optional(v.boolean()),

    },
    async handler(ctx, args) {
        const hasAccess = await hasAccessToOrg(
          ctx,  
          args.orgId);


          if (!hasAccess) {
            return [];
          }

          let files = await ctx.db
            .query("files")
            .withIndex("by_orgId", q => q.eq("orgId", args.orgId))
            .collect();

          const query = args.query;

          if (query) {
            files = files.filter(file => 
              file.name.toLowerCase().includes(query.toLowerCase())
              );
          }

          if (args.favorites) {

            const favorites = await ctx.db.query("favorites")
            .withIndex("by_userId_orgId_fileId", (q) => 
            q.eq("userId", hasAccess.user._id).eq("orgId", args.orgId)
            )
            .collect();

            files = files.filter(file => 
              favorites.some((favorite) => favorite.fileId === file._id)
              );
          }


          if (args.deletedOnly) {
            files = files.filter(file => file.shouldDelete);
          }

          return files;
        }
    });

export const deleteFile = mutation({
  args: { fileId: v.id("files") },
  async handler(ctx, args) {
    const access = await hasAccessToFile(ctx, args.fileId);
    if (!access) {
      throw new ConvexError("You do not have access to this file")
    }

    const isAdmin = access.user.orgIds.find(org => org.orgId === access.file.orgId)
    ?.role === "admin";

    if (!isAdmin) {
      throw new ConvexError("You do not have admin access to delete this file")
    }

    await ctx.db.delete(args.fileId);
    await ctx.db.patch(args.fileId, { 
      shouldDelete: true,
     });
  }
});

export const toggleFavorite = mutation({
  args: { fileId: v.id("files") },
  async handler(ctx, args) {
    /* const identity = await ctx.auth.getUserIdentity(); */
    const access = await hasAccessToFile(ctx, args.fileId);

    if (!access) {
      throw new ConvexError("You do not have access to this file")
    }

    const favorite = await ctx.db
    .query("favorites")
    .withIndex("by_userId_orgId_fileId", (q) => 
    q.eq('userId', access.user._id).eq('orgId', access.file.orgId).eq('fileId', access.file._id)
    )
    .first();

    if (!favorite) {
      await ctx.db.insert("favorites", {
        fileId: access.file._id,
        userId: access.user._id,
        orgId: access.file.orgId,
      });
    } else {
      await ctx.db.delete(favorite._id);
    }
  }
});

export const getAllFavorites = query({
  args: { orgId: v.string() },
  async handler(ctx, args) {

    const hasAccess = await hasAccessToOrg(
      ctx,
      args.orgId);

    if (!hasAccess) {
      return [];
    }

    const favorites = await ctx.db
    .query("favorites")
    .withIndex("by_userId_orgId_fileId", (q) => 
    q.eq('userId', hasAccess.user._id).eq('orgId', args.orgId)
    )
    .collect();

    return favorites;
  }
});

async function hasAccessToFile(
  ctx: QueryCtx | MutationCtx, 
  fileId: Id<"files">
) {
    const file = await ctx.db.get(fileId);

    if (!file) {
      return null;
    }

    const hasAccess = await hasAccessToOrg(
      ctx, 
      file.orgId);

    if (!hasAccess) {
      return null;
    }

  return { user: hasAccess.user, file };
}