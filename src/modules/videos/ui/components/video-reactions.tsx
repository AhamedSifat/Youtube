/* eslint-disable @typescript-eslint/no-unused-vars */
import { ThumbsDownIcon, ThumbsUpIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { VideoGetOneOutput } from '../../type';
import { useClerk } from '@clerk/nextjs';
import { trpc } from '@/trpc/client';

interface VideoReactionsProps {
  videoId: string;
  likes: number;
  dislikes: number;
  viewerReaction: VideoGetOneOutput['viewerRection'];
}

export const VideoReactions = ({
  videoId,
  likes,
  dislikes,
  viewerReaction,
}: VideoReactionsProps) => {
  const clerk = useClerk();
  const utils = trpc.useUtils();
  const like = trpc.videoReactions.like.useMutation({
    onSuccess: () => {
      utils.videos.getOne.invalidate({ id: videoId });
    },
    onError: (error) => {
      if (error.data?.code === 'UNAUTHORIZED') {
        clerk.openSignIn();
      }
    },
  });
  const dislike = trpc.videoReactions.disLike.useMutation({
    onSuccess: () => {
      utils.videos.getOne.invalidate({ id: videoId });
    },
    onError: (error) => {
      if (error.data?.code === 'UNAUTHORIZED') {
        clerk.openSignIn();
      }
    },
  });

  return (
    <div className='flex items-center flex-none'>
      <Button
        onClick={() => like.mutate({ videoId })}
        disabled={like.isPending || dislike.isPending}
        variant='secondary'
        className='rounded-l-full rounded-r-none gap-2 pr-4'
      >
        <ThumbsUpIcon
          className={cn('size-5', viewerReaction === 'like' && 'fill-black')}
        />
        {likes}
      </Button>
      <Separator orientation='vertical' className='h-7' />
      <Button
        onClick={() => dislike.mutate({ videoId })}
        disabled={like.isPending || dislike.isPending}
        variant='secondary'
        className='rounded-l-none rounded-r-full pl-3'
      >
        <ThumbsDownIcon
          className={cn('size-5', viewerReaction === 'dislike' && 'fill-black')}
        />
        {dislikes}
      </Button>
    </div>
  );
};
