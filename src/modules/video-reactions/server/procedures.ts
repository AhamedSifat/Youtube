import { db } from '@/db';
import { videoReactions } from '@/db/schema';
import { createTRPCRouter, protectedProcedure } from '@/trpc/init';
import { and, eq } from 'drizzle-orm';
import { z } from 'zod';

export const videoReactionsRouter = createTRPCRouter({
  like: protectedProcedure
    .input(
      z.object({
        videoId: z.string().uuid(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { videoId } = input;
      const { id: userId } = ctx.user;

      const [existingVideoRectionLike] = await db
        .select()
        .from(videoReactions)
        .where(
          and(
            eq(videoReactions.videoId, videoId),
            eq(videoReactions.userId, userId),
            eq(videoReactions.type, 'like')
          )
        );

      if (existingVideoRectionLike) {
        const [deletedvideoReactions] = await db
          .delete(videoReactions)
          .where(
            and(
              eq(videoReactions.videoId, videoId),
              eq(videoReactions.userId, userId)
            )
          )
          .returning();

        return deletedvideoReactions;
      }

      const [createdVideoRection] = await db
        .insert(videoReactions)
        .values({
          userId,
          videoId,
          type: 'like',
        })
        .onConflictDoUpdate({
          target: [videoReactions.userId, videoReactions.videoId],
          set: {
            type: 'like',
          },
        })
        .returning();

      return createdVideoRection;
    }),

  disLike: protectedProcedure
    .input(
      z.object({
        videoId: z.string().uuid(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { videoId } = input;
      const { id: userId } = ctx.user;

      const [existingVideoRectionDisLike] = await db
        .select()
        .from(videoReactions)
        .where(
          and(
            eq(videoReactions.videoId, videoId),
            eq(videoReactions.userId, userId),
            eq(videoReactions.type, 'dislike')
          )
        );

      if (existingVideoRectionDisLike) {
        const [deletedvideoReactions] = await db
          .delete(videoReactions)
          .where(
            and(
              eq(videoReactions.videoId, videoId),
              eq(videoReactions.userId, userId)
            )
          )
          .returning();

        return deletedvideoReactions;
      }

      const [createdVideoRection] = await db
        .insert(videoReactions)
        .values({
          userId,
          videoId,
          type: 'dislike',
        })
        .onConflictDoUpdate({
          target: [videoReactions.userId, videoReactions.videoId],
          set: {
            type: 'dislike',
          },
        })
        .returning();

      return createdVideoRection;
    }),
});
