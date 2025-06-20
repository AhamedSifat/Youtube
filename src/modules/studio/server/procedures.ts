import { db } from '@/db';
import { videos } from '@/db/schema';
import { protectedProcedure, createTRPCRouter } from '@/trpc/init';
import { TRPCError } from '@trpc/server';
import { eq, and, or, lt, desc } from 'drizzle-orm';
import { z } from 'zod';

export const studioRouter = createTRPCRouter({
  getMany: protectedProcedure
    .input(
      z.object({
        cursor: z
          .object({
            id: z.string().uuid(),
            updatedAt: z.date(),
          })
          .nullish(),
        limit: z.number().min(1).max(100),
      })
    )
    .query(async ({ ctx, input }) => {
      const { cursor, limit } = input;
      const { id: userId } = ctx.user;

      const data = await db
        .select()
        .from(videos)
        .where(
          and(
            eq(videos.userId, userId),
            cursor
              ? or(
                  lt(videos.updatedAt, cursor.updatedAt),
                  and(
                    eq(videos.updatedAt, cursor.updatedAt),
                    lt(videos.id, cursor.id)
                  )
                )
              : undefined
          )
        )
        .orderBy(desc(videos.updatedAt), desc(videos.id))
        .limit(limit + 1);

      const hasNextPage = data.length > limit;
      const items = hasNextPage ? data.slice(0, -1) : data;

      const nextCursor = hasNextPage
        ? {
            id: items[items.length - 1].id,
            updatedAt: items[items.length - 1].updatedAt,
          }
        : null;

      return {
        items,
        nextCursor,
      };
    }),

  getOne: protectedProcedure
    .input(
      z.object({
        id: z.string().uuid(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { id: userId } = ctx.user;
      const { id } = input;

      const [video] = await db
        .select()
        .from(videos)
        .where(and(eq(videos.id, id), eq(videos.userId, userId)));

      if (!video) {
        throw new TRPCError({ code: 'NOT_FOUND' });
      }

      return video;
    }),
});
