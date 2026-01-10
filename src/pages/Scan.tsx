import { Header } from '@/components/layout/Header';
import { ScannerView } from '@/components/scanner/ScannerView';

const Scan = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <ScannerView />
    </div>
  );
};

export default Scan;
