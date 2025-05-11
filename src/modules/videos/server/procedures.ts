import { db } from '@/db';
import { videos } from '@/db/schema';
import { protectedProcedure, createTRPCRouter } from '@/trpc/init';

export const videosRouter = createTRPCRouter({
  create: protectedProcedure.mutation(async ({ ctx }) => {
    const { id: userId } = ctx.user;
    const [video] = await db
      .insert(videos)
      .values({
        userId,
        title: 'Untitled',
      })
      .returning();

    return {
      video: video,
    };
  }),
});
