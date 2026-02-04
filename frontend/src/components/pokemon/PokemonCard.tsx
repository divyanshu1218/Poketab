import { motion } from 'framer-motion';
import { Check, Plus } from 'lucide-react';
import { Pokemon, getTypeColor, formatPokemonId } from '@/services/pokemonService';
import { Button } from '@/components/ui/button';

interface PokemonCardProps {
  pokemon: Pokemon;
  onClick?: () => void;
  delay?: number;
  onAddToCollection?: () => void;
  isAdding?: boolean;
  isAdded?: boolean;
}

export const PokemonCard = ({
  pokemon,
  onClick,
  delay = 0,
  onAddToCollection,
  isAdding = false,
  isAdded = false,
}: PokemonCardProps) => {
  const mainType = pokemon.types[0]?.type.name || 'normal';
  const typeColor = getTypeColor(mainType);
  
  const imageUrl = pokemon.sprites.other['official-artwork'].front_default || 
                   pokemon.sprites.front_default;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay * 0.1, duration: 0.4 }}
      whileHover={{ y: -8, scale: 1.02 }}
      onClick={onClick}
      className="glass-card p-4 cursor-pointer group relative overflow-hidden"
    >
      {/* Background glow */}
      <div 
        className="absolute inset-0 opacity-20 group-hover:opacity-40 transition-opacity blur-3xl"
        style={{ background: `radial-gradient(circle at center, ${typeColor}, transparent 70%)` }}
      />
      
      {/* Pokemon ID */}
      <div className="relative flex justify-between items-start mb-2">
        <span className="font-mono text-xs text-muted-foreground">
          {formatPokemonId(pokemon.id)}
        </span>
        <div className="flex gap-1">
          {pokemon.types.map((t) => (
            <span
              key={t.type.name}
              className="text-[10px] font-semibold px-2 py-0.5 rounded-full text-white uppercase tracking-wider"
              style={{ backgroundColor: getTypeColor(t.type.name) }}
            >
              {t.type.name}
            </span>
          ))}
        </div>
      </div>

      {/* Pokemon Image */}
      <div className="relative aspect-square flex items-center justify-center mb-3">
        <motion.img
          src={imageUrl}
          alt={pokemon.name}
          className="w-full h-full object-contain drop-shadow-2xl"
          loading="lazy"
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ type: 'spring', stiffness: 300 }}
        />
        
        {/* Shine effect */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      {/* Pokemon Name */}
      <h3 className="relative text-center font-bold text-foreground capitalize text-lg tracking-wide group-hover:text-primary transition-colors">
        {pokemon.name}
      </h3>

      {/* Add to collection */}
      {onAddToCollection && (
        <div className="relative mt-3">
          <Button
            variant={isAdded ? 'outline' : 'hero'}
            size="sm"
            className="w-full gap-2"
            onClick={(e) => {
              e.stopPropagation();
              onAddToCollection();
            }}
            disabled={isAdding || isAdded}
          >
            {isAdded ? (
              <>
                <Check className="w-4 h-4" />
                Added
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                {isAdding ? 'Adding...' : 'Add to Collection'}
              </>
            )}
          </Button>
        </div>
      )}
    </motion.div>
  );
};
