import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { posts } from "@/server/db/schema";
import { eq } from "drizzle-orm";

export const postsRouter = createTRPCRouter({
  create: publicProcedure
    .input(z.object({ name: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(posts).values({
        name: input.name,
      });
    }),

  delete: publicProcedure
    .input(z.object({ postId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const res = await ctx.db.delete(posts).where(eq(posts.id, input.postId));
      return res.rowsAffected > 0;
    }),

  getAll: publicProcedure.query(async ({ctx}) => {
    const posts = await ctx.db.query.posts.findMany({orderBy: (x, {desc}) => desc(x.createdAt)});
    return posts;
  }),
});
