import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { usePokemonList, usePokemonSearch, usePokemon } from '@/hooks/usePokemon';
import { Pokemon } from '@/services/pokemonService';
import { PokemonCard } from '@/components/pokemon/PokemonCard';
import { PokemonDetail } from '@/components/pokemon/PokemonDetail';

const ITEMS_PER_PAGE = 12;

export const BrowseView = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [page, setPage] = useState(0);
  const [pokemonData, setPokemonData] = useState<Pokemon[]>([]);
  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null);
  const [isLoadingPokemon, setIsLoadingPokemon] = useState(false);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const { data: listData, isLoading: isLoadingList } = usePokemonList(ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);
  const { data: searchResults, isLoading: isSearching } = usePokemonSearch(debouncedQuery);

  // Fetch individual Pokemon data for list items
  useEffect(() => {
    if (listData && !debouncedQuery) {
      setIsLoadingPokemon(true);
      const fetchPokemonData = async () => {
        const promises = listData.results.map(async (item) => {
          const response = await fetch(item.url);
          return response.json();
        });
        const results = await Promise.all(promises);
        setPokemonData(results);
        setIsLoadingPokemon(false);
      };
      fetchPokemonData();
    }
  }, [listData, debouncedQuery]);

  const displayData = debouncedQuery ? searchResults : pokemonData;
  const isLoading = isLoadingList || isLoadingPokemon || isSearching;
  const totalCount = listData?.count || 0;
  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  return (
    <div className="min-h-screen gradient-bg pt-32 pb-16 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-primary neon-text">Pokédex</span> Browser
          </h1>
          <p className="text-muted-foreground text-lg max-w-lg mx-auto">
            Search and explore over 1,000 Pokémon from all generations
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="max-w-xl mx-auto mb-12"
        >
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search Pokémon by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-14 text-lg"
            />
            {isSearching && (
              <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary animate-spin" />
            )}
          </div>
        </motion.div>

        {/* Loading State */}
        {isLoading && !displayData?.length && (
          <div className="flex justify-center py-20">
            <div className="text-center">
              <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
              <p className="text-muted-foreground">Loading Pokémon...</p>
            </div>
          </div>
        )}

        {/* Pokemon Grid */}
        {displayData && displayData.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {displayData.map((pokemon, i) => (
                <PokemonCard
                  key={pokemon.id}
                  pokemon={pokemon}
                  onClick={() => setSelectedPokemon(pokemon)}
                  delay={i}
                />
              ))}
            </div>

            {/* Pagination (only for browsing, not searching) */}
            {!debouncedQuery && (
              <div className="flex items-center justify-center gap-4 mt-12">
                <Button
                  variant="outline"
                  onClick={() => setPage(p => Math.max(0, p - 1))}
                  disabled={page === 0 || isLoading}
                >
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Previous
                </Button>
                
                <span className="text-muted-foreground font-mono">
                  Page {page + 1} of {totalPages}
                </span>
                
                <Button
                  variant="outline"
                  onClick={() => setPage(p => p + 1)}
                  disabled={page >= totalPages - 1 || isLoading}
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            )}
          </motion.div>
        )}

        {/* No Results */}
        {debouncedQuery && searchResults?.length === 0 && !isSearching && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <p className="text-2xl mb-2">🔍</p>
            <p className="text-muted-foreground">No Pokémon found matching "{debouncedQuery}"</p>
          </motion.div>
        )}
      </div>

      {/* Detail Modal */}
      <PokemonDetail 
        pokemon={selectedPokemon} 
        onClose={() => setSelectedPokemon(null)} 
      />
    </div>
  );
};
