import { z } from 'zod';
import { and, eq, getTableColumns } from 'drizzle-orm';

import { db } from '@/db';
import { TRPCError } from '@trpc/server';
import { comments, users } from '@/db/schema';
import {
  baseProcedure,
  createTRPCRouter,
  protectedProcedure,
} from '@/trpc/init';

export const commentsRouter = createTRPCRouter({
  remove: protectedProcedure
    .input(
      z.object({
        id: z.string().uuid(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { id } = input;
      const { id: userId } = ctx.user;

      const [deletedComment] = await db
        .delete(comments)
        .where(and(eq(comments.id, id), eq(comments.userId, userId)))
        .returning();

      if (!deletedComment) {
        throw new TRPCError({ code: 'NOT_FOUND' });
      }

      return deletedComment;
    }),
  create: protectedProcedure
    .input(
      z.object({
        videoId: z.string().uuid(),
        value: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { videoId, value } = input;
      const { id: userId } = ctx.user;

      // const [existingComment] = await db
      //   .select()
      //   .from(comments)
      //   .where(inArray(comments.userId, userId ? [userId] : []));

      // if (!existingComment && userId) {
      //   throw new TRPCError({ code: 'NOT_FOUND' });
      // }

      // if (existingComment?.userId && userId) {
      //   throw new TRPCError({ code: 'BAD_REQUEST' });
      // }

      const [createdComment] = await db
        .insert(comments)
        .values({ userId, videoId, value })
        .returning();

      return createdComment;
    }),

  getMany: baseProcedure
    .input(
      z.object({
        videoId: z.string().uuid(),
      })
    )
    .query(async ({ input }) => {
      const { videoId } = input;
      const data = await db
        .select({
          ...getTableColumns(comments),
          user: users,
        })
        .from(comments)
        .where(eq(comments.videoId, videoId))
        .innerJoin(users, eq(comments.userId, users.id));

      return data;
    }),
});
