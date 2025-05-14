import { db } from '@/db';
import { videos } from '@/db/schema';
import { protectedProcedure, createTRPCRouter } from '@/trpc/init';
import { mux } from '@/lib/mux';

export const videosRouter = createTRPCRouter({
  create: protectedProcedure.mutation(async ({ ctx }) => {
    const { id: userId } = ctx.user;

    const directUpload = await mux.video.uploads.create({
      cors_origin: '*',
      new_asset_settings: {
        passthrough: userId,
        playback_policy: ['public'],
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
});
