const POKEAPI_BASE = 'https://pokeapi.co/api/v2';

export interface PokemonType {
  slot: number;
  type: {
    name: string;
    url: string;
  };
}

export interface PokemonStat {
  base_stat: number;
  effort: number;
  stat: {
    name: string;
    url: string;
  };
}

export interface PokemonAbility {
  ability: {
    name: string;
    url: string;
  };
  is_hidden: boolean;
  slot: number;
}

export interface Pokemon {
  id: number;
  name: string;
  height: number;
  weight: number;
  types: PokemonType[];
  stats: PokemonStat[];
  abilities: PokemonAbility[];
  sprites: {
    front_default: string;
    front_shiny: string;
    other: {
      'official-artwork': {
        front_default: string;
        front_shiny: string;
      };
      dream_world: {
        front_default: string;
      };
    };
  };
  species_url?: string;
}

export interface PokemonListItem {
  name: string;
  url: string;
}

export interface PokemonListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: PokemonListItem[];
}

export const fetchPokemon = async (nameOrId: string | number): Promise<Pokemon> => {
  const response = await fetch(`${POKEAPI_BASE}/pokemon/${nameOrId.toString().toLowerCase()}`);
  if (!response.ok) {
    throw new Error('Pokémon not found');
  }
  return response.json();
};

export const fetchPokemonList = async (limit: number = 20, offset: number = 0): Promise<PokemonListResponse> => {
  const response = await fetch(`${POKEAPI_BASE}/pokemon?limit=${limit}&offset=${offset}`);
  if (!response.ok) {
    throw new Error('Failed to fetch Pokémon list');
  }
  return response.json();
};

let cachedPokemonList: PokemonListItem[] | null = null;
let cachedPokemonListPromise: Promise<PokemonListItem[]> | null = null;

const getPokemonListCached = async (): Promise<PokemonListItem[]> => {
  if (cachedPokemonList) return cachedPokemonList;
  if (cachedPokemonListPromise) return cachedPokemonListPromise;

  cachedPokemonListPromise = fetch(`${POKEAPI_BASE}/pokemon?limit=2000`)
    .then((res) => res.json())
    .then((list: PokemonListResponse) => {
      cachedPokemonList = list.results;
      return list.results;
    })
    .finally(() => {
      cachedPokemonListPromise = null;
    });

  return cachedPokemonListPromise;
};

export const searchPokemon = async (query: string): Promise<Pokemon[]> => {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return [];

  const list = await getPokemonListCached();
  const startsWith = list.filter((p) => p.name.startsWith(normalized));
  const contains = list.filter(
    (p) => !p.name.startsWith(normalized) && p.name.includes(normalized)
  );

  const matches = [...startsWith, ...contains].slice(0, 12);

  const pokemonPromises = matches.map((p) =>
    fetchPokemon(p.name).catch(() => null)
  );

  const results = await Promise.all(pokemonPromises);
  return results.filter((p): p is Pokemon => p !== null);
};

export const getTypeColor = (type: string): string => {
  const colors: Record<string, string> = {
    normal: '#A8A878',
    fire: '#F08030',
    water: '#6890F0',
    electric: '#F8D030',
    grass: '#78C850',
    ice: '#98D8D8',
    fighting: '#C03028',
    poison: '#A040A0',
    ground: '#E0C068',
    flying: '#A890F0',
    psychic: '#F85888',
    bug: '#A8B820',
    rock: '#B8A038',
    ghost: '#705898',
    dragon: '#7038F8',
    dark: '#705848',
    steel: '#B8B8D0',
    fairy: '#EE99AC',
  };
  return colors[type] || '#68A090';
};

export const formatStatName = (name: string): string => {
  const statNames: Record<string, string> = {
    hp: 'HP',
    attack: 'ATK',
    defense: 'DEF',
    'special-attack': 'SP.ATK',
    'special-defense': 'SP.DEF',
    speed: 'SPD',
  };
  return statNames[name] || name.toUpperCase();
};

export const getStatColor = (value: number): string => {
  if (value >= 150) return 'hsl(190, 100%, 50%)';
  if (value >= 100) return 'hsl(142, 71%, 45%)';
  if (value >= 70) return 'hsl(45, 100%, 51%)';
  if (value >= 50) return 'hsl(25, 95%, 53%)';
  return 'hsl(0, 72%, 51%)';
};

export const formatPokemonId = (id: number): string => {
  return `#${id.toString().padStart(4, '0')}`;
};
