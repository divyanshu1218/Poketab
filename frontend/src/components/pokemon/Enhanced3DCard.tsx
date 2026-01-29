import { motion } from 'framer-motion';
import { useState } from 'react';
import { Pokemon, getTypeColor, formatPokemonId } from '@/services/pokemonService';

interface Enhanced3DCardProps {
    pokemon: Pokemon;
    onClick?: () => void;
    delay?: number;
}

export const Enhanced3DCard = ({ pokemon, onClick, delay = 0 }: Enhanced3DCardProps) => {
    const [rotateX, setRotateX] = useState(0);
    const [rotateY, setRotateY] = useState(0);
    const [isHovered, setIsHovered] = useState(false);

    const mainType = pokemon.types[0]?.type.name || 'normal';
    const typeColor = getTypeColor(mainType);
    const imageUrl = pokemon.sprites.other?.['official-artwork']?.front_default ||
        pokemon.sprites.front_default;

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const card = e.currentTarget;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateXValue = ((y - centerY) / centerY) * -10;
        const rotateYValue = ((x - centerX) / centerX) * 10;

        setRotateX(rotateXValue);
        setRotateY(rotateYValue);
    };

    const handleMouseLeave = () => {
        setRotateX(0);
        setRotateY(0);
        setIsHovered(false);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: delay * 0.1, duration: 0.4 }}
            whileHover={{ scale: 1.05 }}
            onClick={onClick}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={handleMouseLeave}
            className="cursor-pointer group relative"
            style={{
                perspective: '1000px',
            }}
        >
            <motion.div
                className="glass-card p-4 relative overflow-hidden"
                animate={{
                    rotateX,
                    rotateY,
                }}
                transition={{
                    type: 'spring',
                    stiffness: 400,
                    damping: 30,
                }}
                style={{
                    transformStyle: 'preserve-3d',
                }}
            >
                {/* Enhanced glow */}
                <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-60 transition-opacity blur-3xl"
                    style={{
                        background: `radial-gradient(circle at center, ${typeColor}, transparent 70%)`,
                        transform: 'translateZ(-10px)',
                    }}
                />

                {/* Pokemon ID */}
                <div className="relative flex justify-between items-start mb-2" style={{ transform: 'translateZ(20px)' }}>
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
                        animate={{
                            scale: isHovered ? 1.15 : 1,
                            rotateZ: isHovered ? 5 : 0,
                        }}
                        transition={{ type: 'spring', stiffness: 300 }}
                        style={{ transform: 'translateZ(40px)' }}
                    />

                    {/* Enhanced shine effect */}
                    <motion.div
                        className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent"
                        animate={{
                            opacity: isHovered ? 1 : 0,
                        }}
                        transition={{ duration: 0.3 }}
                    />
                </div>

                {/* Pokemon Name */}
                <h3
                    className="relative text-center font-bold text-foreground capitalize text-lg tracking-wide group-hover:text-primary transition-colors"
                    style={{ transform: 'translateZ(20px)' }}
                >
                    {pokemon.name}
                </h3>
            </motion.div>
        </motion.div>
    );
};
