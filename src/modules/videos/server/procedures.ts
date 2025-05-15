import { db } from '@/db';
import { videos, videoUpdateSchema } from '@/db/schema';
import { protectedProcedure, createTRPCRouter } from '@/trpc/init';
import { mux } from '@/lib/mux';
import { and, eq } from 'drizzle-orm';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';

export const videosRouter = createTRPCRouter({
  create: protectedProcedure.mutation(async ({ ctx }) => {
    const { id: userId } = ctx.user;

    const directUpload = await mux.video.uploads.create({
      cors_origin: '*',
      new_asset_settings: {
        passthrough: userId,
        playback_policy: ['public'],
        inputs: [
          {
            generated_subtitles: [
              {
                language_code: 'en',
                name: 'English',
              },
            ],
          },
        ],
      },
    });
    const [video] = await db
      .insert(videos)
      .values({
        userId,
        title: 'Untitledss',
        muxStatus: 'waiting',
        muxUploadId: directUpload.id,
      })
      .returning();

    return {
      video: video,
      url: directUpload.url,
    };
  }),

  update: protectedProcedure
    .input(videoUpdateSchema)
    .mutation(async ({ ctx, input }) => {
      const { id: userId } = ctx.user;

      if (!input.id) {
        throw new TRPCError({ code: 'BAD_REQUEST' });
      }
      const [updatedVideo] = await db
        .update(videos)
        .set({
          title: input.title,
          description: input.description,
          categoryId: input.categoryId,
          visibility: input.visibility,
          updatedAt: new Date(),
        })
        .where(and(eq(videos.id, input.id), eq(videos.userId, userId)))
        .returning();

      if (!updatedVideo) {
        throw new TRPCError({ code: 'NOT_FOUND' });
      }
    }),

  remove: protectedProcedure
    .input(
      z.object({
        id: z.string().uuid(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id: userId } = ctx.user;

      if (!input.id) {
        throw new TRPCError({ code: 'BAD_REQUEST' });
      }
      const [removedVideo] = await db
        .delete(videos)
        .where(and(eq(videos.id, input.id), eq(videos.userId, userId)))
        .returning();

      if (!removedVideo) {
        throw new TRPCError({ code: 'NOT_FOUND' });
      }
    }),
});
