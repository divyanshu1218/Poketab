import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Upload, Scan, X, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePokemonSearch } from '@/hooks/usePokemon';
import { Pokemon } from '@/services/pokemonService';
import { PokemonCard } from '@/components/pokemon/PokemonCard';
import { PokemonDetail } from '@/components/pokemon/PokemonDetail';

// Mock AI detection - in production this would use TensorFlow.js
const mockDetectPokemon = (): string => {
  const pokemonNames = [
    'pikachu', 'charizard', 'bulbasaur', 'squirtle', 'eevee',
    'mewtwo', 'gengar', 'dragonite', 'snorlax', 'lucario',
    'greninja', 'garchomp', 'blaziken', 'umbreon', 'rayquaza'
  ];
  return pokemonNames[Math.floor(Math.random() * pokemonNames.length)];
};

export const ScannerView = () => {
  const [mode, setMode] = useState<'camera' | 'upload'>('camera');
  const [isScanning, setIsScanning] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [detectedPokemon, setDetectedPokemon] = useState<string>('');
  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: searchResults, isLoading, error } = usePokemonSearch(detectedPokemon);

  const handleScan = useCallback(async () => {
    setIsScanning(true);
    setDetectedPokemon('');
    
    // Simulate AI detection delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const detected = mockDetectPokemon();
    setDetectedPokemon(detected);
    setIsScanning(false);
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result as string);
        setDetectedPokemon('');
      };
      reader.readAsDataURL(file);
    }
  };

  const clearUpload = () => {
    setUploadedImage(null);
    setDetectedPokemon('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
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
            Point your camera at a Pokémon or upload an image to identify it instantly with AI
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
            onClick={() => setMode('camera')}
            className="gap-2"
          >
            <Camera className="w-4 h-4" />
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
              {mode === 'camera' ? (
                <motion.div
                  key="camera"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <div className="text-center">
                    <Camera className="w-16 h-16 text-muted-foreground mb-4 mx-auto" />
                    <p className="text-muted-foreground">Camera preview would appear here</p>
                    <p className="text-xs text-muted-foreground/60 mt-2">
                      (Camera access requires HTTPS in production)
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
                    <p className="text-primary font-semibold">Analyzing...</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Scanner corners */}
            <div className="absolute top-4 left-4 w-12 h-12 border-l-2 border-t-2 border-primary rounded-tl-lg" />
            <div className="absolute top-4 right-4 w-12 h-12 border-r-2 border-t-2 border-primary rounded-tr-lg" />
            <div className="absolute bottom-4 left-4 w-12 h-12 border-l-2 border-b-2 border-primary rounded-bl-lg" />
            <div className="absolute bottom-4 right-4 w-12 h-12 border-r-2 border-b-2 border-primary rounded-br-lg" />
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
              disabled={isScanning || (mode === 'upload' && !uploadedImage)}
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

        {/* Results */}
        <AnimatePresence mode="wait">
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex justify-center py-12"
            >
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </motion.div>
          )}

          {error && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="glass-card p-6 text-center text-destructive"
            >
              <AlertCircle className="w-8 h-8 mx-auto mb-2" />
              <p>Pokémon not found. Try scanning again!</p>
            </motion.div>
          )}

          {searchResults && searchResults.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <h2 className="text-2xl font-bold mb-6 text-center">
                <span className="text-primary">Detected:</span>{' '}
                <span className="capitalize">{detectedPokemon}</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {searchResults.map((pokemon, i) => (
                  <PokemonCard
                    key={pokemon.id}
                    pokemon={pokemon}
                    onClick={() => setSelectedPokemon(pokemon)}
                    delay={i}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Detail Modal */}
      <PokemonDetail 
        pokemon={selectedPokemon} 
        onClose={() => setSelectedPokemon(null)} 
      />
    </div>
  );
};
