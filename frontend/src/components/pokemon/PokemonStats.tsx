import { motion } from 'framer-motion';
import { Pokemon, formatStatName, getStatColor } from '@/services/pokemonService';

interface PokemonStatsProps {
  pokemon: Pokemon;
}

export const PokemonStats = ({ pokemon }: PokemonStatsProps) => {
  const maxStat = 255; // Maximum possible stat value

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-primary flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-primary animate-glow-pulse" />
        Base Stats
      </h3>
      
      <div className="space-y-3">
        {pokemon.stats.map((stat, index) => {
          const percentage = (stat.base_stat / maxStat) * 100;
          const color = getStatColor(stat.base_stat);
          
          return (
            <div key={stat.stat.name} className="space-y-1">
              <div className="flex justify-between items-center">
                <span className="font-mono text-xs text-muted-foreground tracking-wider">
                  {formatStatName(stat.stat.name)}
                </span>
                <span className="font-mono text-sm font-bold" style={{ color }}>
                  {stat.base_stat}
                </span>
              </div>
              
              <div className="stat-bar">
                <motion.div
                  className="stat-bar-fill"
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ delay: index * 0.1, duration: 0.8, ease: 'easeOut' }}
                  style={{ backgroundColor: color }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Total Stats */}
      <div className="pt-4 border-t border-border">
        <div className="flex justify-between items-center">
          <span className="font-semibold text-muted-foreground">Total</span>
          <span className="font-mono text-xl font-bold text-primary">
            {pokemon.stats.reduce((sum, s) => sum + s.base_stat, 0)}
          </span>
        </div>
      </div>
    </div>
  );
};
