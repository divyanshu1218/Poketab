import { motion, AnimatePresence } from 'framer-motion';
import { X, Weight, Ruler, Sparkles, Zap } from 'lucide-react';
import { Pokemon, getTypeColor, formatPokemonId } from '@/services/pokemonService';
import { PokemonStats } from './PokemonStats';
import { EvolutionChain } from './EvolutionChain';
import { Button } from '@/components/ui/button';

interface PokemonDetailProps {
  pokemon: Pokemon | null;
  onClose: () => void;
  onAddToCollection?: () => void;
  isAdding?: boolean;
  isAdded?: boolean;
}

export const PokemonDetail = ({ pokemon, onClose, onAddToCollection, isAdding = false, isAdded = false }: PokemonDetailProps) => {
  if (!pokemon) return null;

  const mainType = pokemon.types[0]?.type.name || 'normal';
  const typeColor = getTypeColor(mainType);
  const imageUrl = pokemon.sprites.other['official-artwork'].front_default ||
    pokemon.sprites.front_default;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 25 }}
          onClick={(e) => e.stopPropagation()}
          className="glass-card w-full max-w-2xl max-h-[90vh] overflow-y-scroll relative custom-scrollbar"
          style={{ overflowY: 'scroll', WebkitOverflowScrolling: 'touch' }}
        >
          {/* Background gradient */}
          <div
            className="absolute inset-0 opacity-30 blur-3xl"
            style={{ background: `radial-gradient(circle at 30% 20%, ${typeColor}, transparent 60%)` }}
          />

          {/* Close button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="absolute top-4 right-4 z-10"
          >
            <X className="w-5 h-5" />
          </Button>

          <div className="relative p-6 md:p-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row gap-6 mb-8">
              {/* Image */}
              <div className="relative flex-shrink-0 mx-auto md:mx-0">
                <div
                  className="absolute inset-0 rounded-full blur-3xl opacity-50"
                  style={{ backgroundColor: typeColor }}
                />
                <motion.img
                  src={imageUrl}
                  alt={pokemon.name}
                  className="relative w-48 h-48 md:w-56 md:h-56 object-contain drop-shadow-2xl"
                  initial={{ scale: 0, rotate: -10 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', damping: 15, delay: 0.1 }}
                />
              </div>

              {/* Info */}
              <div className="flex-1 text-center md:text-left">
                <motion.p
                  className="font-mono text-sm text-muted-foreground mb-1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  {formatPokemonId(pokemon.id)}
                </motion.p>

                <motion.h2
                  className="text-3xl md:text-4xl font-bold capitalize mb-4"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 }}
                >
                  {pokemon.name}
                </motion.h2>

                {/* Types */}
                <motion.div
                  className="flex gap-2 justify-center md:justify-start mb-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.25 }}
                >
                  {pokemon.types.map((t) => (
                    <span
                      key={t.type.name}
                      className="px-4 py-1.5 rounded-full text-sm font-semibold text-white uppercase tracking-wider shadow-lg"
                      style={{
                        backgroundColor: getTypeColor(t.type.name),
                        boxShadow: `0 4px 20px ${getTypeColor(t.type.name)}40`
                      }}
                    >
                      {t.type.name}
                    </span>
                  ))}
                </motion.div>

                {/* Physical stats */}
                <motion.div
                  className="flex gap-6 justify-center md:justify-start"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="flex items-center gap-2">
                    <Ruler className="w-4 h-4 text-primary" />
                    <span className="text-muted-foreground">Height:</span>
                    <span className="font-mono font-bold">{(pokemon.height / 10).toFixed(1)}m</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Weight className="w-4 h-4 text-primary" />
                    <span className="text-muted-foreground">Weight:</span>
                    <span className="font-mono font-bold">{(pokemon.weight / 10).toFixed(1)}kg</span>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="mb-8"
            >
              <PokemonStats pokemon={pokemon} />
            </motion.div>

            {/* Abilities */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h3 className="text-lg font-bold text-primary flex items-center gap-2 mb-4">
                <Sparkles className="w-4 h-4" />
                Abilities
              </h3>
              <div className="flex flex-wrap gap-2">
                {pokemon.abilities.map((a) => (
                  <span
                    key={a.ability.name}
                    className={`px-4 py-2 rounded-lg font-medium capitalize ${a.is_hidden
                      ? 'bg-poketab-purple/20 text-poketab-purple border border-poketab-purple/30'
                      : 'bg-secondary text-foreground'
                      }`}
                  >
                    {a.ability.name.replace('-', ' ')}
                    {a.is_hidden && (
                      <span className="ml-2 text-xs opacity-70">(Hidden)</span>
                    )}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* Evolution Chain */}
            {pokemon.species_url && (
              <EvolutionChain speciesUrl={pokemon.species_url} />
            )}

            {/* Sprite Gallery */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.42 }}
              className="mb-8"
            >
              <h3 className="text-lg font-bold text-primary flex items-center gap-2 mb-4">
                <Sparkles className="w-4 h-4" />
                Sprite Gallery
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {/* Front Default */}
                {pokemon.sprites.front_default && (
                  <div className="glass-card p-3 text-center">
                    <img
                      src={pokemon.sprites.front_default}
                      alt="Front"
                      className="w-24 h-24 mx-auto object-contain"
                    />
                    <p className="text-xs text-muted-foreground mt-2">Normal</p>
                  </div>
                )}

                {/* Front Shiny */}
                {pokemon.sprites.front_shiny && (
                  <div className="glass-card p-3 text-center border border-yellow-500/30">
                    <img
                      src={pokemon.sprites.front_shiny}
                      alt="Shiny"
                      className="w-24 h-24 mx-auto object-contain"
                    />
                    <p className="text-xs text-yellow-500 mt-2">✨ Shiny</p>
                  </div>
                )}

                {/* Official Artwork */}
                {pokemon.sprites.other?.['official-artwork']?.front_default && (
                  <div className="glass-card p-3 text-center">
                    <img
                      src={pokemon.sprites.other['official-artwork'].front_default}
                      alt="Official Art"
                      className="w-24 h-24 mx-auto object-contain"
                    />
                    <p className="text-xs text-muted-foreground mt-2">Official Art</p>
                  </div>
                )}

                {/* Shiny Official Artwork */}
                {pokemon.sprites.other?.['official-artwork']?.front_shiny && (
                  <div className="glass-card p-3 text-center border border-yellow-500/30">
                    <img
                      src={pokemon.sprites.other['official-artwork'].front_shiny}
                      alt="Shiny Official Art"
                      className="w-24 h-24 mx-auto object-contain"
                    />
                    <p className="text-xs text-yellow-500 mt-2">✨ Shiny Art</p>
                  </div>
                )}

                {/* Dream World */}
                {pokemon.sprites.other?.dream_world?.front_default && (
                  <div className="glass-card p-3 text-center">
                    <img
                      src={pokemon.sprites.other.dream_world.front_default}
                      alt="Dream World"
                      className="w-24 h-24 mx-auto object-contain"
                    />
                    <p className="text-xs text-muted-foreground mt-2">Dream World</p>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Catch button */}
            {onAddToCollection && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45 }}
                className="mt-8 pt-6 border-t border-border"
              >
                <Button
                  variant={isAdded ? 'outline' : 'hero'}
                  size="lg"
                  className="w-full gap-2"
                  onClick={onAddToCollection}
                  disabled={isAdding || isAdded}
                >
                  {isAdded ? (
                    <>
                      <Zap className="w-5 h-5" />
                      Added to Collection
                    </>
                  ) : isAdding ? (
                    <>
                      <Zap className="w-5 h-5 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    <>
                      <Zap className="w-5 h-5" />
                      Add to Collection
                    </>
                  )}
                </Button>
              </motion.div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
