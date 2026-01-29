import { useEffect, useState } from 'react';
import { Header } from '@/components/layout/Header';
import { collectionService } from '@/services/collectionService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { CollectionItem } from '@/types/collection.types';
import { formatPokemonId } from '@/services/pokemonService';

const Collection = () => {
    const [collection, setCollection] = useState<CollectionItem[]>([]);
    const [count, setCount] = useState({ count: 0, max: 15, remaining: 15 });
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    const loadCollection = async () => {
        try {
            setLoading(true);
            const [items, countData] = await Promise.all([
                collectionService.getCollection(),
                collectionService.getCollectionCount(),
            ]);
            setCollection(items);
            setCount(countData);
        } catch (error: any) {
            toast({
                title: 'Error',
                description: error.response?.data?.detail || 'Failed to load collection',
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCollection();
    }, []);

    const handleRemove = async (id: number) => {
        try {
            await collectionService.removeFromCollection(id);
            toast({
                title: 'Success',
                description: 'Pokémon removed from collection',
            });
            loadCollection();
        } catch (error: any) {
            toast({
                title: 'Error',
                description: error.response?.data?.detail || 'Failed to remove Pokémon',
                variant: 'destructive',
            });
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background">
                <Header />
                <div className="container mx-auto px-4 py-8">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                        <p className="mt-4 text-muted-foreground">Loading collection...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <Header />
            <div className="container mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold mb-2">My Collection</h1>
                    <p className="text-muted-foreground">
                        {count.count} / {count.max} Pokémon collected
                    </p>
                    <div className="w-full bg-secondary rounded-full h-2 mt-2">
                        <div
                            className="bg-primary h-2 rounded-full transition-all"
                            style={{ width: `${(count.count / count.max) * 100}%` }}
                        />
                    </div>
                </div>

                {collection.length === 0 ? (
                    <Card className="text-center py-12">
                        <CardContent>
                            <Sparkles className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                            <h2 className="text-2xl font-semibold mb-2">No Pokémon Yet</h2>
                            <p className="text-muted-foreground mb-4">
                                Start scanning to build your collection!
                            </p>
                            <Button asChild>
                                <a href="/scan">Go to Scanner</a>
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {collection.map((item) => {
                            const pokemonData = item.pokemon_data;
                            const sprite = pokemonData?.sprites?.other?.['official-artwork']?.front_default ||
                                pokemonData?.sprites?.front_default;

                            return (
                                <Card key={item.id} className="overflow-hidden">
                                    <CardHeader className="pb-4">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="text-sm text-muted-foreground">
                                                    {formatPokemonId(item.pokemon_id)}
                                                </p>
                                                <CardTitle className="capitalize">{item.pokemon_name}</CardTitle>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleRemove(item.id)}
                                                className="text-destructive hover:text-destructive"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        {sprite && (
                                            <img
                                                src={sprite}
                                                alt={item.pokemon_name}
                                                className="w-full h-48 object-contain"
                                            />
                                        )}
                                        {pokemonData?.types && (
                                            <div className="flex gap-2 mt-4">
                                                {pokemonData.types.map((type: any) => (
                                                    <span
                                                        key={type.name}
                                                        className="px-3 py-1 rounded-full text-xs font-medium bg-secondary"
                                                    >
                                                        {type.name}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Collection;
