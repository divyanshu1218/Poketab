import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera as CameraIcon, Upload, Scan, X, Loader2, AlertCircle, Plus, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { scanService } from '@/services/scanService';
import { collectionService } from '@/services/collectionService';
import { Pokemon } from '@/services/pokemonService';
import { PokemonCard } from '@/components/pokemon/PokemonCard';
import { PokemonDetail } from '@/components/pokemon/PokemonDetail';
import { Camera } from '@/components/camera/Camera';
import { ScannerEffects } from './ScannerEffects';
import { useToast } from '@/hooks/use-toast';

export const ScannerView = () => {
  const [mode, setMode] = useState<'camera' | 'upload'>('upload');
  const [showCamera, setShowCamera] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [scannedPokemon, setScannedPokemon] = useState<Pokemon | null>(null);
  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleScan = useCallback(async () => {
    if (!uploadedFile) {
      toast({
        title: 'No image',
        description: 'Please upload an image first',
        variant: 'destructive',
      });
      return;
    }

    setIsScanning(true);
    setScannedPokemon(null);
    setIsAdded(false);

    try {
      const result = await scanService.scanImage(uploadedFile);
      setScannedPokemon(result);
      toast({
        title: 'Success!',
        description: `Identified ${result.name}!`,
      });
    } catch (error: any) {
      const message = error.response?.data?.detail || 'Failed to identify Pokémon';
      toast({
        title: 'Scan failed',
        description: message,
        variant: 'destructive',
      });
    } finally {
      setIsScanning(false);
    }
  }, [uploadedFile, toast]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result as string);
        setScannedPokemon(null);
        setIsAdded(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCameraCapture = (file: File) => {
    setUploadedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setUploadedImage(reader.result as string);
      setScannedPokemon(null);
      setIsAdded(false);
    };
    reader.readAsDataURL(file);
    setShowCamera(false);
  };

  const clearUpload = () => {
    setUploadedImage(null);
    setUploadedFile(null);
    setScannedPokemon(null);
    setIsAdded(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleAddToCollection = async () => {
    if (!scannedPokemon) return;

    setIsAdding(true);
    try {
      await collectionService.addToCollection({
        pokemon_name: scannedPokemon.name,
        pokemon_id: scannedPokemon.id,
        pokemon_data: scannedPokemon,
      });
      setIsAdded(true);
      toast({
        title: 'Added to collection!',
        description: `${scannedPokemon.name} has been added to your collection`,
      });
    } catch (error: any) {
      const message = error.response?.data?.detail || 'Failed to add to collection';
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      });
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="min-h-screen gradient-bg pt-32 pb-16 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-primary neon-text">Pokémon</span> Scanner
          </h1>
          <p className="text-muted-foreground text-lg max-w-lg mx-auto">
            Use your camera or upload an image to identify Pokémon instantly with AI
          </p>
        </motion.div>

        {/* Mode Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex justify-center gap-4 mb-8"
        >
          <Button
            variant={mode === 'camera' ? 'default' : 'outline'}
            onClick={() => {
              setMode('camera');
              setShowCamera(true);
            }}
            className="gap-2"
          >
            <CameraIcon className="w-4 h-4" />
            Camera
          </Button>
          <Button
            variant={mode === 'upload' ? 'default' : 'outline'}
            onClick={() => setMode('upload')}
            className="gap-2"
          >
            <Upload className="w-4 h-4" />
            Upload
          </Button>
        </motion.div>

        {/* Scanner Area */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-6 md:p-8 mb-8"
        >
          <div className="relative aspect-video rounded-xl overflow-hidden bg-muted/30 border-2 border-primary/20 scan-line">
            <AnimatePresence mode="wait">
              {mode === 'camera' && !uploadedImage ? (
                <motion.div
                  key="camera"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <div className="text-center">
                    <CameraIcon className="w-16 h-16 text-muted-foreground mb-4 mx-auto" />
                    <p className="text-muted-foreground">Click "Camera" to start</p>
                    <p className="text-xs text-muted-foreground/60 mt-2">
                      Camera will open in fullscreen
                    </p>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="upload"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  {uploadedImage ? (
                    <div className="relative w-full h-full">
                      <img
                        src={uploadedImage}
                        alt="Uploaded"
                        className="w-full h-full object-contain"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={clearUpload}
                        className="absolute top-4 right-4 bg-background/50 backdrop-blur-sm"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <div
                      className="text-center cursor-pointer hover:bg-muted/20 p-8 rounded-xl transition-colors"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Upload className="w-16 h-16 text-muted-foreground mb-4 mx-auto" />
                      <p className="text-muted-foreground">Click to upload an image</p>
                      <p className="text-xs text-muted-foreground/60 mt-2">
                        Supports JPG, PNG, WebP
                      </p>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Scanning overlay */}
            <AnimatePresence>
              {isScanning && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-background/70 backdrop-blur-sm flex items-center justify-center"
                >
                  <div className="text-center">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                    >
                      <Loader2 className="w-12 h-12 text-primary mx-auto mb-4" />
                    </motion.div>
                    <p className="text-primary font-semibold">Analyzing with AI...</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Scanner Effects */}
            <ScannerEffects
              isScanning={isScanning}
              onDetection={!!scannedPokemon}
            />
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />

          {/* Scan Button */}
          <div className="flex justify-center mt-6">
            <Button
              variant="hero"
              size="xl"
              onClick={handleScan}
              disabled={isScanning || !uploadedFile}
              className="gap-3"
            >
              {isScanning ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Scanning...
                </>
              ) : (
                <>
                  <Scan className="w-5 h-5" />
                  Scan for Pokémon
                </>
              )}
            </Button>
          </div>
        </motion.div>

        {/* Results - Now shown in modal popup */}
      </div>

      {/* Scan Result Modal */}
      <PokemonDetail
        pokemon={scannedPokemon}
        onClose={() => {
          setScannedPokemon(null);
          setIsAdded(false);
          clearUpload(); // Reset scanner for next scan
        }}
        onAddToCollection={handleAddToCollection}
        isAdding={isAdding}
        isAdded={isAdded}
      />

      {/* Camera Modal */}
      {showCamera && (
        <Camera
          onCapture={handleCameraCapture}
          onClose={() => setShowCamera(false)}
        />
      )}
    </div>
  );
};
