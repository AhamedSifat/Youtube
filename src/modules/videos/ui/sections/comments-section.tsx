'use client';

interface CommentsSectionProps {
  videoId: string;
}

import { CommentForm } from '@/modules/comments/ui/components/comment-form';
import { CommentItem } from '@/modules/comments/ui/components/comment-item';
import { trpc } from '@/trpc/client';
import { Loader2Icon } from 'lucide-react';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

export const CommentsSection = ({ videoId }: CommentsSectionProps) => {
  return (
    <Suspense fallback={<CommentsSectionSkeleton />}>
      <ErrorBoundary fallback={<p>Error...</p>}>
        <CommentsSectionSuspense videoId={videoId} />
      </ErrorBoundary>
    </Suspense>
  );
};

export const CommentsSectionSkeleton = () => {
  return (
    <div className='mt-6 flex justify-center items-center'>
      <Loader2Icon className='text-muted-foreground size-7 animate-spin' />
    </div>
  );
};

const CommentsSectionSuspense = ({ videoId }: CommentsSectionProps) => {
  const [comments] = trpc.comments.getMany.useSuspenseQuery({ videoId });

  return (
    <div className='mt-6'>
      <div className='flex flex-col gap-6'>
        <h1 className='text-xl font-bold'>0 Comments</h1>
        <CommentForm videoId={videoId} />
        <div className='flex flex-col  gap-4 mt-2'>
          {comments.map((comment) => (
            <CommentItem key={comment.id} comment={comment} />
          ))}
        </div>
      </div>
    </div>
  );
};
