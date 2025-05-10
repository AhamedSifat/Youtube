import { categoiresRouter } from '@/modules/categoires/server/procedures';
import { createTRPCRouter } from '../init';
export const appRouter = createTRPCRouter({
  categories: categoiresRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;
