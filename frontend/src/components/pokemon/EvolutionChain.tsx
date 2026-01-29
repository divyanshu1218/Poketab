import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import axios from 'axios';

interface EvolutionStage {
    name: string;
    id: number;
    sprite: string;
}

interface EvolutionChainProps {
    speciesUrl: string;
}

export function EvolutionChain({ speciesUrl }: EvolutionChainProps) {
    const [evolutionChain, setEvolutionChain] = useState<EvolutionStage[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEvolutionChain = async () => {
            try {
                setLoading(true);

                // Fetch species data to get evolution chain URL
                const speciesResponse = await axios.get(speciesUrl);
                const evolutionChainUrl = speciesResponse.data.evolution_chain.url;

                // Fetch evolution chain
                const chainResponse = await axios.get(evolutionChainUrl);
                const chain = chainResponse.data.chain;

                // Parse evolution chain
                const stages: EvolutionStage[] = [];
                let current = chain;

                while (current) {
                    const speciesName = current.species.name;
                    const speciesId = parseInt(current.species.url.split('/').slice(-2, -1)[0]);

                    stages.push({
                        name: speciesName,
                        id: speciesId,
                        sprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${speciesId}.png`,
                    });

                    current = current.evolves_to[0];
                }

                setEvolutionChain(stages);
            } catch (error) {
                console.error('Error fetching evolution chain:', error);
            } finally {
                setLoading(false);
            }
        };

        if (speciesUrl) {
            fetchEvolutionChain();
        }
    }, [speciesUrl]);

    if (loading) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.41 }}
                className="mb-8"
            >
                <h3 className="text-lg font-bold text-primary flex items-center gap-2 mb-4">
                    <Sparkles className="w-4 h-4" />
                    Evolution Chain
                </h3>
                <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
            </motion.div>
        );
    }

    if (evolutionChain.length <= 1) {
        return null; // Don't show if Pokemon doesn't evolve
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.41 }}
            className="mb-8"
        >
            <h3 className="text-lg font-bold text-primary flex items-center gap-2 mb-4">
                <Sparkles className="w-4 h-4" />
                Evolution Chain
            </h3>
            <div className="flex items-center justify-center gap-4 flex-wrap">
                {evolutionChain.map((stage, index) => (
                    <div key={stage.id} className="flex items-center gap-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.41 + index * 0.1 }}
                            className="glass-card p-4 text-center"
                        >
                            <img
                                src={stage.sprite}
                                alt={stage.name}
                                className="w-24 h-24 mx-auto object-contain"
                            />
                            <p className="text-sm font-medium capitalize mt-2">{stage.name}</p>
                            <p className="text-xs text-muted-foreground">#{stage.id.toString().padStart(3, '0')}</p>
                        </motion.div>

                        {index < evolutionChain.length - 1 && (
                            <ArrowRight className="w-6 h-6 text-primary" />
                        )}
                    </div>
                ))}
            </div>
        </motion.div>
    );
}
