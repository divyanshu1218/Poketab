import { useQuery } from '@tanstack/react-query';
import { fetchPokemon, fetchPokemonList, searchPokemon, Pokemon, PokemonListResponse } from '@/services/pokemonService';

export const usePokemon = (nameOrId: string | number | null) => {
  return useQuery<Pokemon, Error>({
    queryKey: ['pokemon', nameOrId],
    queryFn: () => fetchPokemon(nameOrId!),
    enabled: !!nameOrId,
    staleTime: 1000 * 60 * 10, // 10 minutes
    retry: 1,
  });
};

export const usePokemonList = (limit: number = 20, offset: number = 0) => {
  return useQuery<PokemonListResponse, Error>({
    queryKey: ['pokemonList', limit, offset],
    queryFn: () => fetchPokemonList(limit, offset),
    staleTime: 1000 * 60 * 10,
  });
};

export const usePokemonSearch = (query: string) => {
  return useQuery<Pokemon[], Error>({
    queryKey: ['pokemonSearch', query],
    queryFn: () => searchPokemon(query),
    enabled: query.length >= 2,
    staleTime: 1000 * 60 * 5,
  });
};
