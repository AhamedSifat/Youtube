import { VideoView } from '@/modules/videos/ui/views/video-view';
import { trpc } from '@/trpc/server';
import { HydrateClient } from '@/trpc/server';

interface VideoPageProps {
  params: Promise<{
    videoId: string;
  }>;
}

const VideoPage = async ({ params }: VideoPageProps) => {
  const { videoId } = await params;
  if (!videoId) {
    throw new Error('Video ID is required');
  }

  void trpc.videos.getOne.prefetch({ id: videoId });

  return (
    <HydrateClient>
      <VideoView videoId={videoId} />
    </HydrateClient>
  );
};

export default VideoPage;
