import { Header } from '@/components/layout/Header';
import { BrowseView } from '@/components/browse/BrowseView';

const Browse = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <BrowseView />
    </div>
  );
};

export default Browse;
