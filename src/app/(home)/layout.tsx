import { HomeLayout } from '@/modules/home/ui/layouts/home-layout';
import { NuqsAdapter } from 'nuqs/adapters/next/app';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <HomeLayout>
      <NuqsAdapter>{children}</NuqsAdapter>
    </HomeLayout>
  );
};

export default Layout;
